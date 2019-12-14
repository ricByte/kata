import { BaseHandler, ValidatedHandler, Request } from './types';
import { Context } from 'aws-lambda';
import { ValidatorOptions, validate } from 'class-validator';
import { FailedValidationError } from '@model/app/errors';
import { logger } from '../../service/logger';
import { getErrorForResponse } from '../../service/response';


export const httpDecorator = (fn: BaseHandler) => {

    const handle = async (event: any, context: Context) => {
        try {
            const options = new LambdaOptions(event, context);
            const eventBody = {
                ...JSON.parse(event.body),
                ...event.pathParameters,
                userId: event.headers.user
            };
            const body = await fn(eventBody, options);
            return {
                statusCode: 200,
                body: JSON.stringify(body, null, 2),
            };
        } catch (error) {
            return {
                statusCode: 400,
                body: JSON.stringify(error, null, 2),
            };
        }
    };

    return (event: any = {}, context: Context) => {
        return handle(event, context);
    };
};

export const validationDecorator = async <E>(event: E, options: LambdaOptions, handler: ValidatedHandler<E>) => {

    const validationErrors = await validate(event, options.validation);
    if (validationErrors.length > 0) {
        const failedValidationError = new FailedValidationError(
            `Error occurred while validating in ${options.request.executor}`,
            options.request.id,
            validationErrors,
        );
        throw getErrorForResponse(failedValidationError);
    }
    return handler(event);
};


export class LambdaOptions {

    validation: ValidatorOptions;
    request: Request;

    constructor(event: any, context: Context) {
        this.validation = defaultValidatorOptions();
        this.request = {
            headers: event.headers,
            executor: context.functionName,
            id: context.awsRequestId,
        };
        logger.generateMarker(this.request.id);
    };
}


export const defaultValidatorOptions = (): ValidatorOptions => ({
    validationError: {
        target: false,
    },
    whitelist: true,
    skipMissingProperties: true,
});

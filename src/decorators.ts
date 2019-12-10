import { BaseHandler, LambdaOptions } from './types';
import { Context } from 'aws-lambda';


export const httpDecorator = (fn: BaseHandler) => {

    const handle = async (event: any, context: Context) => {
        try {
            const options = new LambdaOptions(event, context);
            const body = await fn(event, options);
            return {
                statusCode: 200,
                body: JSON.stringify(body, null, 2)
            };
        } catch (error) {
            return {
                statusCode: 400,
                body: JSON.stringify(error, null, 2)
            }
        }
    };

    return (event: any = {}, context: Context) => {
        return handle(event, context);
    };
};

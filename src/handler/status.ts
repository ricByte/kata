import { httpDecorator, LambdaOptions } from './utils/decorators';

export const lambda = httpDecorator(async (event: any, options: LambdaOptions) => {
    return {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
    };
});

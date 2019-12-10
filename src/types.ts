import { Context } from "aws-lambda";

export type BaseHandler = (event: any, options: LambdaOptions) => Promise<any>;

export type Request = {
    headers: object;
    executor: string;
};

export class LambdaOptions {

    request: Request;

    constructor(event: any, context: Context) {
        this.request = {
            headers: event.headers,
            executor: context.functionName
        };
    };
}

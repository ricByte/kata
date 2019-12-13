import { LambdaOptions } from '@handler/utils/decorators';

export type BaseHandler = (event: any, options: LambdaOptions) => Promise<any>;
export type ValidatedHandler<E> = (event: E) => Promise<any>;

export type Request = {
    headers: object;
    executor: string;
    id: string;
};

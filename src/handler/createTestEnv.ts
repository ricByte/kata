import { httpDecorator, LambdaOptions } from './utils/decorators';
import { testEnvService } from '../service/testEnvService';


export const handler = async (event: any = {}, options: LambdaOptions) => {

    try {
        await testEnvService.create();
        return Promise.resolve('Environment Prepared! :D');
    } catch (e) {
        return Promise.reject(e.message);
    }

};

export const lambda = httpDecorator(handler);

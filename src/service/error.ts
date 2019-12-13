import { logger } from './logger';
import { GenericError } from '@model/app/errors';


export const createErrorForService = (message: string, e?: any) => {
    const logMarker: string = logger.error(message, e);
    throw new GenericError(message, logMarker);
};

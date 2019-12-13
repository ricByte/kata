import { GenericError, ErrorTypes } from '@model/app/errors';

export class ErrorResponse {
    info: any;
    code: ErrorTypes;
    logMarker: string;
    message: string;

    constructor(error: GenericError) {
        const {
            message,
            code,
            logMarker,
            name,
            ...info
        } = error;
        this.message = message;
        this.logMarker = logMarker;
        this.code = code;
        this.info = info;
    }

}

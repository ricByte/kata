import { ValidationError } from 'class-validator';


export enum ErrorTypes {
    GENERIC_ERROR = 'GENERIC_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR'
}


export class GenericError extends Error {

    code: ErrorTypes;
    logMarker: string;
    message: string;

    constructor(message: string, marker: string, code = ErrorTypes.GENERIC_ERROR) {
        super();
        this.message = message;
        this.logMarker = marker;
        this.code = code;
        this.name = code;
    }
}


export class FailedValidationError extends GenericError {

    errors: ValidationError[];

    constructor(message: string, marker: string, errors: ValidationError[]) {
        super(message, marker, ErrorTypes.VALIDATION_ERROR);
        this.errors = errors;
    }
}

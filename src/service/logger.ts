import uuidv4 from 'uuidv4';
import { GenericError } from '@model/app/errors';

const toJson = (entity: object) => JSON.stringify(entity, null, 3);
const LOG_LABEL = 'Request with id:';

export class Logger {
    logMarker: string;

    constructor() {
        this.generateMarker();
    }

    generateMarker(id: string = uuidv4()) {
        this.logMarker = id;
    }

    generateMarkerLabel(): string {
        return `${LOG_LABEL}${this.logMarker};`;
    }

    debug(message: string, entity?: any): void {
        console.debug('\x1b[0m', this.generateMarkerLabel(), `${message}${entity ? ' -> ' + toJson(entity) : ''}`);
    }

    info(message: string, entity?: any): void {
        console.info('\x1b[0m', this.generateMarkerLabel(), `${message}${entity ? ' -> ' + toJson(entity) : ''}`);
    }

    warn(message: string, entity?: any): void {
        console.warn('\x1b[43m', this.generateMarkerLabel(), `${message}${entity ? ' -> ' + toJson(entity) : ''}`);
    }

    error(message: string, error?: Error): string {
        console.error('\x1b[31m', this.generateMarkerLabel(), `Custom error message: ${message}`);
        console.error('\x1b[31m', error);
        return this.logMarker;
    }
}

/**
 * @name logger
 * @description Service used to log to CloudWatch
 * */
export const logger = new Logger();

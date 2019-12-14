import { IsNotEmpty, IsOptional, IsNumberString, IsDefined, IsString } from 'class-validator';

enum MESSAGE_VALIDATION_MESSAGE {
    USER_ID_MISSING = 'MISSING USER REFERENCE',
    USER_ID_NOT_VALID = 'NOT VALID USER REFERENCE',
    TIME_EMPTY = 'TIME SHOULD BE EVALUATED',
    TIME_NOT_VALID = 'NOT VALID TIME. Example: "1234"'
}

export class MessagesEvent {

    @IsOptional()
    @IsNotEmpty({ message: MESSAGE_VALIDATION_MESSAGE.TIME_EMPTY })
    @IsNumberString({ message: MESSAGE_VALIDATION_MESSAGE.TIME_NOT_VALID })
    time: string;

    @IsDefined({ message: MESSAGE_VALIDATION_MESSAGE.USER_ID_MISSING })
    @IsString({ message: MESSAGE_VALIDATION_MESSAGE.USER_ID_NOT_VALID })
    @IsNotEmpty({ message: MESSAGE_VALIDATION_MESSAGE.USER_ID_NOT_VALID })
    userId: string;

    constructor(fields: Partial<MessagesEvent>) {
        Object.assign(this, fields);
    }
}

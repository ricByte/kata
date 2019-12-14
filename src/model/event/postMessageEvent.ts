import { IsDefined, IsString, IsNotEmpty } from 'class-validator';

enum MESSAGE_VALIDATION_MESSAGE {
    USER_ID_MISSING = 'MISSING USER REFERENCE',
    USER_ID_NOT_VALID = 'NOT VALID USER REFERENCE',
    TEXT = 'MISSING TEXT',
}

export class PostMessageEvent {

    @IsDefined({ message: MESSAGE_VALIDATION_MESSAGE.USER_ID_MISSING })
    @IsString({ message: MESSAGE_VALIDATION_MESSAGE.USER_ID_NOT_VALID })
    @IsNotEmpty({ message: MESSAGE_VALIDATION_MESSAGE.USER_ID_NOT_VALID })
    userId: string;

    @IsDefined({ message: MESSAGE_VALIDATION_MESSAGE.TEXT })
    @IsString({ message: MESSAGE_VALIDATION_MESSAGE.TEXT })
    @IsNotEmpty({ message: MESSAGE_VALIDATION_MESSAGE.TEXT })
    text: string;

    constructor(fields: Partial<PostMessageEvent>) {
        Object.assign(this, fields);
    }
}

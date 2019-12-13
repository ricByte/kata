import { IsDefined, IsString, IsNotEmpty } from 'class-validator';

enum MESSAGE_VALIDATION_MESSAGE {
    USER_ID = 'MISSING USER REFERENCE',
    TEXT = 'MISSING TEXT'
}

export class PostMessageEvent {

    @IsDefined({ message: MESSAGE_VALIDATION_MESSAGE.USER_ID })
    @IsString({ message: MESSAGE_VALIDATION_MESSAGE.USER_ID })
    @IsNotEmpty({ message: MESSAGE_VALIDATION_MESSAGE.USER_ID })
    userId: string;

    @IsDefined({ message: MESSAGE_VALIDATION_MESSAGE.TEXT })
    @IsString({ message: MESSAGE_VALIDATION_MESSAGE.TEXT })
    @IsNotEmpty({ message: MESSAGE_VALIDATION_MESSAGE.TEXT })
    text: string;

    constructor(fields: Partial<PostMessageEvent>) {
        Object.assign(this, fields);
    }
}

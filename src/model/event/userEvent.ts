import { IsDefined, IsString, IsNotEmpty } from 'class-validator';

enum USER_VALIDATION_MESSAGE {
    NAME = 'MISSING NAME',
    SURNAME = 'MISSING SURNAME'
}

export class UserEvent {

    @IsDefined({ message: USER_VALIDATION_MESSAGE.NAME })
    @IsString({ message: USER_VALIDATION_MESSAGE.NAME })
    @IsNotEmpty({ message: USER_VALIDATION_MESSAGE.NAME })
    name: string;

    @IsDefined({ message: USER_VALIDATION_MESSAGE.SURNAME })
    @IsString({ message: USER_VALIDATION_MESSAGE.SURNAME })
    @IsNotEmpty({ message: USER_VALIDATION_MESSAGE.SURNAME })
    surname: string;

    constructor(fields: Partial<UserEvent>) {
        Object.assign(this, fields);
    }
}

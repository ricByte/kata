import { GenericError } from '../model/app/errors';
import { ErrorResponse } from '../model/response/error';
import { User } from '@model/app/user';
import { UserResponse } from '@model/response/userResponse';
import { Message } from '@model/app/message';
import { PostMessageResponse } from '@model/response/postMessageResponse';


export const getUserForResponse = (user: User): UserResponse => ({
    ...user,
    createdAt: user.createdAt.toISOString()
});

export const getMessageForResponse = (message: Message): PostMessageResponse => ({
    ...message,
    createdAt: message.createdAt.toISOString()
});

export const getErrorForResponse = (error: GenericError): ErrorResponse => new ErrorResponse(error);

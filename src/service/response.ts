import { GenericError } from '../model/app/errors';
import { ErrorResponse } from '../model/response/error';
import { User } from '@model/app/user';
import { UserResponse } from '@model/response/userResponse';
import { Message } from '@model/app/message';
import { PostMessageResponse } from '@model/response/postMessageResponse';
import { MessageDetailedResponse } from '@model/response/messageDetailedResponse';


export const getUserForResponse = (user: User): UserResponse => ({
    ...user,
    createdAt: user.createdAt.toISOString()
});

export const getMessageForResponse = (message: Message): PostMessageResponse => ({
    ...message,
    createdAt: message.createdAt.toISOString()
});

export const getErrorForResponse = (error: GenericError): ErrorResponse => new ErrorResponse(error);

export const mergeUsersAndMessages = (users: User[], messages: Message[]): MessageDetailedResponse[] => {
    const userMap: Map<string, UserResponse> = users.reduce((acc: Map<string, UserResponse>, current: User) => {
        acc.set(current.userId, getUserForResponse(current));
        return acc;
    }, new Map<string, UserResponse>());

    return messages.map((message: Message): MessageDetailedResponse => {
        return {
            ...getMessageForResponse(message),
            user: userMap.get(message.userId)
        }
    });
};

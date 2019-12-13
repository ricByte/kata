import { User } from '@model/app/user';
import { UserPersist } from '@model/persist/userPersist';

import { transformDateForDB, transformDateFromDB } from './util';
import { Message } from '@model/app/message';
import { MessagePersist } from '@model/persist/messagePersist';


export const buildUserForPersisting = (user: User): UserPersist => {
    return {
        userId: user.userId,
        createdAt: transformDateForDB(user.createdAt),
        name: user.name,
        surname: user.surname,
    };
}

export const buildMessageForPersisting = (message: Message): MessagePersist => {
    return {
        ...message,
        createdAt: transformDateForDB(message.createdAt),
    };
}

export const buildUserFromDB = (user: UserPersist): User => ({
    ...user,
    createdAt: transformDateFromDB(user.createdAt)
});

import { User } from '@model/app/user';
import { UserPersist } from '@model/persist/userPersist';

import { transformDateForDB, transformDateFromDB } from './util';


export const buildUserForPersisting = (user: User): UserPersist => {
    return {
        userId: user.userId,
        createdAt: transformDateForDB(user.createdAt),
        name: user.name,
        surname: user.surname,
    };
}

export const buildUserFromDB = (user: UserPersist): User => ({
    ...user,
    createdAt: transformDateFromDB(user.createdAt)
});

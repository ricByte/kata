import { UserEvent } from '@model/event/userEvent';
import { User } from '@model/app/user';
import uuidv4 from 'uuidv4';
import { userDynamoResource } from '../resources/dynamoDBResources';
import { logger } from './logger';
import { GenericError } from '@model/app/errors';
import { createErrorForService } from './error';


export class UserService {

    async createUser(event: UserEvent): Promise<User> {
        const user: User = this.getUserFromUserEvent(event);
        try {
            await userDynamoResource.saveUser(user);
        } catch (e) {
            createErrorForService('Can\'t save User', e);
        }
        return user;
    }

    protected getUserFromUserEvent(req: UserEvent): User {
        return {
            userId: uuidv4(),
            createdAt: new Date(),
            name: req.name,
            surname: req.surname,
        }
    }

    async verifyUser(userId: string): Promise<boolean> {
        try {
            const user: User | undefined = await userDynamoResource.getUserById(userId);
            return !!user;
        } catch (e) {
            createErrorForService(`Can't verify user`, e);
        }
    }
}

export const userService = new UserService();

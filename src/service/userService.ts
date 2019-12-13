import { UserEvent } from '@model/event/userEvent';
import { User } from '@model/app/user';
import uuidv4 from 'uuidv4';
import { userDynamoResource } from '../resources/dynamoDBResources';
import { logger } from './logger';
import { GenericError } from '@model/app/errors';


export class UserService {

    async createUser(event: UserEvent): Promise<User> {
        const user: User = this.getUserFromUserEvent(event);
        try {
            await userDynamoResource.saveUser(user);
        } catch (e) {
            const logMarker: string = logger.error('Can\'t save User', e);
            throw new GenericError('Can\'t save User', logMarker);
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
}

export const userService = new UserService();

import { createErrorForService } from './error';
import { UserEvent } from '@model/event/userEvent';
import { userService } from './userService';
import { PostMessageEvent } from '@model/event/postMessageEvent';
import { User } from '@model/app/user';
import { messagingService } from './messagingService';
import { Message } from '@model/app/message';


export class TestEnvService {
    async create(): Promise<boolean> {
        try {
            const usersSaved: User[] = await Promise.all(getUsers()
                .map((event: UserEvent): Promise<User> => {
                    return userService.createUser(event);
                }));
            const usersMessages = await Promise.all(usersSaved
                .reduce((acc: Promise<Message>[], event: User): Promise<Message>[] => {
                    const newMessages: Promise<Message>[] = getMessages(event.userId)
                        .map((m: PostMessageEvent) => {
                            return messagingService.postMessage(m)
                        });
                    acc.push(...newMessages);
                    return acc;
                }, []));
            return true;
        } catch (e) {
            createErrorForService('Environment can not prepare! :(', e);
        }

    }
}


const getUsers = (): UserEvent[] => {
    const users: UserEvent[] = [];
    for (let i = 0; i < parseInt(process.env.userNumber); i++) {
        users.push({
            name: `user${i}`,
            surname: `surname${i}`,
        });
    }
    return users;
};

const getMessages = (id: string): PostMessageEvent[] => {
    const users: PostMessageEvent[] = [];
    for (let i = 0; i < parseInt(process.env.messagePerUserNumber); i++) {
        users.push({
            userId: id,
            text: `this is the code of a message for user: ${id} <br> N.${i}`,
        });
    }
    return users;
};

export const testEnvService = new TestEnvService();

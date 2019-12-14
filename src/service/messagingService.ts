import { PostMessageEvent } from '@model/event/postMessageEvent';
import { userService } from './userService';
import { createErrorForService } from './error';
import { Message } from '@model/app/message';
import { messageDynamoResource } from '../resources/dynamoDBResources';
import uuidv4 from 'uuidv4';
import { User } from '@model/app/user';


export class MessagingService {
    async postMessage(postMessageEvent: PostMessageEvent): Promise<Message> {
        try {
            const isVerifiedUser: boolean = await userService.verifyUser(postMessageEvent.userId);
            if (isVerifiedUser) {
                const message = this.getUserFromMessageEvent(postMessageEvent);
                await messageDynamoResource.postMessage(message);
                return message;
            }
        } catch (e) {
            createErrorForService('Can\'t post message', e)
        }

        createErrorForService('User not verified')
    }

    async getMessagesPerPage(userId: string, time: string = process.env.firstAvailableDate): Promise<Message[]> {
        try {
            const isVerifiedUser: boolean = await userService.verifyUser(userId);
            if (isVerifiedUser) {
                const lastMessageDate = new Date(parseInt(time));
                return await messageDynamoResource.getMessagesPerPage(lastMessageDate);
            }
        } catch (e) {
            createErrorForService('Can\'t find messages', e)
        }
    }

    protected getUserFromMessageEvent(req: PostMessageEvent): Message {
        return {
            userId: req.userId,
            createdAt: new Date(),
            text: req.text,
            messageId: uuidv4(),
        }
    }

}

export const messagingService = new MessagingService();

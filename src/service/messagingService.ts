import { PostMessageEvent } from '@model/event/postMessageEvent';
import { userService } from './userService';
import { createErrorForService } from './error';
import { Message } from '@model/app/message';
import { messageDynamoResource } from '../resources/dynamoDBResources';
import uuidv4 from 'uuidv4';


export class MessagingService {
    async postMessage(postMessageEvent: PostMessageEvent): Promise<Message | undefined> {
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

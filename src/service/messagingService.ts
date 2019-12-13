import { PostMessageEvent } from '@model/event/postMessageEvent';
import { userService } from './userService';
import { createErrorForService } from './error';
import { Message } from '@model/app/message';


export class MessagingService {
    async postMessage(message: PostMessageEvent): Promise<Message> {
        try {
            const isVerifiedUser: boolean = await userService.verifyUser(message.userId);
            return {
                userId: 'string',
                text: 'string',
                createdAt: new Date(),
                messageId: 'string',
            }
        } catch (e) {
            createErrorForService('Can\'t post message', e)
        }
    }

}

export const messagingService = new MessagingService();

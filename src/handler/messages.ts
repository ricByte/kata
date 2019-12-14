import { httpDecorator, LambdaOptions, validationDecorator } from './utils/decorators';
import { getErrorForResponse, getMessageForResponse, mergeUsersAndMessages } from '../service/response';
import { ErrorResponse } from '@model/response/error';
import { MessagesEvent } from '@model/event/messagesEvent';
import { MessagesResponse } from '@model/response/messagesResponse';
import { Message } from '@model/app/message';
import { messagingService } from '../service/messagingService';
import { User } from '@model/app/user';
import { userService } from '../service/userService';


export const handler = async (event: any = {}, options: LambdaOptions) => {
    const eventToValidate = new MessagesEvent({ ...event });

    return validationDecorator(eventToValidate, options, async (eventValidated: MessagesEvent): Promise<MessagesResponse | ErrorResponse> => {
        try {
            const messageList: Message[] = await messagingService.getMessagesPerPage(eventValidated.userId, eventValidated.time);
            const userIds: string[] = messageList.map((m: Message) => (m.userId));
            const userForMessage: User[] = await userService.getUserByIdList(userIds);
            return mergeUsersAndMessages(userForMessage, messageList);
        } catch (e) {
            return getErrorForResponse(e);
        }
    });

};

export const lambda = httpDecorator(handler);

import { httpDecorator, LambdaOptions, validationDecorator } from './utils/decorators';
import { getErrorForResponse, getMessageForResponse } from '../service/response';
import { ErrorResponse } from '@model/response/error';
import { PostMessageEvent } from '@model/event/postMessageEvent';
import { PostMessageResponse } from '@model/response/postMessageResponse';
import { messagingService } from '../service/messagingService';
import { Message } from '@model/app/message';


export const handler = async (event: any = {}, options: LambdaOptions) => {
    const eventToValidate = new PostMessageEvent({ ...event });
    return validationDecorator(eventToValidate, options, async (eventValidated: PostMessageEvent): Promise<PostMessageResponse | ErrorResponse> => {
        try {
            const messageSaved: Message = await messagingService.postMessage(eventValidated);
            return getMessageForResponse(messageSaved);
        } catch (e) {
            return getErrorForResponse(e);
        }


    });
};

export const lambda = httpDecorator(handler);

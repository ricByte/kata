import { User } from '@model/app/user';

import { httpDecorator, LambdaOptions, validationDecorator } from './utils/decorators';
import { UserEvent } from '@model/event/userEvent';
import { userService } from '../service/userService';
import { getUserForResponse, getErrorForResponse } from '../service/response';
import { UserResponse } from '@model/response/userResponse';
import { ErrorResponse } from '@model/response/error';


export const handler = async (event: any = {}, options: LambdaOptions) => {
    const eventToValidate = new UserEvent({ ...event });
    return validationDecorator(eventToValidate, options, async (eventValidated: UserEvent): Promise<UserResponse | ErrorResponse> => {
        try {
            const userSaved: User = await userService.createUser(event);
            return getUserForResponse(userSaved);
        } catch (e) {
            return getErrorForResponse(e);
        }


    });
};

export const lambda = httpDecorator(handler);

import { GenericError } from '../model/app/errors';
import { ErrorResponse } from '../model/response/error';
import { User } from '@model/app/user';
import { UserResponse } from '@model/response/userResponse';


export const getUserForResponse = (user: User): UserResponse => ({
    ...user,
    createdAt: user.createdAt.toISOString()
});

export const getErrorForResponse = (error: GenericError): ErrorResponse => new ErrorResponse(error);

import { User } from '@model/app/user';
import { Message } from '@model/app/message';


export interface UserResource {
    getUserById(userId: string): Promise<User>
    saveUser(user: User): Promise<boolean>
}

export interface MessagesResource {
    postMessage(message: Message): Promise<boolean>
}

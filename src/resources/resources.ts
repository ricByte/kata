import { User } from '@model/app/user';


export interface UserResource {
    getUserById(userId: string): Promise<User>
    saveUser(user: User): Promise<boolean>
}

import { User } from '@model/app/user';


export interface UserResource {
    // getUserById(guid: string): Promise<UserPersist>
    saveUser(user: User): Promise<boolean>
}

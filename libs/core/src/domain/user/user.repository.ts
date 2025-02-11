import type { UserEntity } from "./user.entity";

export interface UserRepository {

    /**
     * Get user by username
     * @param username
     * @returns UserEntity
     */
    getUserInfoByUsername(username:string): Promise<UserEntity | undefined>;
}
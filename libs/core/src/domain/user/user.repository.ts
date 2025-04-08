import type { UserEntity } from "./user.entity";

export interface UserRepository {
    /**
     * Create user
     * @param user
     * @returns UserEntity
     */
    createUser(user:UserEntity): Promise<UserEntity>;

    /**
     * Get user by userId
     * @param userId
     * @returns UserEntity
     */
    getUserInfoByUserId(userId:string): Promise<UserEntity | undefined>;
}
import type { UserEntity } from './user.entity';

export interface UserRepository {
    /**
     * Create user
     * @param user
     * @returns UserEntity
     */
    createUser(user: UserEntity): Promise<UserEntity>;

    /**
     * Get user by userId
     * @param userId
     * @returns UserEntity
     */
    getUserInfoByUserId(userId: string): Promise<UserEntity | undefined>;

    /**
     * Get user by username
     * @param username
     * @returns UserEntity
     */
    getUserByUsername(username: string): Promise<UserEntity | undefined>;

    /**
     * Get user by passport wallet address
     * @param walletAddress
     * @returns UserEntity
     */
    getUserByPassportWallet(walletAddress: string): Promise<UserEntity | undefined>;

    /**
     * Get user by discord id
     * @param discordId
     * @returns UserEntity
     */
    getUserByDiscordId(discordId: string): Promise<UserEntity | undefined>;

    /**
     * Get user by google email
     * @param googleEmail
     * @returns UserEntity
     */
    getUserByGoogleEmail(googleEmail: string): Promise<UserEntity | undefined>;

    /**
     * Get user by passport token ID
     * @param tokenId
     * @returns UserEntity
     */
    findByPassportTokenId(tokenId: string): Promise<UserEntity | undefined>;
}

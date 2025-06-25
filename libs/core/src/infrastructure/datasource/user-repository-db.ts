import type { UserEntity } from '@app/core/domain/user/user.entity';
import type {
    GetAllUsersOptions,
    GetAllUsersResult,
    UserRepository,
} from '@app/core/domain/user/user.repository';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Injectable } from '@nestjs/common';
import { StoryStatus, TaskStatus, UserRoleType } from '@prisma/client';
import type { UserRelationModel } from 'prisma/relation-model/user-relation-model';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class UserRepositoryDb implements UserRepository {
    // Cache configuration
    private static readonly USER_CACHE_PREFIX = 'user';
    private static readonly CACHE_TTL_SECONDS = 300; // 5 minutes to match dashboard stats TTL

    constructor(
        private prisma: PrismaService,
        private cachingService: CachingService,
    ) {}

    // Complete include pattern matching UserRelationModel
    // Basic user info for authentication and profile
    private readonly userBasicInclude = {
        user_info: true,
    };

    // Full user data for detailed operations
    private readonly userFullInclude = {
        user_info: true,
        user_achievements: true,
        user_onchain_item: true,
        user_item_claim_log: true,
        user_story_log: true,
        user_task_log: true,
        user_travel_log: true,
        discord_activity_log: true,
        discord_user_roles: true,
        discord_rewarded_roles: true,
        user_invite_log: true,
    };

    // User with recent activity for feeds and stats
    private readonly userWithActivityInclude = {
        user_info: true,
        user_task_log: {
            where: { status: TaskStatus.COMPLETED },
            take: 10,
            orderBy: { ins_date_time: 'desc' },
        },
        user_story_log: {
            where: { status: StoryStatus.COMPLETED },
            take: 10,
            orderBy: { ins_date_time: 'desc' },
        },
        user_travel_log: {
            take: 20,
            orderBy: { ins_date_time: 'desc' },
        },
    };

    // Legacy include for backward compatibility
    private readonly userInclude = this.userFullInclude;

    async createUser(user: UserEntity): Promise<UserEntity> {
        const createdUser = await this.prisma.user.create({
            data: UserMapper.userEntityToPrismaInput(user),
            include: this.userInclude,
        });

        return UserMapper.prismaModelToUserEntity(createdUser as UserRelationModel);
    }

    async getUserInfoByUserId(userId: string): Promise<UserEntity | undefined> {
        const cacheKey = `${UserRepositoryDb.USER_CACHE_PREFIX}:${userId}:full`;
        
        const fetchUserFn = async (): Promise<UserEntity | undefined> => {
            const user = await this.prisma.user.findFirst({
                where: {
                    user_id: userId,
                },
                include: this.userInclude,
            });

            return user ? UserMapper.prismaModelToUserEntity(user as UserRelationModel) : undefined;
        };

        try {
            return await this.cachingService.getOrSet<UserEntity | undefined>(
                cacheKey,
                fetchUserFn,
                UserRepositoryDb.CACHE_TTL_SECONDS,
            );
        } catch (error) {
            // If caching fails, fallback to direct database call
            return await fetchUserFn();
        }
    }

    /**
     * Invalidates cached user data when user activities change
     * Should be called after quest completion, story completion, etc.
     */
    async invalidateUserCache(userId: string): Promise<void> {
        try {
            const cacheKey = `${UserRepositoryDb.USER_CACHE_PREFIX}:${userId}:full`;
            await this.cachingService.delete(cacheKey);
        } catch (error) {
            // Silently handle cache deletion failures
        }
    }

    async getUserByUsername(username: string): Promise<UserEntity | undefined> {
        const user = await this.prisma.user.findFirst({
            where: {
                username,
            },
            include: this.userBasicInclude,
        });

        return user ? UserMapper.prismaModelToUserEntity(user as UserRelationModel) : undefined;
    }

    async getUserByPassportWallet(walletAddress: string): Promise<UserEntity | undefined> {
        const user = await this.prisma.user.findFirst({
            where: {
                passport_wallet_address: walletAddress,
            },
            include: this.userBasicInclude,
        });

        return user ? UserMapper.prismaModelToUserEntity(user as UserRelationModel) : undefined;
    }

    async getUserByDiscordId(discordId: string): Promise<UserEntity | undefined> {
        const user = await this.prisma.user.findFirst({
            where: {
                discord_id: discordId,
            },
            include: this.userBasicInclude,
        });

        return user ? UserMapper.prismaModelToUserEntity(user as UserRelationModel) : undefined;
    }

    async getUserByGoogleEmail(googleEmail: string): Promise<UserEntity | undefined> {
        const user = await this.prisma.user.findFirst({
            where: {
                google_email: googleEmail,
            },
            include: this.userBasicInclude,
        });

        return user ? UserMapper.prismaModelToUserEntity(user as UserRelationModel) : undefined;
    }

    async findByPassportTokenId(tokenId: string): Promise<UserEntity | undefined> {
        const user = await this.prisma.user.findFirst({
            where: {
                user_info: {
                    passport_token_id: tokenId,
                },
            },
            include: this.userBasicInclude,
        });

        return user ? UserMapper.prismaModelToUserEntity(user as UserRelationModel) : undefined;
    }

    async getAllUsersWithPagination(options: GetAllUsersOptions): Promise<GetAllUsersResult> {
        const {
            page = 1,
            limit = 20,
            searchTerm,
            role,
            isPremium,
            isBanned,
            startDate,
            endDate,
            sortBy = 'registered_at',
            sortOrder = 'desc',
        } = options;

        // Ensure reasonable limits
        const finalLimit = Math.min(Math.max(limit, 1), 100);
        const skip = (page - 1) * finalLimit;

        // Build where clause
        const whereClause: any = {
            del_flag: false, // Only get non-deleted users
        };

        // Search filter (username, email, discord_username, twitter_username)
        if (searchTerm) {
            whereClause.OR = [
                { username: { contains: searchTerm, mode: 'insensitive' } },
                { email: { contains: searchTerm, mode: 'insensitive' } },
                { discord_username: { contains: searchTerm, mode: 'insensitive' } },
                { twitter_username: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }

        // Role filter
        if (role && Object.values(UserRoleType).includes(role as UserRoleType)) {
            whereClause.role = role as UserRoleType;
        }

        // Premium filter
        if (isPremium !== undefined) {
            whereClause.is_premium = isPremium;
        }

        // Banned filter
        if (isBanned !== undefined) {
            whereClause.is_banned = isBanned;
        }

        // Date range filter
        if (startDate || endDate) {
            whereClause.registered_at = {};
            if (startDate) {
                whereClause.registered_at.gte = startDate;
            }
            if (endDate) {
                whereClause.registered_at.lte = endDate;
            }
        }

        // Build order clause
        const orderBy: any = {};
        orderBy[sortBy] = sortOrder;

        // Execute queries in parallel
        const [users, totalCount] = await Promise.all([
            this.prisma.user.findMany({
                where: whereClause,
                include: this.userFullInclude,
                skip,
                take: finalLimit,
                orderBy,
            }),
            this.prisma.user.count({
                where: whereClause,
            }),
        ]);

        const totalPages = Math.ceil(totalCount / finalLimit);

        return {
            users: users.map((user) =>
                UserMapper.prismaModelToUserEntity(user as UserRelationModel),
            ),
            totalCount,
            page,
            limit: finalLimit,
            totalPages,
        };
    }
}

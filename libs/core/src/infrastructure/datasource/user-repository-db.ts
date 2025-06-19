import type { UserEntity } from '@app/core/domain/user/user.entity';
import type { UserRepository } from '@app/core/domain/user/user.repository';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Injectable } from '@nestjs/common';
import { TaskStatus, StoryStatus } from '@prisma/client';
import type { UserRelationModel } from 'prisma/relation-model/user-relation-model';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class UserRepositoryDb implements UserRepository {
    constructor(private prisma: PrismaService) {}

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
            orderBy: { ins_date_time: 'desc' }
        },
        user_story_log: {
            where: { status: StoryStatus.COMPLETED },
            take: 10,
            orderBy: { ins_date_time: 'desc' }
        },
        user_travel_log: {
            take: 20,
            orderBy: { ins_date_time: 'desc' }
        }
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
        const user = await this.prisma.user.findFirst({
            where: {
                user_id: userId,
            },
            include: this.userInclude,
        });

        return user ? UserMapper.prismaModelToUserEntity(user as UserRelationModel) : undefined;
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
}

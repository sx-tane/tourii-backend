import type { UserEntity } from '@app/core/domain/user/user.entity';
import type { UserRepository } from '@app/core/domain/user/user.repository';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserMapper } from '../mapper/user.mapper';
import type { UserRelationModel } from 'prisma/relation-model/user-relation-model';

@Injectable()
export class UserRepositoryDb implements UserRepository {
    constructor(private prisma: PrismaService) {}

    async createUser(user: UserEntity): Promise<UserEntity> {
        const createdUser = await this.prisma.user.create({
            data: UserMapper.userEntityToPrismaInput(user),
        });

        return UserMapper.prismaModelToUserEntity(createdUser);
    }

    async getUserInfoByUserId(userId: string): Promise<UserEntity | undefined> {
        const user = await this.prisma.user.findFirst({
            where: {
                user_id: userId,
            },
            include: { user_info: true },
        });

        return user ? UserMapper.prismaModelToUserEntity(user as UserRelationModel) : undefined;
    }

    async getUserByUsername(username: string): Promise<UserEntity | undefined> {
        const user = await this.prisma.user.findFirst({
            where: {
                username,
            },
            include: { user_info: true },
        });

        return user ? UserMapper.prismaModelToUserEntity(user as UserRelationModel) : undefined;
    }

    async getUserByPassportWallet(walletAddress: string): Promise<UserEntity | undefined> {
        const user = await this.prisma.user.findFirst({
            where: {
                passport_wallet_address: walletAddress,
            },
            include: { user_info: true },
        });

        return user ? UserMapper.prismaModelToUserEntity(user as UserRelationModel) : undefined;
    }

    async getUserByDiscordId(discordId: string): Promise<UserEntity | undefined> {
        const user = await this.prisma.user.findFirst({
            where: {
                discord_id: discordId,
            },
            include: { user_info: true },
        });

        return user ? UserMapper.prismaModelToUserEntity(user as UserRelationModel) : undefined;
    }

    async getUserByGoogleEmail(googleEmail: string): Promise<UserEntity | undefined> {
        const user = await this.prisma.user.findFirst({
            where: {
                google_email: googleEmail,
            },
            include: { user_info: true },
        });

        return user ? UserMapper.prismaModelToUserEntity(user as UserRelationModel) : undefined;
    }
}

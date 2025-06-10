import { UserEntity } from '@app/core/domain/user/user.entity';
import { UserInfo } from '@app/core/domain/user/user-info';
import type { Prisma, UserRoleType, user_info } from '@prisma/client';
import type { UserRelationModel } from 'prisma/relation-model/user-relation-model';

export class UserMapper {
    static userEntityToPrismaInput(userEntity: UserEntity): Prisma.userUncheckedCreateInput {
        return {
            username: userEntity.username,
            discord_id: userEntity.discordId ?? null,
            discord_username: userEntity.discordUsername ?? null,
            twitter_id: userEntity.twitterId ?? null,
            twitter_username: userEntity.twitterUsername ?? null,
            google_email: userEntity.googleEmail ?? null,
            email: userEntity.email ?? null,
            password: userEntity.password,
            refresh_token: userEntity.refreshToken ?? null,
            encrypted_private_key: userEntity.encryptedPrivateKey ?? null,
            passport_wallet_address: userEntity.passportWalletAddress ?? null,
            perks_wallet_address: userEntity.perksWalletAddress,
            latest_ip_address: userEntity.latestIpAddress ?? null,
            is_premium: userEntity.isPremium,
            total_quest_completed: userEntity.totalQuestCompleted,
            total_travel_distance: userEntity.totalTravelDistance,
            role: userEntity.role as UserRoleType,
            registered_at: userEntity.registeredAt,
            discord_joined_at: userEntity.discordJoinedAt,
            is_banned: userEntity.isBanned,
            del_flag: userEntity.delFlag,
            ins_user_id: userEntity.insUserId,
            ins_date_time: userEntity.insDateTime,
            upd_user_id: userEntity.updUserId,
            upd_date_time: userEntity.updDateTime,
            request_id: userEntity.requestId ?? null,
        };
    }

    static prismaModelToUserEntity(prismaModel: UserRelationModel): UserEntity {
        return new UserEntity(
            {
                username: prismaModel.username,
                discordId: prismaModel.discord_id ?? undefined,
                discordUsername: prismaModel.discord_username ?? undefined,
                twitterId: prismaModel.twitter_id ?? undefined,
                twitterUsername: prismaModel.twitter_username ?? undefined,
                googleEmail: prismaModel.google_email ?? undefined,
                email: prismaModel.email ?? undefined,
                password: prismaModel.password,
                encryptedPrivateKey: prismaModel.encrypted_private_key ?? undefined,
                passportWalletAddress: prismaModel.passport_wallet_address ?? undefined,
                perksWalletAddress: prismaModel.perks_wallet_address,
                latestIpAddress: prismaModel.latest_ip_address ?? undefined,
                isPremium: prismaModel.is_premium,
                totalQuestCompleted: prismaModel.total_quest_completed,
                totalTravelDistance: prismaModel.total_travel_distance,
                role: prismaModel.role,
                registeredAt: prismaModel.registered_at,
                discordJoinedAt: prismaModel.discord_joined_at,
                isBanned: prismaModel.is_banned,
                delFlag: prismaModel.del_flag,
                insUserId: prismaModel.ins_user_id,
                insDateTime: prismaModel.ins_date_time,
                updUserId: prismaModel.upd_user_id,
                updDateTime: prismaModel.upd_date_time,
                requestId: prismaModel.request_id ?? undefined,
                userInfo: prismaModel.user_info
                    ? UserMapper.prismaModelToUserInfoEntity(prismaModel.user_info)
                    : undefined,
            },
            prismaModel.user_id,
        );
    }

    static prismaModelToUserInfoEntity(prismaUserInfo: user_info): UserInfo {
        return new UserInfo({
            userId: prismaUserInfo.user_id,
            digitalPassportAddress: prismaUserInfo.digital_passport_address,
            logNftAddress: prismaUserInfo.log_nft_address,
            userDigitalPassportType: prismaUserInfo.user_digital_passport_type ?? undefined,
            level: prismaUserInfo.level ?? undefined,
            discountRate: prismaUserInfo.discount_rate ?? undefined,
            magatamaPoints: prismaUserInfo.magatama_points,
            magatamaBags: prismaUserInfo.magatama_bags ?? undefined,
            totalQuestCompleted: prismaUserInfo.total_quest_completed,
            totalTravelDistance: prismaUserInfo.total_travel_distance,
            isPremium: prismaUserInfo.is_premium,
            prayerBead: prismaUserInfo.prayer_bead ?? undefined,
            sword: prismaUserInfo.sword ?? undefined,
            orgeMask: prismaUserInfo.orge_mask ?? undefined,
            delFlag: prismaUserInfo.del_flag,
            insUserId: prismaUserInfo.ins_user_id,
            insDateTime: prismaUserInfo.ins_date_time,
            updUserId: prismaUserInfo.upd_user_id,
            updDateTime: prismaUserInfo.upd_date_time,
            requestId: prismaUserInfo.request_id ?? undefined,
        });
    }
}

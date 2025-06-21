import { DiscordActivityLog } from '@app/core/domain/user/discord-activity-log';
import { DiscordRewardedRoles } from '@app/core/domain/user/discord-rewarded-roles';
import { DiscordUserRoles } from '@app/core/domain/user/discord-user-roles';
import { UserAchievement } from '@app/core/domain/user/user-achievement';
import { UserInfo } from '@app/core/domain/user/user-info';
import { UserInviteLog } from '@app/core/domain/user/user-invite-log';
import { UserItemClaimLog } from '@app/core/domain/user/user-item-claim-log';
import { UserOnchainItem } from '@app/core/domain/user/user-onchain-item';
import { UserStoryLog } from '@app/core/domain/user/user-story-log';
import { UserTaskLog } from '@app/core/domain/user/user-task-log';
import { UserTravelLog } from '@app/core/domain/user/user-travel-log';
import { UserEntity } from '@app/core/domain/user/user.entity';
import { ContextStorage } from '@app/core/support/context/context-storage';
import {
    type Prisma,
    TaskStatus,
    TaskType,
    type UserRoleType,
    type discord_activity_log,
    type discord_rewarded_roles,
    type discord_user_roles,
    type user_achievement,
    type user_info,
    type user_invite_log,
    type user_item_claim_log,
    type user_onchain_item,
    type user_story_log,
    type user_task_log,
    type user_travel_log,
} from '@prisma/client';
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
                userAchievements: prismaModel.user_achievements
                    ? prismaModel.user_achievements.map((achievement) =>
                          UserMapper.prismaModelToUserAchievementEntity(achievement),
                      )
                    : undefined,
                userOnchainItems: prismaModel.user_onchain_item
                    ? prismaModel.user_onchain_item.map((item) =>
                          UserMapper.prismaModelToUserOnchainItemEntity(item),
                      )
                    : undefined,
                userItemClaimLogs: prismaModel.user_item_claim_log
                    ? prismaModel.user_item_claim_log.map((log) =>
                          UserMapper.prismaModelToUserItemClaimLogEntity(log),
                      )
                    : undefined,
                userStoryLogs: prismaModel.user_story_log
                    ? prismaModel.user_story_log.map((log) =>
                          UserMapper.prismaModelToUserStoryLogEntity(log),
                      )
                    : undefined,
                userTaskLogs: prismaModel.user_task_log
                    ? prismaModel.user_task_log.map((log) =>
                          UserMapper.prismaModelToUserTaskLogEntity(log),
                      )
                    : undefined,
                userTravelLogs: prismaModel.user_travel_log
                    ? prismaModel.user_travel_log.map((log) =>
                          UserMapper.prismaModelToUserTravelLogEntity(log),
                      )
                    : undefined,
                discordActivityLogs: prismaModel.discord_activity_log
                    ? prismaModel.discord_activity_log.map((log) =>
                          UserMapper.prismaModelToDiscordActivityLogEntity(log),
                      )
                    : undefined,
                discordUserRoles: prismaModel.discord_user_roles
                    ? prismaModel.discord_user_roles.map((role) =>
                          UserMapper.prismaModelToDiscordUserRolesEntity(role),
                      )
                    : undefined,
                discordRewardedRoles: prismaModel.discord_rewarded_roles
                    ? prismaModel.discord_rewarded_roles.map((role) =>
                          UserMapper.prismaModelToDiscordRewardedRolesEntity(role),
                      )
                    : undefined,
                userInviteLogs: prismaModel.user_invite_log
                    ? prismaModel.user_invite_log.map((log) =>
                          UserMapper.prismaModelToUserInviteLogEntity(log),
                      )
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

    static prismaModelToUserAchievementEntity(
        prismaAchievement: user_achievement,
    ): UserAchievement {
        return new UserAchievement({
            userAchievementId: prismaAchievement.user_achievement_id,
            userId: prismaAchievement.user_id,
            achievementName: prismaAchievement.achievement_name,
            achievementDesc: prismaAchievement.achievement_desc ?? undefined,
            iconUrl: prismaAchievement.icon_url ?? undefined,
            achievementType: prismaAchievement.achievement_type,
            magatamaPointAwarded: prismaAchievement.magatama_point_awarded,
            delFlag: prismaAchievement.del_flag,
            insUserId: prismaAchievement.ins_user_id,
            insDateTime: prismaAchievement.ins_date_time,
            updUserId: prismaAchievement.upd_user_id,
            updDateTime: prismaAchievement.upd_date_time,
            requestId: prismaAchievement.request_id ?? undefined,
        });
    }

    static prismaModelToUserOnchainItemEntity(prismaItem: user_onchain_item): UserOnchainItem {
        return new UserOnchainItem({
            userOnchainItemId: prismaItem.user_onchain_item_id,
            userId: prismaItem.user_id ?? undefined,
            itemType: prismaItem.item_type,
            itemTxnHash: prismaItem.item_txn_hash,
            blockchainType: prismaItem.blockchain_type,
            mintedAt: prismaItem.minted_at ?? undefined,
            onchainItemId: prismaItem.onchain_item_id ?? undefined,
            status: prismaItem.status,
            delFlag: prismaItem.del_flag,
            insUserId: prismaItem.ins_user_id,
            insDateTime: prismaItem.ins_date_time,
            updUserId: prismaItem.upd_user_id,
            updDateTime: prismaItem.upd_date_time,
            requestId: prismaItem.request_id ?? undefined,
        });
    }

    static prismaModelToUserItemClaimLogEntity(prismaLog: user_item_claim_log): UserItemClaimLog {
        return new UserItemClaimLog({
            userItemClaimLogId: prismaLog.user_item_claim_log_id,
            userId: prismaLog.user_id,
            onchainItemId: prismaLog.onchain_item_id ?? undefined,
            offchainItemName: prismaLog.offchain_item_name ?? undefined,
            itemAmount: prismaLog.item_amount,
            itemDetails: prismaLog.item_details ?? undefined,
            type: prismaLog.type,
            claimedAt: prismaLog.claimed_at ?? undefined,
            status: prismaLog.status,
            errorMsg: prismaLog.error_msg ?? undefined,
            delFlag: prismaLog.del_flag,
            insUserId: prismaLog.ins_user_id,
            insDateTime: prismaLog.ins_date_time,
            updUserId: prismaLog.upd_user_id,
            updDateTime: prismaLog.upd_date_time,
            requestId: prismaLog.request_id ?? undefined,
        });
    }

    static prismaModelToUserStoryLogEntity(prismaLog: user_story_log): UserStoryLog {
        return new UserStoryLog({
            userStoryLogId: prismaLog.user_story_log_id,
            userId: prismaLog.user_id,
            storyChapterId: prismaLog.story_chapter_id,
            status: prismaLog.status,
            unlockedAt: prismaLog.unlocked_at ?? undefined,
            finishedAt: prismaLog.finished_at ?? undefined,
            delFlag: prismaLog.del_flag,
            insUserId: prismaLog.ins_user_id,
            insDateTime: prismaLog.ins_date_time,
            updUserId: prismaLog.upd_user_id,
            updDateTime: prismaLog.upd_date_time,
            requestId: prismaLog.request_id ?? undefined,
        });
    }

    static prismaModelToUserTaskLogEntity(prismaLog: user_task_log): UserTaskLog {
        return new UserTaskLog({
            userTaskLogId: prismaLog.user_task_log_id,
            userId: prismaLog.user_id,
            questId: prismaLog.quest_id,
            taskId: prismaLog.task_id,
            status: prismaLog.status,
            action: prismaLog.action,
            userResponse: prismaLog.user_response ?? undefined,
            groupActivityMembers: prismaLog.group_activity_members as any[],
            submissionData: prismaLog.submission_data ?? undefined,
            failedReason: prismaLog.failed_reason ?? undefined,
            completedAt: prismaLog.completed_at ?? undefined,
            claimedAt: prismaLog.claimed_at ?? undefined,
            totalMagatamaPointAwarded: prismaLog.total_magatama_point_awarded,
            delFlag: prismaLog.del_flag,
            insUserId: prismaLog.ins_user_id,
            insDateTime: prismaLog.ins_date_time,
            updUserId: prismaLog.upd_user_id,
            updDateTime: prismaLog.upd_date_time,
            requestId: prismaLog.request_id ?? undefined,
        });
    }

    static prismaModelToUserTravelLogEntity(prismaLog: user_travel_log): UserTravelLog {
        return new UserTravelLog({
            userTravelLogId: prismaLog.user_travel_log_id,
            userId: prismaLog.user_id,
            questId: prismaLog.quest_id,
            taskId: prismaLog.task_id,
            touristSpotId: prismaLog.tourist_spot_id,
            userLongitude: prismaLog.user_longitude,
            userLatitude: prismaLog.user_latitude,
            travelDistanceFromTarget: prismaLog.travel_distance_from_target ?? undefined,
            travelDistance: prismaLog.travel_distance,
            qrCodeValue: prismaLog.qr_code_value ?? undefined,
            checkInMethod: prismaLog.check_in_method ?? undefined,
            detectedFraud: prismaLog.detected_fraud ?? undefined,
            fraudReason: prismaLog.fraud_reason ?? undefined,
            delFlag: prismaLog.del_flag,
            insUserId: prismaLog.ins_user_id,
            insDateTime: prismaLog.ins_date_time,
            updUserId: prismaLog.upd_user_id,
            updDateTime: prismaLog.upd_date_time,
            requestId: prismaLog.request_id ?? undefined,
        });
    }

    static prismaModelToDiscordActivityLogEntity(
        prismaLog: discord_activity_log,
    ): DiscordActivityLog {
        return new DiscordActivityLog({
            discordActivityLogId: prismaLog.discord_activity_log_id,
            userId: prismaLog.user_id,
            activityType: prismaLog.activity_type,
            activityDetails: prismaLog.activity_details ?? undefined,
            magatamaPointAwarded: prismaLog.magatama_point_awarded,
            delFlag: prismaLog.del_flag,
            insUserId: prismaLog.ins_user_id,
            insDateTime: prismaLog.ins_date_time,
            updUserId: prismaLog.upd_user_id,
            updDateTime: prismaLog.upd_date_time,
            requestId: prismaLog.request_id ?? undefined,
        });
    }

    static prismaModelToDiscordUserRolesEntity(prismaRole: discord_user_roles): DiscordUserRoles {
        return new DiscordUserRoles({
            discordUserRolesId: prismaRole.discord_user_roles_id,
            userId: prismaRole.user_id,
            roleId: prismaRole.role_id,
            delFlag: prismaRole.del_flag,
            insUserId: prismaRole.ins_user_id,
            insDateTime: prismaRole.ins_date_time,
            updUserId: prismaRole.upd_user_id,
            updDateTime: prismaRole.upd_date_time,
            requestId: prismaRole.request_id ?? undefined,
        });
    }

    static prismaModelToDiscordRewardedRolesEntity(
        prismaRole: discord_rewarded_roles,
    ): DiscordRewardedRoles {
        return new DiscordRewardedRoles({
            discordRewardedRolesId: prismaRole.discord_rewarded_roles_id,
            userId: prismaRole.user_id,
            roleId: prismaRole.role_id,
            magatamaPointAwarded: prismaRole.magatama_point_awarded,
            delFlag: prismaRole.del_flag,
            insUserId: prismaRole.ins_user_id,
            insDateTime: prismaRole.ins_date_time,
            updUserId: prismaRole.upd_user_id,
            updDateTime: prismaRole.upd_date_time,
            requestId: prismaRole.request_id ?? undefined,
        });
    }

    static prismaModelToUserInviteLogEntity(prismaLog: user_invite_log): UserInviteLog {
        return new UserInviteLog({
            inviteLogId: prismaLog.invite_log_id,
            userId: prismaLog.user_id,
            inviteeDiscordId: prismaLog.invitee_discord_id ?? undefined,
            inviteeUserId: prismaLog.invitee_user_id ?? undefined,
            magatamaPointAwarded: prismaLog.magatama_point_awarded,
            delFlag: prismaLog.del_flag,
            insUserId: prismaLog.ins_user_id,
            insDateTime: prismaLog.ins_date_time,
            updUserId: prismaLog.upd_user_id,
            updDateTime: prismaLog.upd_date_time,
            requestId: prismaLog.request_id ?? undefined,
        });
    }

    static createUserTaskLogForPhotoUpload(
        userId: string,
        questId: string,
        taskId: string,
        proofUrl: string,
    ): {
        create: Prisma.user_task_logUncheckedCreateInput;
        update: Prisma.user_task_logUncheckedUpdateInput;
    } {
        const now = ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date();

        return {
            create: {
                user_id: userId,
                quest_id: questId,
                task_id: taskId,
                status: TaskStatus.COMPLETED,
                action: TaskType.PHOTO_UPLOAD,
                group_activity_members: [],
                submission_data: { image_url: proofUrl },
                completed_at: now,
                claimed_at: now,
                total_magatama_point_awarded: 0,
                ins_user_id: userId,
                ins_date_time: now,
                upd_user_id: userId,
                upd_date_time: now,
                request_id: ContextStorage.getStore()?.getRequestId()?.value ?? null,
            },
            update: {
                status: TaskStatus.COMPLETED,
                submission_data: { image_url: proofUrl },
                completed_at: now,
                upd_user_id: userId,
                upd_date_time: now,
            },
        };
    }

    static createUserTaskLogForSocialShare(
        userId: string,
        questId: string,
        taskId: string,
        proofUrl: string,
    ): {
        create: Prisma.user_task_logUncheckedCreateInput;
        update: Prisma.user_task_logUncheckedUpdateInput;
    } {
        const now = ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date();

        return {
            create: {
                user_id: userId,
                quest_id: questId,
                task_id: taskId,
                status: TaskStatus.COMPLETED,
                action: TaskType.SHARE_SOCIAL,
                group_activity_members: [],
                submission_data: { social_url: proofUrl },
                completed_at: now,
                claimed_at: now,
                total_magatama_point_awarded: 0,
                ins_user_id: userId,
                ins_date_time: now,
                upd_user_id: userId,
                upd_date_time: now,
                request_id: ContextStorage.getStore()?.getRequestId()?.value ?? null,
            },
            update: {
                status: TaskStatus.COMPLETED,
                submission_data: { social_url: proofUrl },
                completed_at: now,
                upd_user_id: userId,
                upd_date_time: now,
            },
        };
    }

    static createUserTaskLogForPhotoUploadPending(
        userId: string,
        questId: string,
        taskId: string,
        proofUrl: string,
    ): {
        create: Prisma.user_task_logUncheckedCreateInput;
        update: Prisma.user_task_logUncheckedUpdateInput;
    } {
        const now = ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date();

        return {
            create: {
                user_id: userId,
                quest_id: questId,
                task_id: taskId,
                status: TaskStatus.ONGOING, // Pending verification
                action: TaskType.PHOTO_UPLOAD,
                group_activity_members: [],
                submission_data: { image_url: proofUrl },
                completed_at: now,
                total_magatama_point_awarded: 0,
                ins_user_id: userId,
                ins_date_time: now,
                upd_user_id: userId,
                upd_date_time: now,
                request_id: ContextStorage.getStore()?.getRequestId()?.value ?? null,
            },
            update: {
                status: TaskStatus.ONGOING, // Pending verification
                submission_data: { image_url: proofUrl },
                completed_at: now,
                upd_user_id: userId,
                upd_date_time: now,
            },
        };
    }

    static createUserTaskLogForSocialSharePending(
        userId: string,
        questId: string,
        taskId: string,
        proofUrl: string,
    ): {
        create: Prisma.user_task_logUncheckedCreateInput;
        update: Prisma.user_task_logUncheckedUpdateInput;
    } {
        const now = ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date();

        return {
            create: {
                user_id: userId,
                quest_id: questId,
                task_id: taskId,
                status: TaskStatus.ONGOING, // Pending verification
                action: TaskType.SHARE_SOCIAL,
                group_activity_members: [],
                submission_data: { social_url: proofUrl },
                completed_at: now,
                total_magatama_point_awarded: 0,
                ins_user_id: userId,
                ins_date_time: now,
                upd_user_id: userId,
                upd_date_time: now,
                request_id: ContextStorage.getStore()?.getRequestId()?.value ?? null,
            },
            update: {
                status: TaskStatus.ONGOING, // Pending verification
                submission_data: { social_url: proofUrl },
                completed_at: now,
                upd_user_id: userId,
                upd_date_time: now,
            },
        };
    }

    static createUserTaskLogForAnswerTextPending(
        userId: string,
        questId: string,
        taskId: string,
        textAnswer: string,
    ): {
        create: Prisma.user_task_logUncheckedCreateInput;
        update: Prisma.user_task_logUncheckedUpdateInput;
    } {
        const now = ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date();

        return {
            create: {
                user_id: userId,
                quest_id: questId,
                task_id: taskId,
                status: TaskStatus.ONGOING, // Pending verification
                action: TaskType.ANSWER_TEXT,
                group_activity_members: [],
                user_response: textAnswer,
                completed_at: now,
                total_magatama_point_awarded: 0,
                ins_user_id: userId,
                ins_date_time: now,
                upd_user_id: userId,
                upd_date_time: now,
                request_id: ContextStorage.getStore()?.getRequestId()?.value ?? null,
            },
            update: {
                status: TaskStatus.ONGOING, // Pending verification
                user_response: textAnswer,
                completed_at: now,
                upd_user_id: userId,
                upd_date_time: now,
            },
        };
    }

    static createUserTaskLogForLocalInteractionPending(
        userId: string,
        questId: string,
        taskId: string,
        interactionType: 'text' | 'photo' | 'audio',
        content: string,
    ): {
        create: Prisma.user_task_logUncheckedCreateInput;
        update: Prisma.user_task_logUncheckedUpdateInput;
    } {
        const now = ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date();

        return {
            create: {
                user_id: userId,
                quest_id: questId,
                task_id: taskId,
                status: TaskStatus.ONGOING, // Pending verification
                action: TaskType.LOCAL_INTERACTION,
                group_activity_members: [],
                submission_data: {
                    interactionType,
                    content,
                    submittedAt: now.toISOString(),
                },
                completed_at: now,
                total_magatama_point_awarded: 0,
                ins_user_id: userId,
                ins_date_time: now,
                upd_user_id: userId,
                upd_date_time: now,
                request_id: ContextStorage.getStore()?.getRequestId()?.value ?? null,
            },
            update: {
                status: TaskStatus.ONGOING, // Pending verification
                submission_data: {
                    interactionType,
                    content,
                    submittedAt: now.toISOString(),
                },
                completed_at: now,
                upd_user_id: userId,
                upd_date_time: now,
            },
        };
    }

    static createUserTaskLogForQrScan(
        userId: string,
        questId: string,
        taskId: string,
        qrCodeValue: string,
    ): {
        create: Prisma.user_task_logUncheckedCreateInput;
        update: Prisma.user_task_logUncheckedUpdateInput;
    } {
        const now = ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date();

        return {
            create: {
                user_id: userId,
                quest_id: questId,
                task_id: taskId,
                status: TaskStatus.COMPLETED,
                action: TaskType.CHECK_IN,
                group_activity_members: [],
                submission_data: { qr_code_value: qrCodeValue },
                completed_at: now,
                claimed_at: now,
                total_magatama_point_awarded: 0,
                ins_user_id: userId,
                ins_date_time: now,
                upd_user_id: userId,
                upd_date_time: now,
                request_id: ContextStorage.getStore()?.getRequestId()?.value ?? null,
            },
            update: {
                status: TaskStatus.COMPLETED,
                submission_data: { qr_code_value: qrCodeValue },
                completed_at: now,
                upd_user_id: userId,
                upd_date_time: now,
            },
        };
    }
}

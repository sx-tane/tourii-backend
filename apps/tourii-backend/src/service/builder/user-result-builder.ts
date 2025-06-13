import { DiscordActivityLog } from '@app/core/domain/user/discord-activity-log';
import { DiscordRewardedRoles } from '@app/core/domain/user/discord-rewarded-roles';
import { DiscordUserRoles } from '@app/core/domain/user/discord-user-roles';
import { UserAchievement } from '@app/core/domain/user/user-achievement';
import { UserInfo } from '@app/core/domain/user/user-info';
import { UserInviteLog } from '@app/core/domain/user/user-invite-log';
import { UserItemClaimLog } from '@app/core/domain/user/user-item-claim-log';
import { UserOnchainItem } from '@app/core/domain/user/user-onchain-item';
import { UserTaskLog } from '@app/core/domain/user/user-task-log';
import { UserStoryLog } from '@app/core/domain/user/user-story-log';
import { UserTravelLog } from '@app/core/domain/user/user-travel-log';
import type { UserEntity } from '@app/core/domain/user/user.entity';
import { TransformDate } from '@app/core/support/transformer/date-transformer';
import { DiscordActivityLogResponseDto } from '@app/tourii-backend/controller/model/tourii-response/user/discord-activity-log-response.model';
import { DiscordRewardedRolesResponseDto } from '@app/tourii-backend/controller/model/tourii-response/user/discord-rewarded-roles-response.model';
import { DiscordUserRolesResponseDto } from '@app/tourii-backend/controller/model/tourii-response/user/discord-user-roles-response.model';
import { UserAchievementResponseDto } from '@app/tourii-backend/controller/model/tourii-response/user/user-achievement-response.model';
import { UserInfoResponseDto } from '@app/tourii-backend/controller/model/tourii-response/user/user-info-response.model';
import { UserInviteLogResponseDto } from '@app/tourii-backend/controller/model/tourii-response/user/user-invite-log-response.model';
import { UserItemClaimLogResponseDto } from '@app/tourii-backend/controller/model/tourii-response/user/user-item-claim-log-response.model';
import { UserOnchainItemResponseDto } from '@app/tourii-backend/controller/model/tourii-response/user/user-onchain-item-response.model';
import { UserTaskLogResponseDto } from '@app/tourii-backend/controller/model/tourii-response/user/user-task-log-response.model';
import {
    UserResponseDto,
    UserSensitiveInfoResponseDto,
} from '@app/tourii-backend/controller/model/tourii-response/user/user-response.model';
import { UserStoryLogResponseDto } from '@app/tourii-backend/controller/model/tourii-response/user/user-story-log-response.model';
import { UserTravelLogResponseDto } from '@app/tourii-backend/controller/model/tourii-response/user/user-travel-log-response.model';

export class UserResultBuilder {
    static userSensitiveInfoToDto(user: UserEntity): UserSensitiveInfoResponseDto {
        return {
            password: user.password,
            refreshToken: user.refreshToken,
            encryptedPrivateKey: user.encryptedPrivateKey,
            passportWalletAddress: user.passportWalletAddress,
            perksWalletAddress: user.perksWalletAddress,
            latestIpAddress: user.latestIpAddress,
        };
    }

    static userToDto(user: UserEntity): UserResponseDto {
        return {
            userId: user.userId ?? '',
            username: user.username,
            discordId: user.discordId,
            discordUsername: user.discordUsername,
            email: user.email,
            passportWalletAddress: user.passportWalletAddress,
            perksWalletAddress: user.perksWalletAddress,
            isPremium: user.isPremium,
            totalQuestCompleted: user.totalQuestCompleted,
            totalTravelDistance: user.totalTravelDistance,
            role: user.role,
            registeredAt: user.registeredAt,
            discordJoinedAt: user.discordJoinedAt,
            isBanned: user.isBanned,
            insUserId: user.insUserId,
            insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(user.insDateTime),
            updUserId: user.updUserId,
            updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(user.updDateTime),
            userInfo: user.userInfo ? UserResultBuilder.userInfoToDto(user.userInfo) : undefined,
            userAchievements: user.userAchievements
                ? UserResultBuilder.userAchievementsToDto(user.userAchievements)
                : undefined,
            userOnchainItems: user.userOnchainItems
                ? UserResultBuilder.userOnchainItemsToDto(user.userOnchainItems)
                : undefined,
            userTravelLogs: user.userTravelLogs
                ? UserResultBuilder.userTravelLogsToDto(user.userTravelLogs)
                : undefined,
            discordActivityLogs: user.discordActivityLogs
                ? UserResultBuilder.discordActivityLogsToDto(user.discordActivityLogs)
                : undefined,
            userTaskLogs: user.userTaskLogs
                ? UserResultBuilder.userTaskLogsToDto(user.userTaskLogs)
                : undefined,
            userStoryLogs: user.userStoryLogs
                ? UserResultBuilder.userStoryLogsToDto(user.userStoryLogs)
                : undefined,
            userItemClaimLogs: user.userItemClaimLogs
                ? UserResultBuilder.userItemClaimLogsToDto(user.userItemClaimLogs)
                : undefined,
            discordUserRoles: user.discordUserRoles
                ? UserResultBuilder.discordUserRolesToDto(user.discordUserRoles)
                : undefined,
            discordRewardedRoles: user.discordRewardedRoles
                ? UserResultBuilder.discordRewardedRolesToDto(user.discordRewardedRoles)
                : undefined,
            userInviteLogs: user.userInviteLogs
                ? UserResultBuilder.userInviteLogsToDto(user.userInviteLogs)
                : undefined,
        };
    }

    static userInfoToDto(userInfo: UserInfo): UserInfoResponseDto {
        return {
            userId: userInfo.userId,
            digitalPassportAddress: userInfo.digitalPassportAddress,
            logNftAddress: userInfo.logNftAddress,
            userDigitalPassportType: userInfo.userDigitalPassportType,
            level: userInfo.level,
            discountRate: userInfo.discountRate,
            magatamaPoints: userInfo.magatamaPoints,
            magatamaBags: userInfo.magatamaBags,
            totalQuestCompleted: userInfo.totalQuestCompleted,
            totalTravelDistance: userInfo.totalTravelDistance,
            isPremium: userInfo.isPremium,
            prayerBead: userInfo.prayerBead,
            sword: userInfo.sword,
            orgeMask: userInfo.orgeMask,
            delFlag: userInfo.delFlag,
            insUserId: userInfo.insUserId,
            insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(userInfo.insDateTime),
            updUserId: userInfo.updUserId,
            updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(userInfo.updDateTime),
        };
    }

    static userAchievementsToDto(achievements: UserAchievement[]): UserAchievementResponseDto[] {
        return (
            achievements?.map((achievement) => ({
                userAchievementId: achievement.userAchievementId,
                userId: achievement.userId,
                achievementName: achievement.achievementName,
                achievementDesc: achievement.achievementDesc,
                iconUrl: achievement.iconUrl,
                achievementType: achievement.achievementType,
                magatamaPointAwarded: achievement.magatamaPointAwarded,
                delFlag: achievement.delFlag,
                insUserId: achievement.insUserId,
                insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(achievement.insDateTime),
                updUserId: achievement.updUserId,
                updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(achievement.updDateTime),
            })) ?? undefined
        );
    }

    static userOnchainItemsToDto(items: UserOnchainItem[]): UserOnchainItemResponseDto[] {
        return (
            items?.map((item) => ({
                userOnchainItemId: item.userOnchainItemId,
                userId: item.userId,
                itemType: item.itemType,
                itemTxnHash: item.itemTxnHash,
                blockchainType: item.blockchainType,
                mintedAt: item.mintedAt,
                onchainItemId: item.onchainItemId,
                status: item.status,
                delFlag: item.delFlag,
                insUserId: item.insUserId,
                insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(item.insDateTime),
                updUserId: item.updUserId,
                updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(item.updDateTime),
            })) ?? undefined
        );
    }

    static userTravelLogsToDto(logs: UserTravelLog[]): UserTravelLogResponseDto[] {
        return (
            logs?.map((log) => ({
                userTravelLogId: log.userTravelLogId,
                userId: log.userId,
                questId: log.questId,
                taskId: log.taskId,
                touristSpotId: log.touristSpotId,
                userLongitude: log.userLongitude,
                userLatitude: log.userLatitude,
                travelDistanceFromTarget: log.travelDistanceFromTarget,
                travelDistance: log.travelDistance,
                qrCodeValue: log.qrCodeValue,
                checkInMethod: log.checkInMethod,
                detectedFraud: log.detectedFraud,
                fraudReason: log.fraudReason,
                delFlag: log.delFlag,
                insUserId: log.insUserId,
                insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(log.insDateTime),
                updUserId: log.updUserId,
                updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(log.updDateTime),
            })) ?? undefined
        );
    }

    static discordActivityLogsToDto(logs: DiscordActivityLog[]): DiscordActivityLogResponseDto[] {
        return (
            logs?.map((log) => ({
                discordActivityLogId: log.discordActivityLogId,
                userId: log.userId,
                activityType: log.activityType,
                activityDetails: log.activityDetails,
                magatamaPointAwarded: log.magatamaPointAwarded,
                delFlag: log.delFlag,
                insUserId: log.insUserId,
                insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(log.insDateTime),
                updUserId: log.updUserId,
                updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(log.updDateTime),
            })) ?? undefined
        );
    }

    static userTaskLogsToDto(logs: UserTaskLog[]): UserTaskLogResponseDto[] {
        return (
            logs?.map((log) => ({
                userTaskLogId: log.userTaskLogId,
                userId: log.userId,
                questId: log.questId,
                taskId: log.taskId,
                status: log.status,
                action: log.action,
                userResponse: log.userResponse,
                groupActivityMembers: log.groupActivityMembers,
                submissionData: log.submissionData,
                failedReason: log.failedReason,
                completedAt: log.completedAt,
                claimedAt: log.claimedAt,
                totalMagatamaPointAwarded: log.totalMagatamaPointAwarded,
                delFlag: log.delFlag,
                insUserId: log.insUserId,
                insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(log.insDateTime),
                updUserId: log.updUserId,
                updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(log.updDateTime),
            })) ?? undefined
        );
    }

    static userStoryLogsToDto(logs: UserStoryLog[]): UserStoryLogResponseDto[] {
        return (
            logs?.map((log) => ({
                userStoryLogId: log.userStoryLogId,
                userId: log.userId,
                storyChapterId: log.storyChapterId,
                status: log.status,
                unlockedAt: log.unlockedAt,
                finishedAt: log.finishedAt,
                delFlag: log.delFlag,
                insUserId: log.insUserId,
                insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(log.insDateTime),
                updUserId: log.updUserId,
                updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(log.updDateTime),
            })) ?? undefined
        );
    }

    static userItemClaimLogsToDto(logs: UserItemClaimLog[]): UserItemClaimLogResponseDto[] {
        return (
            logs?.map((log) => ({
                userItemClaimLogId: log.userItemClaimLogId,
                userId: log.userId,
                onchainItemId: log.onchainItemId,
                offchainItemName: log.offchainItemName,
                itemAmount: log.itemAmount,
                itemDetails: log.itemDetails,
                type: log.type,
                claimedAt: log.claimedAt,
                status: log.status,
                errorMsg: log.errorMsg,
                delFlag: log.delFlag,
                insUserId: log.insUserId,
                insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(log.insDateTime),
                updUserId: log.updUserId,
                updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(log.updDateTime),
            })) ?? undefined
        );
    }

    static discordUserRolesToDto(roles: DiscordUserRoles[]): DiscordUserRolesResponseDto[] {
        return (
            roles?.map((role) => ({
                discordUserRolesId: role.discordUserRolesId,
                userId: role.userId,
                roleId: role.roleId.toString(),
                delFlag: role.delFlag,
                insUserId: role.insUserId,
                insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(role.insDateTime),
                updUserId: role.updUserId,
                updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(role.updDateTime),
                requestId: role.requestId,
            })) ?? undefined
        );
    }

    static discordRewardedRolesToDto(
        roles: DiscordRewardedRoles[],
    ): DiscordRewardedRolesResponseDto[] {
        return (
            roles?.map((role) => ({
                discordRewardedRolesId: role.discordRewardedRolesId,
                userId: role.userId,
                roleId: role.roleId.toString(),
                magatamaPointAwarded: role.magatamaPointAwarded,
                delFlag: role.delFlag,
                insUserId: role.insUserId,
                insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(role.insDateTime),
                updUserId: role.updUserId,
                updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(role.updDateTime),
                requestId: role.requestId,
            })) ?? undefined
        );
    }

    static userInviteLogsToDto(logs: UserInviteLog[]): UserInviteLogResponseDto[] {
        return (
            logs?.map((log) => ({
                inviteLogId: log.inviteLogId,
                userId: log.userId,
                inviteeDiscordId: log.inviteeDiscordId,
                inviteeUserId: log.inviteeUserId,
                magatamaPointAwarded: log.magatamaPointAwarded,
                delFlag: log.delFlag,
                insUserId: log.insUserId,
                insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(log.insDateTime),
                updUserId: log.updUserId,
                updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(log.updDateTime),
            })) ?? undefined
        );
    }
}

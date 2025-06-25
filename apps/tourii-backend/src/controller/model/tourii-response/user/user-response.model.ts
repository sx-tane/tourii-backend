import { UserRoleType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MetadataFieldsSchema } from '../common/metadata-fields-response.model';
import { DiscordActivityLogResponseSchema } from './discord-activity-log-response.model';
import { DiscordRewardedRolesResponseSchema } from './discord-rewarded-roles-response.model';
import { DiscordUserRolesResponseSchema } from './discord-user-roles-response.model';
import { UserAchievementResponseSchema } from './user-achievement-response.model';
import { UserInfoResponseSchema } from './user-info-response.model';
import { UserInviteLogResponseSchema } from './user-invite-log-response.model';
import { UserItemClaimLogResponseSchema } from './user-item-claim-log-response.model';
import { UserOnchainItemResponseSchema } from './user-onchain-item-response.model';
import { UserStoryLogResponseSchema } from './user-story-log-response.model';
import { UserTaskLogResponseSchema } from './user-task-log-response.model';
import { UserTravelLogResponseSchema } from './user-travel-log-response.model';

export const UserSensitiveInfoResponseSchema = z.object({
    password: z.string().describe('Password'),
    refreshToken: z.string().optional().describe('Refresh token'),
    encryptedPrivateKey: z.string().optional().describe('Encrypted private key'),
    passportWalletAddress: z.string().optional().describe('Passport wallet address'),
    perksWalletAddress: z.string().optional().describe('Perks wallet address'),
    latestIpAddress: z.string().optional().describe('Latest IP address'),
});

export class UserSensitiveInfoResponseDto extends createZodDto(UserSensitiveInfoResponseSchema) {}

export const UserResponseSchema = z.object({
    userId: z.string().describe('User ID'),
    username: z.string().describe('Username'),
    discordId: z.string().optional().describe('Discord ID'),
    discordUsername: z.string().optional().describe('Discord username'),
    twitterId: z.string().optional().describe('Twitter ID'),
    twitterUsername: z.string().optional().describe('Twitter username'),
    googleEmail: z.string().optional().describe('Google email'),
    passportWalletAddress: z.string().optional().describe('Passport wallet address'),
    perksWalletAddress: z.string().optional().describe('Perks wallet address'),
    email: z.string().optional().describe('Email'),
    isPremium: z.boolean().describe('Premium status'),
    totalQuestCompleted: z.number().describe('Total quests completed'),
    totalTravelDistance: z.number().describe('Total travel distance'),
    role: z.nativeEnum(UserRoleType).describe('User role'),
    registeredAt: z.date().describe('Registration date'),
    discordJoinedAt: z.date().describe('Discord joined date'),
    isBanned: z.boolean().describe('Ban status'),
    ...MetadataFieldsSchema,
    userInfo: UserInfoResponseSchema.optional().describe('User info'),
    userAchievements: UserAchievementResponseSchema.array()
        .optional()
        .describe('User achievements'),
    userOnchainItems: UserOnchainItemResponseSchema.array()
        .optional()
        .describe('User onchain items'),
    userItemClaimLogs: UserItemClaimLogResponseSchema.array()
        .optional()
        .describe('User item claim logs'),
    userStoryLogs: UserStoryLogResponseSchema.array().optional().describe('User story logs'),
    userTaskLogs: UserTaskLogResponseSchema.array().optional().describe('User task logs'),
    userTravelLogs: UserTravelLogResponseSchema.array().optional().describe('User travel logs'),
    discordActivityLogs: DiscordActivityLogResponseSchema.array()
        .optional()
        .describe('Discord activity logs'),
    discordUserRoles: DiscordUserRolesResponseSchema.array()
        .optional()
        .describe('Discord user roles'),
    discordRewardedRoles: DiscordRewardedRolesResponseSchema.array()
        .optional()
        .describe('Discord rewarded roles'),
    userInviteLogs: UserInviteLogResponseSchema.array().optional().describe('User invite logs'),

    // Dashboard summary statistics for enhanced user experience
    dashboardStats: z
        .object({
            achievementCount: z.number().describe('Total achievements earned'),
            completedQuestsCount: z.number().describe('Completed quests count'),
            completedStoriesCount: z.number().describe('Stories completed'),
            totalCheckinsCount: z.number().describe('Total check-ins'),
            totalMagatamaPoints: z.number().describe('Total magatama points earned'),
            activeQuestsCount: z.number().describe('Currently active quests'),
            readingProgress: z
                .object({
                    currentChapterId: z.string().optional().describe('Current reading chapter ID'),
                    currentChapterTitle: z.string().optional().describe('Current chapter title'),
                    completionPercentage: z.number().optional().describe('Reading completion percentage'),
                })
                .optional()
                .describe('Current reading progress'),
        })
        .optional()
        .describe('Dashboard statistics for user experience'),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}

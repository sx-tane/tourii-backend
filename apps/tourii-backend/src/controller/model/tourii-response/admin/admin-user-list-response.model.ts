import { UserRoleType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MetadataFieldsSchema } from '../common/metadata-fields-response.model';
import { DiscordActivityLogResponseSchema } from '../user/discord-activity-log-response.model';
import { DiscordRewardedRolesResponseSchema } from '../user/discord-rewarded-roles-response.model';
import { DiscordUserRolesResponseSchema } from '../user/discord-user-roles-response.model';
import { UserAchievementResponseSchema } from '../user/user-achievement-response.model';
import { UserInfoResponseSchema } from '../user/user-info-response.model';
import { UserInviteLogResponseSchema } from '../user/user-invite-log-response.model';
import { UserItemClaimLogResponseSchema } from '../user/user-item-claim-log-response.model';
import { UserOnchainItemResponseSchema } from '../user/user-onchain-item-response.model';
import { UserStoryLogResponseSchema } from '../user/user-story-log-response.model';
import { UserTaskLogResponseSchema } from '../user/user-task-log-response.model';
import { UserTravelLogResponseSchema } from '../user/user-travel-log-response.model';

export const AdminUserResponseSchema = z.object({
    userId: z.string().describe('User ID'),
    username: z.string().describe('Username'),
    discordId: z.string().optional().describe('Discord ID'),
    discordUsername: z.string().optional().describe('Discord username'),
    twitterId: z.string().optional().describe('Twitter ID'),
    twitterUsername: z.string().optional().describe('Twitter username'),
    googleEmail: z.string().optional().describe('Google email'),
    email: z.string().optional().describe('Email'),
    passportWalletAddress: z.string().optional().describe('Passport wallet address'),
    perksWalletAddress: z.string().optional().describe('Perks wallet address'),
    latestIpAddress: z.string().optional().describe('Latest IP address'),
    isPremium: z.boolean().describe('Premium status'),
    totalQuestCompleted: z.number().describe('Total quests completed'),
    totalTravelDistance: z.number().describe('Total travel distance'),
    role: z.nativeEnum(UserRoleType).describe('User role'),
    registeredAt: z.date().describe('Registration date'),
    discordJoinedAt: z.date().describe('Discord joined date'),
    isBanned: z.boolean().describe('Ban status'),
    ...MetadataFieldsSchema,

    // Related data (with summary counts for performance)
    userInfo: UserInfoResponseSchema.optional().describe('User detailed info'),
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

    // Summary counts for quick admin overview
    summaryStats: z
        .object({
            achievementCount: z.number().describe('Total achievements earned'),
            onchainItemCount: z.number().describe('Total onchain items'),
            storyCompletedCount: z.number().describe('Stories completed'),
            taskCompletedCount: z.number().describe('Tasks completed'),
            totalCheckinsCount: z.number().describe('Total check-ins'),
            discordActivityCount: z.number().describe('Discord activities'),
            invitesSentCount: z.number().describe('Invitations sent'),
        })
        .optional()
        .describe('Summary statistics for admin view'),
});

export class AdminUserResponseDto extends createZodDto(AdminUserResponseSchema) {}

export const AdminUserListResponseSchema = z.object({
    users: AdminUserResponseSchema.array().describe('List of users'),
    pagination: z
        .object({
            totalCount: z.number().describe('Total number of users'),
            page: z.number().describe('Current page number'),
            limit: z.number().describe('Users per page'),
            totalPages: z.number().describe('Total number of pages'),
        })
        .describe('Pagination information'),
    filters: z
        .object({
            searchTerm: z.string().optional().describe('Applied search term'),
            role: z.string().optional().describe('Applied role filter'),
            isPremium: z.boolean().optional().describe('Applied premium filter'),
            isBanned: z.boolean().optional().describe('Applied banned filter'),
            startDate: z.date().optional().describe('Applied start date filter'),
            endDate: z.date().optional().describe('Applied end date filter'),
            sortBy: z.string().optional().describe('Applied sort field'),
            sortOrder: z.string().optional().describe('Applied sort order'),
        })
        .describe('Applied filters'),
});

export class AdminUserListResponseDto extends createZodDto(AdminUserListResponseSchema) {}

export const AdminUserQuerySchema = z.object({
    page: z.string().optional().default('1').describe('Page number'),
    limit: z.string().optional().default('20').describe('Users per page (max 100)'),
    searchTerm: z
        .string()
        .optional()
        .describe('Search in username, email, discord/twitter usernames'),
    role: z.enum(['USER', 'MODERATOR', 'ADMIN']).optional().describe('Filter by user role'),
    isPremium: z.string().optional().describe('Filter by premium status (true/false)'),
    isBanned: z.string().optional().describe('Filter by banned status (true/false)'),
    startDate: z.string().optional().describe('Filter by registration start date (ISO format)'),
    endDate: z.string().optional().describe('Filter by registration end date (ISO format)'),
    sortBy: z
        .enum(['username', 'registered_at', 'total_quest_completed', 'total_travel_distance'])
        .optional()
        .default('registered_at')
        .describe('Sort field'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc').describe('Sort order'),
});

export class AdminUserQueryDto extends createZodDto(AdminUserQuerySchema) {}

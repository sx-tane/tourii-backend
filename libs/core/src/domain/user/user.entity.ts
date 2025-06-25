import { UserRoleType, StoryStatus, TaskStatus } from '@prisma/client';
import { Entity } from '../entity';
import type { DashboardStats, ReadingProgress } from './dashboard-stats';
import type { DiscordActivityLog } from './discord-activity-log';
import type { DiscordRewardedRoles } from './discord-rewarded-roles';
import type { DiscordUserRoles } from './discord-user-roles';
import type { UserAchievement } from './user-achievement';
import type { UserInfo } from './user-info';
import type { UserInviteLog } from './user-invite-log';
import type { UserItemClaimLog } from './user-item-claim-log';
import type { UserOnchainItem } from './user-onchain-item';
import type { UserStoryLog } from './user-story-log';
import type { UserTaskLog } from './user-task-log';
import type { UserTravelLog } from './user-travel-log';

interface UserProps {
    username: string;
    discordId?: string;
    discordUsername?: string;
    twitterId?: string;
    twitterUsername?: string;
    googleEmail?: string;
    email?: string;
    password: string;
    refreshToken?: string;
    encryptedPrivateKey?: string;
    passportWalletAddress?: string;
    perksWalletAddress: string;
    latestIpAddress?: string;
    isPremium: boolean;
    totalQuestCompleted: number;
    totalTravelDistance: number;
    role: UserRoleType;
    registeredAt: Date;
    discordJoinedAt: Date;
    isBanned: boolean;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
    userInfo?: UserInfo;
    userAchievements?: UserAchievement[];
    userOnchainItems?: UserOnchainItem[];
    userItemClaimLogs?: UserItemClaimLog[];
    userStoryLogs?: UserStoryLog[];
    userTaskLogs?: UserTaskLog[];
    userTravelLogs?: UserTravelLog[];
    discordActivityLogs?: DiscordActivityLog[];
    discordUserRoles?: DiscordUserRoles[];
    discordRewardedRoles?: DiscordRewardedRoles[];
    userInviteLogs?: UserInviteLog[];
}

export class UserEntity extends Entity<UserProps> {
    constructor(props: UserProps, id?: string) {
        super(props, id);
    }

    get userId(): string | undefined {
        return this.id;
    }

    get username(): string {
        return this.props.username;
    }

    get discordId(): string | undefined {
        return this.props.discordId;
    }

    get discordUsername(): string | undefined {
        return this.props.discordUsername;
    }

    get twitterId(): string | undefined {
        return this.props.twitterId;
    }

    get twitterUsername(): string | undefined {
        return this.props.twitterUsername;
    }

    get googleEmail(): string | undefined {
        return this.props.googleEmail;
    }

    get email(): string | undefined {
        return this.props.email;
    }

    get password(): string {
        return this.props.password;
    }

    get refreshToken(): string | undefined {
        return this.props.refreshToken;
    }

    get encryptedPrivateKey(): string | undefined {
        return this.props.encryptedPrivateKey;
    }

    get passportWalletAddress(): string | undefined {
        return this.props.passportWalletAddress;
    }

    get perksWalletAddress(): string {
        return this.props.perksWalletAddress;
    }

    get latestIpAddress(): string | undefined {
        return this.props.latestIpAddress;
    }

    get isPremium(): boolean {
        return this.props.isPremium;
    }

    get totalQuestCompleted(): number {
        return this.props.totalQuestCompleted;
    }

    get totalTravelDistance(): number {
        return this.props.totalTravelDistance;
    }

    get role(): UserRoleType {
        return this.props.role;
    }

    get registeredAt(): Date {
        return this.props.registeredAt;
    }

    get discordJoinedAt(): Date {
        return this.props.discordJoinedAt;
    }

    get isBanned(): boolean {
        return this.props.isBanned;
    }

    get delFlag(): boolean {
        return this.props.delFlag;
    }

    get insUserId(): string {
        return this.props.insUserId;
    }

    get insDateTime(): Date {
        return this.props.insDateTime;
    }

    get updUserId(): string {
        return this.props.updUserId;
    }

    get updDateTime(): Date {
        return this.props.updDateTime;
    }

    get requestId(): string | undefined {
        return this.props.requestId;
    }

    get userInfo(): UserInfo | undefined {
        return this.props.userInfo;
    }

    get userAchievements(): UserAchievement[] | undefined {
        return this.props.userAchievements;
    }

    get userOnchainItems(): UserOnchainItem[] | undefined {
        return this.props.userOnchainItems;
    }

    get userItemClaimLogs(): UserItemClaimLog[] | undefined {
        return this.props.userItemClaimLogs;
    }

    get userStoryLogs(): UserStoryLog[] | undefined {
        return this.props.userStoryLogs;
    }

    get userTaskLogs(): UserTaskLog[] | undefined {
        return this.props.userTaskLogs;
    }

    get userTravelLogs(): UserTravelLog[] | undefined {
        return this.props.userTravelLogs;
    }

    get discordActivityLogs(): DiscordActivityLog[] | undefined {
        return this.props.discordActivityLogs;
    }

    get discordUserRoles(): DiscordUserRoles[] | undefined {
        return this.props.discordUserRoles;
    }

    get discordRewardedRoles(): DiscordRewardedRoles[] | undefined {
        return this.props.discordRewardedRoles;
    }

    get userInviteLogs(): UserInviteLog[] | undefined {
        return this.props.userInviteLogs;
    }

    /**
     * Calculates comprehensive dashboard statistics for the user
     * Aggregates data from achievements, quests, stories, and travel activities
     * @returns DashboardStats object with all calculated metrics
     */
    getDashboardStats(): DashboardStats {
        return {
            achievementCount: this.getAchievementCount(),
            completedQuestsCount: this.totalQuestCompleted,
            completedStoriesCount: this.getCompletedStoriesCount(),
            totalCheckinsCount: this.getTotalCheckinsCount(),
            totalMagatamaPoints: this.getTotalMagatamaPoints(),
            activeQuestsCount: this.getActiveQuestsCount(),
            readingProgress: this.getCurrentReadingProgress(),
        };
    }

    /**
     * Gets the total number of achievements earned by the user
     * @returns Number of achievements
     */
    private getAchievementCount(): number {
        return this.userAchievements?.length || 0;
    }

    /**
     * Gets the total number of completed stories
     * Uses Prisma StoryStatus enum for type safety
     * @returns Number of completed stories
     */
    private getCompletedStoriesCount(): number {
        return (
            this.userStoryLogs?.filter((log) => log.status === StoryStatus.COMPLETED).length || 0
        );
    }

    /**
     * Gets the total number of check-ins (travel logs)
     * @returns Number of travel log entries
     */
    private getTotalCheckinsCount(): number {
        return this.userTravelLogs?.length || 0;
    }

    /**
     * Calculates total magatama points from completed tasks
     * Uses Prisma TaskStatus enum for type safety
     * @returns Total magatama points earned
     */
    private getTotalMagatamaPoints(): number {
        return (
            this.userTaskLogs
                ?.filter((log) => log.status === TaskStatus.COMPLETED)
                .reduce((sum, log) => sum + (log.totalMagatamaPointAwarded || 0), 0) || 0
        );
    }

    /**
     * Gets the count of unique quests with active (in-progress) tasks
     * Note: TaskStatus.ONGOING maps to "IN_PROGRESS" in the current system
     * Uses Set to ensure unique quest counting
     * @returns Number of unique active quests
     */
    private getActiveQuestsCount(): number {
        const activeQuestIds = new Set(
            this.userTaskLogs
                ?.filter((log) => log.status === TaskStatus.ONGOING)
                .map((log) => log.questId)
                .filter(Boolean),
        );
        return activeQuestIds.size;
    }

    /**
     * Gets the current reading progress for the most recently updated in-progress story
     * Uses Prisma StoryStatus enum for type safety
     * Note: Only returns basic progress info as detailed fields (title, percentage) are not stored in user_story_log
     * @returns ReadingProgress object or undefined if no active reading
     */
    private getCurrentReadingProgress(): ReadingProgress | undefined {
        const lastReadingActivity = this.userStoryLogs
            ?.filter((log) => log.status === StoryStatus.IN_PROGRESS)
            .sort((a, b) => {
                const aDate = a.updDateTime ? new Date(a.updDateTime).getTime() : 0;
                const bDate = b.updDateTime ? new Date(b.updDateTime).getTime() : 0;
                return bDate - aDate;
            })[0];

        return lastReadingActivity
            ? {
                  currentChapterId: lastReadingActivity.storyChapterId,
                  // Note: storyChapterTitle and completionPercentage are not stored in user_story_log table
                  // These would need to be fetched separately from story_chapter table if needed
                  currentChapterTitle: undefined,
                  completionPercentage: undefined,
              }
            : undefined;
    }
}

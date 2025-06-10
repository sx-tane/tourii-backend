import { UserRoleType } from '@prisma/client';
import { Entity } from '../entity';
import type { DiscordActivityLog } from './discord-activity-log';
import type { DiscordRewardedRoles } from './discord-rewarded-roles';
import type { DiscordUserRoles } from './discord-user-roles';
import type { UserAchievement } from './user-achievement';
import type { UserInfo } from './user-info';
import type { UserInviteLog } from './user-invite-log';
import type { UserItemClaimLog } from './user-item-claim-log';
import type { UserOnchainItem } from './user-onchain-item';
import type { UserQuestLog } from './user-quest-log';
import type { UserStoryLog } from './user-story-log';
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
    userQuestLogs?: UserQuestLog[];
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

    get userQuestLogs(): UserQuestLog[] | undefined {
        return this.props.userQuestLogs;
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
}

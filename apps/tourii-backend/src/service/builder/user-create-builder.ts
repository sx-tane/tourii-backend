import { UserEntity } from '@app/core/domain/user/user.entity';
import { ContextStorage } from '@app/core/support/context/context-storage';

export class UserCreateBuilder {
    static fromSignup(
        email: string,
        socialProvider: string,
        socialId: string,
        walletAddress: string,
        encryptedPrivateKey: string,
        ipAddress: string,
    ): UserEntity {
        const now = ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date();
        return new UserEntity(
            {
                username: email.split('@')[0],
                googleEmail: socialProvider === 'google' ? email : undefined,
                email: socialProvider === 'email' ? email : undefined,
                discordId: socialProvider === 'discord' ? socialId : undefined,
                password: '',
                encryptedPrivateKey,
                latestIpAddress: ipAddress,
                passportWalletAddress: walletAddress,
                perksWalletAddress: walletAddress,
                isPremium: false,
                totalQuestCompleted: 0,
                totalTravelDistance: 0,
                role: 'USER',
                registeredAt: now,
                discordJoinedAt: now,
                isBanned: false,
                delFlag: false,
                insUserId: 'system',
                insDateTime: now,
                updUserId: 'system',
                updDateTime: now,
                requestId: ContextStorage.getStore()?.getRequestId()?.value,
                userInfo: undefined,
                userAchievements: [],
                userOnchainItems: [],
                userItemClaimLogs: [],
                userStoryLogs: [],
                userTaskLogs: [],
                userTravelLogs: [],
                discordActivityLogs: [],
                discordUserRoles: [],
                discordRewardedRoles: [],
                userInviteLogs: [],
            },
            undefined,
        );
    }
}

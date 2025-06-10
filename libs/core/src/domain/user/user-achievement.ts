import type { AchievementType } from '@prisma/client';

export interface UserAchievementProps {
    userAchievementId: string;
    userId: string;
    achievementName: string;
    achievementDesc?: string;
    iconUrl?: string;
    achievementType: AchievementType;
    magatamaPointAwarded: number;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class UserAchievement {
    constructor(private props: UserAchievementProps) {}

    get userAchievementId(): string {
        return this.props.userAchievementId;
    }

    get userId(): string {
        return this.props.userId;
    }

    get achievementName(): string {
        return this.props.achievementName;
    }

    get achievementDesc(): string | undefined {
        return this.props.achievementDesc;
    }

    get iconUrl(): string | undefined {
        return this.props.iconUrl;
    }

    get achievementType(): AchievementType {
        return this.props.achievementType;
    }

    get magatamaPointAwarded(): number {
        return this.props.magatamaPointAwarded;
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
}

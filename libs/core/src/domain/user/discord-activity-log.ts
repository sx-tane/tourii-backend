export interface DiscordActivityLogProps {
    discordActivityLogId: string;
    userId: string;
    activityType: string;
    activityDetails?: string;
    magatamaPointAwarded: number;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class DiscordActivityLog {
    constructor(private props: DiscordActivityLogProps) {}

    get discordActivityLogId(): string {
        return this.props.discordActivityLogId;
    }

    get userId(): string {
        return this.props.userId;
    }

    get activityType(): string {
        return this.props.activityType;
    }

    get activityDetails(): string | undefined {
        return this.props.activityDetails;
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

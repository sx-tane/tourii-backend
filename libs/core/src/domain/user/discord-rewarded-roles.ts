export interface DiscordRewardedRolesProps {
    discordRewardedRolesId: string;
    userId: string;
    roleId: bigint;
    magatamaPointAwarded: number;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class DiscordRewardedRoles {
    constructor(private props: DiscordRewardedRolesProps) {}

    get discordRewardedRolesId(): string {
        return this.props.discordRewardedRolesId;
    }

    get userId(): string {
        return this.props.userId;
    }

    get roleId(): bigint {
        return this.props.roleId;
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

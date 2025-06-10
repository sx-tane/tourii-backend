export interface DiscordUserRolesProps {
    discordUserRolesId: string;
    userId: string;
    roleId: bigint;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class DiscordUserRoles {
    constructor(private props: DiscordUserRolesProps) {}

    get discordUserRolesId(): string {
        return this.props.discordUserRolesId;
    }

    get userId(): string {
        return this.props.userId;
    }

    get roleId(): bigint {
        return this.props.roleId;
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

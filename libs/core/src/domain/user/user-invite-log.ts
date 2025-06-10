export interface UserInviteLogProps {
    inviteLogId: string;
    userId: string;
    inviteeDiscordId?: string;
    inviteeUserId?: string;
    magatamaPointAwarded: number;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class UserInviteLog {
    constructor(private props: UserInviteLogProps) {}

    get inviteLogId(): string {
        return this.props.inviteLogId;
    }

    get userId(): string {
        return this.props.userId;
    }

    get inviteeDiscordId(): string | undefined {
        return this.props.inviteeDiscordId;
    }

    get inviteeUserId(): string | undefined {
        return this.props.inviteeUserId;
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

import type { ItemStatus, ItemType } from '@prisma/client';

export interface UserItemClaimLogProps {
    userItemClaimLogId: string;
    userId: string;
    onchainItemId?: string;
    offchainItemName?: string;
    itemAmount: number;
    itemDetails?: string;
    type: ItemType;
    claimedAt?: Date;
    status: ItemStatus;
    errorMsg?: string;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class UserItemClaimLog {
    constructor(private props: UserItemClaimLogProps) {}

    get userItemClaimLogId(): string {
        return this.props.userItemClaimLogId;
    }

    get userId(): string {
        return this.props.userId;
    }

    get onchainItemId(): string | undefined {
        return this.props.onchainItemId;
    }

    get offchainItemName(): string | undefined {
        return this.props.offchainItemName;
    }

    get itemAmount(): number {
        return this.props.itemAmount;
    }

    get itemDetails(): string | undefined {
        return this.props.itemDetails;
    }

    get type(): ItemType {
        return this.props.type;
    }

    get claimedAt(): Date | undefined {
        return this.props.claimedAt;
    }

    get status(): ItemStatus {
        return this.props.status;
    }

    get errorMsg(): string | undefined {
        return this.props.errorMsg;
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

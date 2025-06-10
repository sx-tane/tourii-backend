import type { BlockchainType, OnchainItemStatus, OnchainItemType } from '@prisma/client';

export interface UserOnchainItemProps {
    userOnchainItemId: string;
    userId?: string;
    itemType: OnchainItemType;
    itemTxnHash: string;
    blockchainType: BlockchainType;
    mintedAt?: Date;
    onchainItemId?: string;
    status: OnchainItemStatus;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class UserOnchainItem {
    constructor(private props: UserOnchainItemProps) {}

    get userOnchainItemId(): string {
        return this.props.userOnchainItemId;
    }

    get userId(): string | undefined {
        return this.props.userId;
    }

    get itemType(): OnchainItemType {
        return this.props.itemType;
    }

    get itemTxnHash(): string {
        return this.props.itemTxnHash;
    }

    get blockchainType(): BlockchainType {
        return this.props.blockchainType;
    }

    get mintedAt(): Date | undefined {
        return this.props.mintedAt;
    }

    get onchainItemId(): string | undefined {
        return this.props.onchainItemId;
    }

    get status(): OnchainItemStatus {
        return this.props.status;
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

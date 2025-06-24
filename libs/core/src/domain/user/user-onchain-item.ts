import type { AcquisitionType, BlockchainType, OnchainItemStatus, OnchainItemType } from '@prisma/client';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';

export interface UserOnchainItemProps {
    userOnchainItemId: string;
    userId?: string;
    itemType: OnchainItemType;
    itemTxnHash: string;
    blockchainType: BlockchainType;
    mintedAt?: Date;
    onchainItemId?: string;
    status: OnchainItemStatus;
    // Perk management fields (only used when itemType = PERK)
    acquisitionType?: AcquisitionType;
    sourceId?: string;
    quantity?: number;
    expiryDate?: Date;
    acquiredAt?: Date;
    // System fields
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

    // Perk management getters (only relevant for PERK items)
    get acquisitionType(): AcquisitionType | undefined {
        return this.props.acquisitionType;
    }

    get sourceId(): string | undefined {
        return this.props.sourceId;
    }

    get quantity(): number | undefined {
        return this.props.quantity;
    }

    get expiryDate(): Date | undefined {
        return this.props.expiryDate;
    }

    get acquiredAt(): Date | undefined {
        return this.props.acquiredAt;
    }

    // Business logic methods for PERK items
    
    /**
     * Checks if this is a perk item
     */
    isPerk(): boolean {
        return this.props.itemType === 'PERK';
    }

    /**
     * Checks if the perk is currently usable (only for PERK items)
     */
    canBeUsed(): boolean {
        if (!this.isPerk()) {
            return false;
        }

        if (this.props.status !== 'ACTIVE') {
            return false;
        }

        if (this.props.delFlag) {
            return false;
        }

        if ((this.props.quantity ?? 0) <= 0) {
            return false;
        }

        if (this.props.expiryDate && this.props.expiryDate < new Date()) {
            return false;
        }

        return true;
    }

    /**
     * Checks if the perk has expired (only for PERK items)
     */
    isExpired(): boolean {
        if (!this.isPerk()) {
            return false;
        }
        return this.props.expiryDate !== undefined && this.props.expiryDate < new Date();
    }

    /**
     * Gets the number of available uses remaining (only for PERK items)
     */
    getAvailableUses(): number {
        if (!this.isPerk() || !this.canBeUsed()) {
            return 0;
        }
        return this.props.quantity ?? 0;
    }

    /**
     * Reduces the quantity when perk is used (only for PERK items)
     */
    consumePerk(usedQuantity: number, updUserId: string): void {
        if (!this.isPerk()) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                'Can only consume PERK items'
            );
        }

        if (!this.canBeUsed()) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                'Perk cannot be used in current state'
            );
        }

        if (usedQuantity <= 0) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_002,
                'Used quantity must be greater than 0'
            );
        }

        const currentQuantity = this.props.quantity ?? 0;
        if (usedQuantity > currentQuantity) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_003,
                'Cannot use more perks than available'
            );
        }

        this.props.quantity = currentQuantity - usedQuantity;
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();

        // If quantity reaches 0, mark as used
        if (this.props.quantity === 0) {
            this.props.status = 'USED';
        }
    }

    /**
     * Marks the perk as expired (only for PERK items)
     */
    markAsExpired(updUserId: string): void {
        if (!this.isPerk()) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                'Can only expire PERK items'
            );
        }

        if (this.props.status !== 'ACTIVE') {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_004,
                'Only active perks can be marked as expired'
            );
        }

        this.props.status = 'EXPIRED';
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();
    }

    /**
     * Extends the expiry date of the perk (only for PERK items)
     */
    extendExpiry(newExpiryDate: Date, updUserId: string): void {
        if (!this.isPerk()) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                'Can only extend expiry for PERK items'
            );
        }

        if (this.props.status !== 'ACTIVE') {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_006,
                'Can only extend expiry for active perks'
            );
        }

        if (newExpiryDate <= new Date()) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_007,
                'New expiry date must be in the future'
            );
        }

        if (this.props.expiryDate && newExpiryDate <= this.props.expiryDate) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_008,
                'New expiry date must be later than current expiry date'
            );
        }

        this.props.expiryDate = newExpiryDate;
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();
    }

    /**
     * Increases the quantity of the perk (only for PERK items)
     */
    addQuantity(additionalQuantity: number, updUserId: string): void {
        if (!this.isPerk()) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                'Can only add quantity to PERK items'
            );
        }

        if (this.props.status !== 'ACTIVE') {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_009,
                'Can only add quantity to active perks'
            );
        }

        if (additionalQuantity <= 0) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_010,
                'Additional quantity must be greater than 0'
            );
        }

        this.props.quantity = (this.props.quantity ?? 0) + additionalQuantity;
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();
    }

    /**
     * Gets a description of the perk acquisition (only for PERK items)
     */
    getAcquisitionDescription(): string {
        if (!this.isPerk() || !this.props.acquisitionType) {
            return 'Not a perk item';
        }

        switch (this.props.acquisitionType) {
            case 'QUEST':
                return `Earned through quest completion${this.props.sourceId ? ` (Quest: ${this.props.sourceId})` : ''}`;
            case 'PURCHASE':
                return `Purchased from shop${this.props.sourceId ? ` (Order: ${this.props.sourceId})` : ''}`;
            case 'GIFT':
                return `Received as gift${this.props.sourceId ? ` (From: ${this.props.sourceId})` : ''}`;
            default:
                return 'Unknown acquisition method';
        }
    }

    /**
     * Checks if the perk can be gifted to another user (only for PERK items)
     */
    canBeGifted(): boolean {
        return this.isPerk() && this.canBeUsed() && this.props.acquisitionType !== 'QUEST';
    }

    /**
     * Gets the number of days until expiry (only for PERK items)
     */
    getDaysUntilExpiry(): number | null {
        if (!this.isPerk() || !this.props.expiryDate) {
            return null;
        }

        const now = new Date();
        const timeDiff = this.props.expiryDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        return Math.max(0, daysDiff);
    }

    /**
     * Soft deletes the item
     */
    softDelete(updUserId: string): void {
        this.props.delFlag = true;
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();
    }

    /**
     * Burns the onchain item (calls blockchain burn function)
     */
    burnOnchain(updUserId: string): void {
        if (this.props.status === 'USED') {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_005,
                'Cannot burn an item that has already been used'
            );
        }

        this.props.status = 'USED';
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();
        
        // Note: Actual blockchain burn call would be handled by the service layer
        // This just updates the local state to reflect the burn
    }
}

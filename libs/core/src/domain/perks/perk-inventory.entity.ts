import { AcquisitionType, PerkStatus } from '@prisma/client';
import { Entity } from '../entity';
import type { UserEntity } from '../user/user.entity';
import type { OnchainItemCatalog } from '../catalog/onchain-item-catalog.entity';
import type { PerkReservationEntity } from './perk-reservation.entity';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';

interface PerkInventoryProps {
    userId: string;
    onchainItemId: string;
    acquisitionType: AcquisitionType;
    sourceId?: string;
    quantity: number;
    expiryDate?: Date;
    status: PerkStatus;
    acquiredAt: Date;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
    user?: UserEntity;
    perkCatalog?: OnchainItemCatalog;
    reservations?: PerkReservationEntity[];
}

export class PerkInventoryEntity extends Entity<PerkInventoryProps> {
    constructor(props: PerkInventoryProps, id?: string) {
        super(props, id);
    }

    get perkId(): string | undefined {
        return this.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get onchainItemId(): string {
        return this.props.onchainItemId;
    }

    get acquisitionType(): AcquisitionType {
        return this.props.acquisitionType;
    }

    get sourceId(): string | undefined {
        return this.props.sourceId;
    }

    get quantity(): number {
        return this.props.quantity;
    }

    get expiryDate(): Date | undefined {
        return this.props.expiryDate;
    }

    get status(): PerkStatus {
        return this.props.status;
    }

    get acquiredAt(): Date {
        return this.props.acquiredAt;
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

    get user(): UserEntity | undefined {
        return this.props.user;
    }

    get perkCatalog(): OnchainItemCatalog | undefined {
        return this.props.perkCatalog;
    }

    get reservations(): PerkReservationEntity[] | undefined {
        return this.props.reservations;
    }

    /**
     * Checks if the perk is currently usable
     * @returns true if perk can be used, false otherwise
     */
    canBeUsed(): boolean {
        if (this.props.status !== PerkStatus.ACTIVE) {
            return false;
        }

        if (this.props.delFlag) {
            return false;
        }

        if (this.props.quantity <= 0) {
            return false;
        }

        if (this.props.expiryDate && this.props.expiryDate < new Date()) {
            return false;
        }

        return true;
    }

    /**
     * Checks if the perk has expired
     * @returns true if perk is expired, false otherwise
     */
    isExpired(): boolean {
        return this.props.expiryDate !== undefined && this.props.expiryDate < new Date();
    }

    /**
     * Gets the number of available uses remaining
     * @returns number of uses available
     */
    getAvailableUses(): number {
        if (!this.canBeUsed()) {
            return 0;
        }
        return this.props.quantity;
    }

    /**
     * Reduces the quantity when perk is used
     * @param usedQuantity - number of perks to consume
     * @param updUserId - ID of user making the update
     */
    consumePerk(usedQuantity: number, updUserId: string): void {
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

        if (usedQuantity > this.props.quantity) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_003,
                'Cannot use more perks than available'
            );
        }

        this.props.quantity -= usedQuantity;
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();

        // If quantity reaches 0, mark as used
        if (this.props.quantity === 0) {
            this.props.status = PerkStatus.USED;
        }
    }

    /**
     * Marks the perk as expired
     * @param updUserId - ID of user making the update
     */
    markAsExpired(updUserId: string): void {
        if (this.props.status !== PerkStatus.ACTIVE) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_004,
                'Only active perks can be marked as expired'
            );
        }

        this.props.status = PerkStatus.EXPIRED;
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();
    }

    /**
     * Cancels the perk
     * @param updUserId - ID of user making the update
     */
    cancelPerk(updUserId: string): void {
        if (this.props.status === PerkStatus.USED) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_005,
                'Cannot cancel a perk that has already been used'
            );
        }

        this.props.status = PerkStatus.CANCELLED;
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();
    }

    /**
     * Extends the expiry date of the perk
     * @param newExpiryDate - new expiry date
     * @param updUserId - ID of user making the update
     */
    extendExpiry(newExpiryDate: Date, updUserId: string): void {
        if (this.props.status !== PerkStatus.ACTIVE) {
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
     * Increases the quantity of the perk (for stackable perks)
     * @param additionalQuantity - amount to add
     * @param updUserId - ID of user making the update
     */
    addQuantity(additionalQuantity: number, updUserId: string): void {
        if (this.props.status !== PerkStatus.ACTIVE) {
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

        this.props.quantity += additionalQuantity;
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();
    }

    /**
     * Gets a description of the perk acquisition
     * @returns human readable description
     */
    getAcquisitionDescription(): string {
        switch (this.props.acquisitionType) {
            case AcquisitionType.QUEST:
                return `Earned through quest completion${this.props.sourceId ? ` (Quest: ${this.props.sourceId})` : ''}`;
            case AcquisitionType.PURCHASE:
                return `Purchased from shop${this.props.sourceId ? ` (Order: ${this.props.sourceId})` : ''}`;
            case AcquisitionType.GIFT:
                return `Received as gift${this.props.sourceId ? ` (From: ${this.props.sourceId})` : ''}`;
            default:
                return 'Unknown acquisition method';
        }
    }

    /**
     * Checks if the perk can be gifted to another user
     * @returns true if perk can be gifted, false otherwise
     */
    canBeGifted(): boolean {
        return this.canBeUsed() && this.props.acquisitionType !== AcquisitionType.QUEST;
    }

    /**
     * Gets the number of days until expiry
     * @returns number of days until expiry, or null if no expiry
     */
    getDaysUntilExpiry(): number | null {
        if (!this.props.expiryDate) {
            return null;
        }

        const now = new Date();
        const timeDiff = this.props.expiryDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        return Math.max(0, daysDiff);
    }

    /**
     * Soft deletes the perk
     * @param updUserId - ID of user making the update
     */
    softDelete(updUserId: string): void {
        this.props.delFlag = true;
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();
    }
}
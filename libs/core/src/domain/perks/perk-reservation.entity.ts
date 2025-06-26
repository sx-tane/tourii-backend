import { ReservationStatus } from '@prisma/client';
import { Entity } from '../entity';
import type { UserEntity } from '../user/user.entity';
import type { UserOnchainItem } from '../user/user-onchain-item';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';

interface PerkReservationProps {
    userOnchainItemId: string;
    userId: string;
    reservationDate: Date;
    partySize: number;
    specialRequests?: string;
    status: ReservationStatus;
    qrCodeData?: string;
    qrGeneratedAt?: Date;
    qrExpiresAt?: Date;
    redemptionLocation?: string;
    redeemedAt?: Date;
    redeemedBy?: string;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
    onchainPerk?: UserOnchainItem;
    user?: UserEntity;
}

export class PerkReservationEntity extends Entity<PerkReservationProps> {
    constructor(props: PerkReservationProps, id?: string) {
        super(props, id);
    }

    get reservationId(): string | undefined {
        return this.id;
    }

    get userOnchainItemId(): string {
        return this.props.userOnchainItemId;
    }

    get userId(): string {
        return this.props.userId;
    }

    get reservationDate(): Date {
        return this.props.reservationDate;
    }

    get partySize(): number {
        return this.props.partySize;
    }

    get specialRequests(): string | undefined {
        return this.props.specialRequests;
    }

    get status(): ReservationStatus {
        return this.props.status;
    }

    get qrCodeData(): string | undefined {
        return this.props.qrCodeData;
    }

    get qrGeneratedAt(): Date | undefined {
        return this.props.qrGeneratedAt;
    }

    get qrExpiresAt(): Date | undefined {
        return this.props.qrExpiresAt;
    }

    get redemptionLocation(): string | undefined {
        return this.props.redemptionLocation;
    }

    get redeemedAt(): Date | undefined {
        return this.props.redeemedAt;
    }

    get redeemedBy(): string | undefined {
        return this.props.redeemedBy;
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

    get onchainPerk(): UserOnchainItem | undefined {
        return this.props.onchainPerk;
    }

    get user(): UserEntity | undefined {
        return this.props.user;
    }

    /**
     * Checks if the reservation can be cancelled
     * @returns true if reservation can be cancelled, false otherwise
     */
    canBeCancelled(): boolean {
        if (this.props.delFlag) {
            return false;
        }

        if (this.props.status === ReservationStatus.COMPLETED) {
            return false;
        }

        if (this.props.status === ReservationStatus.CANCELLED) {
            return false;
        }

        // Cannot cancel if reservation is within 2 hours
        const now = new Date();
        const timeDiff = this.props.reservationDate.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);

        return hoursDiff > 2;
    }

    /**
     * Checks if the reservation can be modified
     * @returns true if reservation can be modified, false otherwise
     */
    canBeModified(): boolean {
        if (this.props.delFlag) {
            return false;
        }

        if (this.props.status !== ReservationStatus.PENDING && this.props.status !== ReservationStatus.CONFIRMED) {
            return false;
        }

        // Cannot modify if reservation is within 4 hours
        const now = new Date();
        const timeDiff = this.props.reservationDate.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);

        return hoursDiff > 4;
    }

    /**
     * Checks if QR code can be generated for this reservation
     * @returns true if QR code can be generated, false otherwise
     */
    canGenerateQR(): boolean {
        if (this.props.delFlag) {
            return false;
        }

        if (this.props.status !== ReservationStatus.CONFIRMED) {
            return false;
        }

        // QR code can be generated 24 hours before reservation
        const now = new Date();
        const timeDiff = this.props.reservationDate.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);

        return hoursDiff <= 24 && hoursDiff > 0;
    }

    /**
     * Checks if the QR code is currently valid
     * @returns true if QR code is valid, false otherwise
     */
    isQRValid(): boolean {
        if (!this.props.qrCodeData || !this.props.qrExpiresAt) {
            return false;
        }

        if (this.props.status !== ReservationStatus.CONFIRMED) {
            return false;
        }

        return new Date() < this.props.qrExpiresAt;
    }

    /**
     * Confirms the reservation
     * @param updUserId - ID of user making the update
     * @param redemptionLocation - location where perk can be redeemed
     */
    confirmReservation(updUserId: string, redemptionLocation?: string): void {
        if (this.props.status !== ReservationStatus.PENDING) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_001,
                'Only pending reservations can be confirmed'
            );
        }

        this.props.status = ReservationStatus.CONFIRMED;
        this.props.redemptionLocation = redemptionLocation;
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();
    }

    /**
     * Cancels the reservation
     * @param updUserId - ID of user making the update
     */
    cancelReservation(updUserId: string): void {
        if (!this.canBeCancelled()) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_002,
                'Reservation cannot be cancelled'
            );
        }

        this.props.status = ReservationStatus.CANCELLED;
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();

        // Clear QR code data when cancelled
        this.props.qrCodeData = undefined;
        this.props.qrGeneratedAt = undefined;
        this.props.qrExpiresAt = undefined;
    }

    /**
     * Updates the reservation details
     * @param newDate - new reservation date
     * @param newPartySize - new party size
     * @param newSpecialRequests - new special requests
     * @param updUserId - ID of user making the update
     */
    updateReservation(
        newDate: Date,
        newPartySize: number,
        newSpecialRequests: string | undefined,
        updUserId: string
    ): void {
        if (!this.canBeModified()) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_003,
                'Reservation cannot be modified'
            );
        }

        if (newDate <= new Date()) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_004,
                'Reservation date must be in the future'
            );
        }

        if (newPartySize <= 0 || newPartySize > 20) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_005,
                'Party size must be between 1 and 20'
            );
        }

        this.props.reservationDate = newDate;
        this.props.partySize = newPartySize;
        this.props.specialRequests = newSpecialRequests;
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();

        // Clear QR code if date changed (needs regeneration)
        if (this.props.qrCodeData) {
            this.props.qrCodeData = undefined;
            this.props.qrGeneratedAt = undefined;
            this.props.qrExpiresAt = undefined;
        }
    }

    /**
     * Generates QR code for the reservation
     * @param qrCodeData - generated QR code data
     * @param expiryHours - hours until QR expires (default 2)
     * @param updUserId - ID of user making the update
     */
    generateQRCode(qrCodeData: string, expiryHours: number = 2, updUserId: string): void {
        if (!this.canGenerateQR()) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_006,
                'QR code cannot be generated for this reservation'
            );
        }

        if (!qrCodeData) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_007,
                'QR code data cannot be empty'
            );
        }

        const now = new Date();
        const expiryDate = new Date(now.getTime() + (expiryHours * 60 * 60 * 1000));

        this.props.qrCodeData = qrCodeData;
        this.props.qrGeneratedAt = now;
        this.props.qrExpiresAt = expiryDate;
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();
    }

    /**
     * Redeems the perk using QR code
     * @param redeemedBy - staff or partner who validated the QR
     * @param updUserId - ID of user making the update
     */
    redeemPerk(redeemedBy: string, updUserId: string): void {
        if (!this.isQRValid()) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_008,
                'QR code is not valid for redemption'
            );
        }

        if (this.props.status !== ReservationStatus.CONFIRMED) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_009,
                'Only confirmed reservations can be redeemed'
            );
        }

        this.props.status = ReservationStatus.COMPLETED;
        this.props.redeemedAt = new Date();
        this.props.redeemedBy = redeemedBy;
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();
    }

    /**
     * Gets the time remaining until reservation
     * @returns object with days, hours, minutes until reservation
     */
    getTimeUntilReservation(): { days: number; hours: number; minutes: number } {
        const now = new Date();
        const timeDiff = this.props.reservationDate.getTime() - now.getTime();
        
        if (timeDiff <= 0) {
            return { days: 0, hours: 0, minutes: 0 };
        }

        const days = Math.floor(timeDiff / (1000 * 3600 * 24));
        const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
        const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));

        return { days, hours, minutes };
    }

    /**
     * Gets the time remaining until QR expires
     * @returns minutes until QR expires, or null if no QR
     */
    getQRTimeRemaining(): number | null {
        if (!this.props.qrExpiresAt) {
            return null;
        }

        const now = new Date();
        const timeDiff = this.props.qrExpiresAt.getTime() - now.getTime();
        
        if (timeDiff <= 0) {
            return 0;
        }

        return Math.floor(timeDiff / (1000 * 60));
    }

    /**
     * Checks if the reservation is today
     * @returns true if reservation is today, false otherwise
     */
    isReservationToday(): boolean {
        const now = new Date();
        const reservationDate = this.props.reservationDate;
        
        return now.toDateString() === reservationDate.toDateString();
    }

    /**
     * Gets a human-readable status description
     * @returns status description with additional context
     */
    getStatusDescription(): string {
        switch (this.props.status) {
            case ReservationStatus.PENDING:
                return 'Waiting for confirmation';
            case ReservationStatus.CONFIRMED:
                if (this.canGenerateQR()) {
                    return 'Ready for QR generation';
                }
                return 'Confirmed - QR available 24h before';
            case ReservationStatus.CANCELLED:
                return 'Cancelled';
            case ReservationStatus.COMPLETED:
                return `Completed on ${this.props.redeemedAt?.toLocaleDateString()}`;
            default:
                return 'Unknown status';
        }
    }

    /**
     * Soft deletes the reservation
     * @param updUserId - ID of user making the update
     */
    softDelete(updUserId: string): void {
        this.props.delFlag = true;
        this.props.updUserId = updUserId;
        this.props.updDateTime = new Date();
    }
}
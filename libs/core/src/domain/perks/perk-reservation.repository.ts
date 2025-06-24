import type { ReservationStatus } from '@prisma/client';
import type { PerkReservationEntity } from './perk-reservation.entity';

/**
 * Repository interface for managing perk reservation operations
 * Handles booking, QR generation, and redemption tracking for digital perks
 */

// --- Input Types ---

export interface CreateReservationRequest {
    perkId: string;
    userId: string;
    reservationDate: Date;
    partySize: number;
    specialRequests?: string;
    redemptionLocation?: string;
    insUserId: string;
    requestId?: string;
}

export interface UpdateReservationRequest {
    reservationId: string;
    reservationDate?: Date;
    partySize?: number;
    specialRequests?: string;
    status?: ReservationStatus;
    redemptionLocation?: string;
    updUserId: string;
    requestId?: string;
}

export interface GenerateQRRequest {
    reservationId: string;
    qrCodeData: string;
    expiryHours?: number;
    updUserId: string;
    requestId?: string;
}

export interface RedeemPerkRequest {
    reservationId: string;
    qrCodeData: string;
    redeemedBy: string;
    updUserId: string;
    requestId?: string;
}

export interface GetUserReservationsOptions {
    status?: ReservationStatus[];
    dateFrom?: Date;
    dateTo?: Date;
    includeExpiredQR?: boolean;
    sortBy?: 'reservation_date' | 'ins_date_time' | 'status';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface ReservationFilters {
    userId?: string;
    perkId?: string;
    status?: ReservationStatus;
    reservationDateFrom?: Date;
    reservationDateTo?: Date;
    redemptionLocation?: string;
    hasQRCode?: boolean;
    isQRExpired?: boolean;
    createdAfter?: Date;
    createdBefore?: Date;
}

// --- Output Types ---

export interface UserReservationsResult {
    reservations: PerkReservationEntity[];
    totalCount: number;
    pendingCount: number;
    confirmedCount: number;
    completedCount: number;
    cancelledCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

export interface ReservationStats {
    totalReservations: number;
    pendingReservations: number;
    confirmedReservations: number;
    completedReservations: number;
    cancelledReservations: number;
    todayReservations: number;
    thisWeekReservations: number;
    qrCodesGenerated: number;
    qrCodesExpired: number;
    avgPartySize: number;
    popularLocations: { location: string; count: number }[];
}

export interface QRValidationResult {
    isValid: boolean;
    reservation?: PerkReservationEntity;
    errorMessage?: string;
    expiresIn?: number; // minutes
}

export interface RedemptionRecord {
    reservationId: string;
    userId: string;
    perkId: string;
    redemptionLocation: string;
    redeemedAt: Date;
    redeemedBy: string;
    partySize: number;
}

export interface PerkReservationRepository {
    /**
     * Creates a new perk reservation
     * @param request - reservation creation details
     * @returns created reservation entity
     */
    createReservation(request: CreateReservationRequest): Promise<PerkReservationEntity>;

    /**
     * Finds a reservation by its ID
     * @param reservationId - unique reservation identifier
     * @returns reservation entity or null if not found
     */
    findReservationById(reservationId: string): Promise<PerkReservationEntity | null>;

    /**
     * Gets all reservations for a specific user
     * @param userId - user identifier
     * @param options - filtering and pagination options
     * @returns paginated list of user's reservations
     */
    getUserReservations(userId: string, options?: GetUserReservationsOptions): Promise<UserReservationsResult>;

    /**
     * Gets reservations for a specific perk
     * @param perkId - perk identifier
     * @param includeCompleted - whether to include completed reservations
     * @returns list of reservations for this perk
     */
    getReservationsByPerk(perkId: string, includeCompleted?: boolean): Promise<PerkReservationEntity[]>;

    /**
     * Updates reservation details
     * @param request - update details
     * @returns updated reservation entity
     */
    updateReservation(request: UpdateReservationRequest): Promise<PerkReservationEntity>;

    /**
     * Confirms a pending reservation
     * @param reservationId - reservation identifier
     * @param redemptionLocation - location where perk can be redeemed
     * @param updUserId - user making the update
     * @returns updated reservation entity
     */
    confirmReservation(reservationId: string, redemptionLocation: string, updUserId: string): Promise<PerkReservationEntity>;

    /**
     * Cancels a reservation
     * @param reservationId - reservation identifier
     * @param updUserId - user making the update
     * @returns updated reservation entity
     */
    cancelReservation(reservationId: string, updUserId: string): Promise<PerkReservationEntity>;

    /**
     * Generates QR code for a reservation
     * @param request - QR generation details
     * @returns updated reservation entity with QR data
     */
    generateQRCode(request: GenerateQRRequest): Promise<PerkReservationEntity>;

    /**
     * Validates a QR code for redemption
     * @param qrCodeData - QR code data to validate
     * @returns validation result with reservation details
     */
    validateQRCode(qrCodeData: string): Promise<QRValidationResult>;

    /**
     * Redeems a perk using QR code
     * @param request - redemption details
     * @returns updated reservation entity
     */
    redeemPerk(request: RedeemPerkRequest): Promise<PerkReservationEntity>;

    /**
     * Soft deletes a reservation
     * @param reservationId - reservation identifier
     * @param updUserId - user making the update
     * @returns success status
     */
    deleteReservation(reservationId: string, updUserId: string): Promise<boolean>;

    /**
     * Gets reservation statistics for user
     * @param userId - user identifier
     * @returns detailed reservation statistics
     */
    getReservationStats(userId: string): Promise<ReservationStats>;

    /**
     * Searches reservations with filters
     * @param filters - search criteria
     * @param page - page number (optional)
     * @param limit - items per page (optional)
     * @returns filtered list of reservations
     */
    searchReservations(filters: ReservationFilters, page?: number, limit?: number): Promise<UserReservationsResult>;

    /**
     * Gets reservations for a specific date range
     * @param startDate - start date
     * @param endDate - end date
     * @param status - optional status filter
     * @returns list of reservations in date range
     */
    getReservationsByDateRange(
        startDate: Date, 
        endDate: Date, 
        status?: ReservationStatus
    ): Promise<PerkReservationEntity[]>;

    /**
     * Gets reservations that need QR generation (24h before)
     * @returns list of reservations eligible for QR generation
     */
    getReservationsForQRGeneration(): Promise<PerkReservationEntity[]>;

    /**
     * Gets expired QR codes for cleanup
     * @param beforeDate - mark QR codes expired before this date
     * @returns list of reservations with expired QR codes
     */
    getExpiredQRCodes(beforeDate?: Date): Promise<PerkReservationEntity[]>;

    /**
     * Gets today's reservations for a location
     * @param redemptionLocation - location identifier
     * @param date - specific date (defaults to today)
     * @returns list of reservations for location on date
     */
    getLocationReservations(redemptionLocation: string, date?: Date): Promise<PerkReservationEntity[]>;

    /**
     * Gets redemption history for analytics
     * @param startDate - start date for history
     * @param endDate - end date for history
     * @param redemptionLocation - optional location filter
     * @returns list of redemption records
     */
    getRedemptionHistory(
        startDate: Date, 
        endDate: Date, 
        redemptionLocation?: string
    ): Promise<RedemptionRecord[]>;

    /**
     * Checks for reservation conflicts (same user, same time)
     * @param userId - user identifier
     * @param reservationDate - proposed reservation date
     * @param excludeReservationId - optional reservation to exclude from conflict check
     * @returns true if conflict exists, false otherwise
     */
    hasReservationConflict(
        userId: string, 
        reservationDate: Date, 
        excludeReservationId?: string
    ): Promise<boolean>;

    /**
     * Gets upcoming reservations (next 7 days)
     * @param userId - user identifier
     * @returns list of upcoming reservations
     */
    getUpcomingReservations(userId: string): Promise<PerkReservationEntity[]>;

    /**
     * Batch updates reservation status (for automated processes)
     * @param reservationIds - array of reservation IDs
     * @param status - new status
     * @param updUserId - user making the update
     * @returns number of updated reservations
     */
    batchUpdateReservationStatus(
        reservationIds: string[], 
        status: ReservationStatus, 
        updUserId: string
    ): Promise<number>;

    /**
     * Gets system-wide reservation analytics
     * @param startDate - start date for analytics
     * @param endDate - end date for analytics
     * @returns comprehensive reservation analytics
     */
    getSystemReservationStats(startDate: Date, endDate: Date): Promise<{
        totalReservations: number;
        completionRate: number;
        cancellationRate: number;
        avgLeadTime: number; // days between booking and reservation
        popularTimeSlots: { hour: number; count: number }[];
        popularLocations: { location: string; count: number }[];
        qrGenerationStats: {
            generated: number;
            redeemed: number;
            expired: number;
        };
    }>;
}
import type { AcquisitionType, PerkStatus } from '@prisma/client';
import type { PerkInventoryEntity } from './perk-inventory.entity';

/**
 * Repository interface for managing user perk inventory operations
 * Handles digital perks acquired through quests, purchases, or gifts
 */

// --- Input Types ---

export interface CreatePerkInventoryRequest {
    userId: string;
    onchainItemId: string;
    acquisitionType: AcquisitionType;
    sourceId?: string;
    quantity?: number;
    expiryDate?: Date;
    insUserId: string;
    requestId?: string;
}

export interface UpdatePerkInventoryRequest {
    perkId: string;
    quantity?: number;
    status?: PerkStatus;
    expiryDate?: Date;
    updUserId: string;
    requestId?: string;
}

export interface GetUserPerksOptions {
    status?: PerkStatus[];
    acquisitionType?: AcquisitionType[];
    includeExpired?: boolean;
    sortBy?: 'acquired_at' | 'expiry_date' | 'quantity';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface PerkInventoryFilters {
    userId?: string;
    onchainItemId?: string;
    acquisitionType?: AcquisitionType;
    sourceId?: string;
    status?: PerkStatus;
    isExpired?: boolean;
    createdAfter?: Date;
    createdBefore?: Date;
}

// --- Output Types ---

export interface UserPerksResult {
    perks: PerkInventoryEntity[];
    totalCount: number;
    activeCount: number;
    usedCount: number;
    expiredCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

export interface PerkUsageStats {
    totalPerks: number;
    activePerks: number;
    usedPerks: number;
    expiredPerks: number;
    cancelledPerks: number;
    questPerks: number;
    purchasedPerks: number;
    giftedPerks: number;
    expiringIn7Days: number;
    expiringIn30Days: number;
}

export interface PerkInventoryRepository {
    /**
     * Creates a new perk in user's inventory
     * @param request - perk creation details
     * @returns created perk entity
     */
    createPerk(request: CreatePerkInventoryRequest): Promise<PerkInventoryEntity>;

    /**
     * Finds a perk by its ID
     * @param perkId - unique perk identifier
     * @returns perk entity or null if not found
     */
    findPerkById(perkId: string): Promise<PerkInventoryEntity | null>;

    /**
     * Gets all perks for a specific user
     * @param userId - user identifier
     * @param options - filtering and pagination options
     * @returns paginated list of user's perks
     */
    getUserPerks(userId: string, options?: GetUserPerksOptions): Promise<UserPerksResult>;

    /**
     * Gets perks by onchain item ID (for checking ownership)
     * @param userId - user identifier
     * @param onchainItemId - catalog item identifier
     * @returns list of perks for this item
     */
    getPerksByItem(userId: string, onchainItemId: string): Promise<PerkInventoryEntity[]>;

    /**
     * Gets perks by acquisition source (quest ID or order ID)
     * @param sourceId - source identifier
     * @param acquisitionType - type of acquisition
     * @returns list of perks from this source
     */
    getPerksBySource(sourceId: string, acquisitionType: AcquisitionType): Promise<PerkInventoryEntity[]>;

    /**
     * Updates perk details
     * @param request - update details
     * @returns updated perk entity
     */
    updatePerk(request: UpdatePerkInventoryRequest): Promise<PerkInventoryEntity>;

    /**
     * Consumes/uses a perk (reduces quantity)
     * @param perkId - perk identifier
     * @param quantity - amount to consume
     * @param updUserId - user making the update
     * @returns updated perk entity
     */
    consumePerk(perkId: string, quantity: number, updUserId: string): Promise<PerkInventoryEntity>;

    /**
     * Marks perks as expired based on expiry date
     * @param beforeDate - mark perks expired before this date
     * @param updUserId - user making the update
     * @returns number of perks marked as expired
     */
    markExpiredPerks(beforeDate: Date, updUserId: string): Promise<number>;

    /**
     * Soft deletes a perk
     * @param perkId - perk identifier
     * @param updUserId - user making the update
     * @returns success status
     */
    deletePerk(perkId: string, updUserId: string): Promise<boolean>;

    /**
     * Gets usage statistics for user's perks
     * @param userId - user identifier
     * @returns detailed usage statistics
     */
    getPerkUsageStats(userId: string): Promise<PerkUsageStats>;

    /**
     * Searches perks with filters
     * @param filters - search criteria
     * @param page - page number (optional)
     * @param limit - items per page (optional)
     * @returns filtered list of perks
     */
    searchPerks(filters: PerkInventoryFilters, page?: number, limit?: number): Promise<UserPerksResult>;

    /**
     * Gets perks expiring within specified days
     * @param userId - user identifier
     * @param daysAhead - number of days to look ahead
     * @returns list of expiring perks
     */
    getExpiringPerks(userId: string, daysAhead: number): Promise<PerkInventoryEntity[]>;

    /**
     * Transfers a perk to another user (for gifting)
     * @param perkId - perk identifier
     * @param toUserId - recipient user ID
     * @param updUserId - user making the transfer
     * @returns success status
     */
    transferPerk(perkId: string, toUserId: string, updUserId: string): Promise<boolean>;

    /**
     * Batch creates multiple perks (for order fulfillment)
     * @param perks - array of perk creation requests
     * @returns array of created perk entities
     */
    batchCreatePerks(perks: CreatePerkInventoryRequest[]): Promise<PerkInventoryEntity[]>;

    /**
     * Gets total count of perks for a user
     * @param userId - user identifier
     * @param status - optional status filter
     * @returns total count
     */
    getPerkCount(userId: string, status?: PerkStatus): Promise<number>;

    /**
     * Validates if user has required perks for an operation
     * @param userId - user identifier
     * @param requirements - list of required items and quantities
     * @returns validation result with missing items
     */
    validatePerkRequirements(
        userId: string, 
        requirements: { onchainItemId: string; quantity: number }[]
    ): Promise<{ isValid: boolean; missingItems: string[] }>;

    /**
     * Gets aggregated perk statistics across all users
     * @param startDate - start date for statistics
     * @param endDate - end date for statistics
     * @returns system-wide perk statistics
     */
    getSystemPerkStats(startDate: Date, endDate: Date): Promise<{
        totalPerksCreated: number;
        totalPerksUsed: number;
        totalActivePerks: number;
        topQuestRewards: { questId: string; count: number }[];
        topPurchasedItems: { onchainItemId: string; count: number }[];
    }>;
}
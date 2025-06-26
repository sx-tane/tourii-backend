import type { AcquisitionType, OnchainItemStatus, OnchainItemType } from '@prisma/client';
import type { UserOnchainItem } from './user-onchain-item';

export interface CreateOnchainItemRequest {
    userId: string;
    itemType: OnchainItemType;
    itemTxnHash: string;
    blockchainType: string;
    onchainItemId: string;
    // Perk-specific fields (optional, only used for PERK items)
    acquisitionType?: AcquisitionType;
    sourceId?: string;
    quantity?: number;
    expiryDate?: Date;
    insUserId: string;
}

export interface UpdateOnchainItemRequest {
    userOnchainItemId: string;
    status?: OnchainItemStatus;
    quantity?: number;
    expiryDate?: Date;
    updUserId: string;
}

export interface OnchainItemSearchFilter {
    userId?: string;
    itemType?: OnchainItemType;
    status?: OnchainItemStatus;
    acquisitionType?: AcquisitionType;
    sourceId?: string;
    isExpired?: boolean;
    onlyPerks?: boolean;
    onlyActive?: boolean;
}

export interface OnchainItemListOptions {
    filter?: OnchainItemSearchFilter;
    sortBy?: 'acquiredAt' | 'expiryDate' | 'quantity' | 'status';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

export interface PerkUsageStats {
    userId: string;
    totalPerks: number;
    activePerks: number;
    usedPerks: number;
    expiredPerks: number;
    perksByAcquisition: {
        quest: number;
        purchase: number;
        gift: number;
    };
    expiringIn7Days: number;
    expiringIn30Days: number;
    totalValue: number;
}

export interface SystemPerkAnalytics {
    totalPerksDistributed: number;
    totalPerksRedeemed: number;
    redemptionRate: number;
    popularPerks: Array<{
        onchainItemId: string;
        name: string;
        distributedCount: number;
        redeemedCount: number;
        redemptionRate: number;
    }>;
    acquisitionBreakdown: {
        quest: number;
        purchase: number;
        gift: number;
    };
    avgTimeToRedemption: number; // in days
}

export interface UserOnchainItemRepository {
    /**
     * Creates a new onchain item for a user
     */
    create(request: CreateOnchainItemRequest): Promise<UserOnchainItem>;

    /**
     * Finds an onchain item by its ID
     */
    findById(userOnchainItemId: string): Promise<UserOnchainItem | undefined>;

    /**
     * Finds onchain item by transaction hash
     */
    findByTxnHash(itemTxnHash: string): Promise<UserOnchainItem | undefined>;

    /**
     * Updates an existing onchain item
     */
    update(request: UpdateOnchainItemRequest): Promise<UserOnchainItem>;

    /**
     * Soft deletes an onchain item
     */
    softDelete(userOnchainItemId: string, updUserId: string): Promise<void>;

    /**
     * Gets all onchain items for a user with filtering
     */
    findByUserId(userId: string, options?: OnchainItemListOptions): Promise<UserOnchainItem[]>;

    /**
     * Gets user's perk inventory (only PERK items)
     */
    getUserPerks(userId: string, options?: OnchainItemListOptions): Promise<UserOnchainItem[]>;

    /**
     * Finds active perks by onchain item catalog ID
     */
    findActivePerksByOnchainItemId(userId: string, onchainItemId: string): Promise<UserOnchainItem[]>;

    /**
     * Searches onchain items with complex filters
     */
    search(options: OnchainItemListOptions): Promise<UserOnchainItem[]>;

    /**
     * Counts onchain items matching filter criteria
     */
    count(filter?: OnchainItemSearchFilter): Promise<number>;

    /**
     * Finds expiring perks within specified days
     */
    findExpiringPerks(days: number): Promise<UserOnchainItem[]>;

    /**
     * Finds expired perks that need cleanup
     */
    findExpiredPerks(): Promise<UserOnchainItem[]>;

    /**
     * Updates expired perks status
     */
    markExpiredPerks(updUserId: string): Promise<number>;

    /**
     * Finds perks by acquisition type and source
     */
    findPerksBySource(acquisitionType: AcquisitionType, sourceId: string): Promise<UserOnchainItem[]>;

    /**
     * Gets perk usage statistics for a user
     */
    getPerkUsageStats(userId: string): Promise<PerkUsageStats>;

    /**
     * Gets system-wide perk analytics
     */
    getSystemPerkAnalytics(startDate?: Date, endDate?: Date): Promise<SystemPerkAnalytics>;

    /**
     * Batch creates multiple onchain items (for quest rewards, bulk purchases)
     */
    batchCreate(requests: CreateOnchainItemRequest[]): Promise<UserOnchainItem[]>;

    /**
     * Batch updates multiple onchain items
     */
    batchUpdate(requests: UpdateOnchainItemRequest[]): Promise<UserOnchainItem[]>;

    /**
     * Transfers a perk from one user to another (for gifting)
     */
    transferPerk(userOnchainItemId: string, fromUserId: string, toUserId: string, updUserId: string): Promise<UserOnchainItem>;

    /**
     * Burns/consumes a perk (sets status to USED and quantity to 0)
     */
    burnPerk(userOnchainItemId: string, quantity: number, updUserId: string): Promise<UserOnchainItem>;

    /**
     * Gets the most popular perks by redemption rate
     */
    getPopularPerks(limit?: number): Promise<Array<{ onchainItemId: string; redemptionCount: number; totalDistributed: number; redemptionRate: number }>>;

    /**
     * Gets perks that are about to expire for notification purposes
     */
    getPerksForExpiryNotification(userId: string, notificationThresholdDays: number): Promise<UserOnchainItem[]>;

    /**
     * Gets total value of user's active perks (based on catalog prices)
     */
    getUserPerkValue(userId: string): Promise<number>;

    /**
     * Finds duplicate perks (same user, same onchain item ID, active status)
     */
    findDuplicatePerks(userId: string, onchainItemId: string): Promise<UserOnchainItem[]>;

    /**
     * Consolidates duplicate perks by combining quantities
     */
    consolidateDuplicatePerks(userOnchainItemId: string, duplicateIds: string[], updUserId: string): Promise<UserOnchainItem>;

    /**
     * Gets user's onchain item history with transactions
     */
    getUserOnchainItemHistory(userId: string, itemType?: OnchainItemType, limit?: number): Promise<UserOnchainItem[]>;

    /**
     * Validates if a perk can be used for a specific purpose
     */
    validatePerkUsage(userOnchainItemId: string, requiredQuantity: number): Promise<{ valid: boolean; reason?: string }>;

    /**
     * Gets blockchain transaction details for an onchain item
     */
    getBlockchainDetails(userOnchainItemId: string): Promise<{ txnHash: string; blockchainType: string; mintedAt?: Date }>;
}
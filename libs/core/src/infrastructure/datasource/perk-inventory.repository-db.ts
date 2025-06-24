import { Injectable } from '@nestjs/common';
import { Prisma, AcquisitionType, PerkStatus } from '@prisma/client';
import { PrismaService } from './prisma.service';
import type {
    PerkInventoryRepository,
    CreatePerkInventoryRequest,
    UpdatePerkInventoryRequest,
    GetUserPerksOptions,
    PerkInventoryFilters,
    UserPerksResult,
    PerkUsageStats,
} from '../../domain/perks/perk-inventory.repository';
import { PerkInventoryEntity } from '../../domain/perks/perk-inventory.entity';
import { PerkInventoryMapper } from '../mapper/perk-inventory.mapper';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';

@Injectable()
export class PerkInventoryRepositoryDb implements PerkInventoryRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: PerkInventoryMapper
    ) {}

    async createPerk(request: CreatePerkInventoryRequest): Promise<PerkInventoryEntity> {
        try {
            const perkData = await this.prisma.user_perk_inventory.create({
                data: {
                    user_id: request.userId,
                    onchain_item_id: request.onchainItemId,
                    acquisition_type: request.acquisitionType,
                    source_id: request.sourceId,
                    quantity: request.quantity || 1,
                    expiry_date: request.expiryDate,
                    status: PerkStatus.ACTIVE,
                    acquired_at: new Date(),
                    ins_user_id: request.insUserId,
                    ins_date_time: new Date(),
                    upd_user_id: request.insUserId,
                    upd_date_time: new Date(),
                    request_id: request.requestId,
                    del_flag: false,
                },
                include: this.getPerkInclude(),
            });

            return this.mapper.toDomain(perkData);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new TouriiBackendAppException(
                        TouriiBackendAppErrorType.E_PERK_001,
                        'Perk creation failed due to constraint violation'
                    );
                }
                if (error.code === 'P2003') {
                    throw new TouriiBackendAppException(
                        TouriiBackendAppErrorType.E_PERK_001,
                        'Invalid user or onchain item reference'
                    );
                }
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                `Failed to create perk: ${error.message}`
            );
        }
    }

    async findPerkById(perkId: string): Promise<PerkInventoryEntity | null> {
        try {
            const perkData = await this.prisma.user_perk_inventory.findUnique({
                where: {
                    perk_id: perkId,
                    del_flag: false,
                },
                include: this.getPerkInclude(),
            });

            return perkData ? this.mapper.toDomain(perkData) : null;
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                `Failed to find perk: ${error.message}`
            );
        }
    }

    async getUserPerks(userId: string, options: GetUserPerksOptions = {}): Promise<UserPerksResult> {
        try {
            const where: Prisma.user_perk_inventoryWhereInput = {
                user_id: userId,
                del_flag: false,
            };

            // Apply status filter
            if (options.status && options.status.length > 0) {
                where.status = { in: options.status };
            }

            // Apply acquisition type filter
            if (options.acquisitionType && options.acquisitionType.length > 0) {
                where.acquisition_type = { in: options.acquisitionType };
            }

            // Apply expiry filter
            if (!options.includeExpired) {
                where.OR = [
                    { expiry_date: null },
                    { expiry_date: { gt: new Date() } },
                ];
            }

            // Pagination
            const page = options.page || 1;
            const limit = Math.min(options.limit || 20, 100);
            const skip = (page - 1) * limit;

            // Sorting
            const orderBy: Prisma.user_perk_inventoryOrderByWithRelationInput = {};
            const sortBy = options.sortBy || 'acquired_at';
            const sortOrder = options.sortOrder || 'desc';
            orderBy[sortBy] = sortOrder;

            // Get total count
            const totalCount = await this.prisma.user_perk_inventory.count({ where });

            // Get perks
            const perksData = await this.prisma.user_perk_inventory.findMany({
                where,
                include: this.getPerkInclude(),
                orderBy,
                skip,
                take: limit,
            });

            // Get status counts
            const statusCounts = await this.prisma.user_perk_inventory.groupBy({
                by: ['status'],
                where: {
                    user_id: userId,
                    del_flag: false,
                },
                _count: { status: true },
            });

            const activeCount = statusCounts.find(s => s.status === PerkStatus.ACTIVE)?._count.status || 0;
            const usedCount = statusCounts.find(s => s.status === PerkStatus.USED)?._count.status || 0;
            const expiredCount = statusCounts.find(s => s.status === PerkStatus.EXPIRED)?._count.status || 0;

            const perks = perksData.map(perk => this.mapper.toDomain(perk));

            return {
                perks,
                totalCount,
                activeCount,
                usedCount,
                expiredCount,
                currentPage: page,
                pageSize: limit,
                totalPages: Math.ceil(totalCount / limit),
            };
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                `Failed to get user perks: ${error.message}`
            );
        }
    }

    async getPerksByItem(userId: string, onchainItemId: string): Promise<PerkInventoryEntity[]> {
        try {
            const perksData = await this.prisma.user_perk_inventory.findMany({
                where: {
                    user_id: userId,
                    onchain_item_id: onchainItemId,
                    del_flag: false,
                },
                include: this.getPerkInclude(),
                orderBy: { acquired_at: 'desc' },
            });

            return perksData.map(perk => this.mapper.toDomain(perk));
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                `Failed to get perks by item: ${error.message}`
            );
        }
    }

    async getPerksBySource(sourceId: string, acquisitionType: AcquisitionType): Promise<PerkInventoryEntity[]> {
        try {
            const perksData = await this.prisma.user_perk_inventory.findMany({
                where: {
                    source_id: sourceId,
                    acquisition_type: acquisitionType,
                    del_flag: false,
                },
                include: this.getPerkInclude(),
                orderBy: { acquired_at: 'desc' },
            });

            return perksData.map(perk => this.mapper.toDomain(perk));
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                `Failed to get perks by source: ${error.message}`
            );
        }
    }

    async updatePerk(request: UpdatePerkInventoryRequest): Promise<PerkInventoryEntity> {
        try {
            const updateData: Prisma.user_perk_inventoryUpdateInput = {
                upd_user_id: request.updUserId,
                upd_date_time: new Date(),
                request_id: request.requestId,
            };

            if (request.quantity !== undefined) {
                updateData.quantity = request.quantity;
            }
            if (request.status !== undefined) {
                updateData.status = request.status;
            }
            if (request.expiryDate !== undefined) {
                updateData.expiry_date = request.expiryDate;
            }

            const perkData = await this.prisma.user_perk_inventory.update({
                where: {
                    perk_id: request.perkId,
                    del_flag: false,
                },
                data: updateData,
                include: this.getPerkInclude(),
            });

            return this.mapper.toDomain(perkData);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_PERK_001,
                    'Perk not found or already deleted'
                );
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                `Failed to update perk: ${error.message}`
            );
        }
    }

    async consumePerk(perkId: string, quantity: number, updUserId: string): Promise<PerkInventoryEntity> {
        try {
            const perk = await this.findPerkById(perkId);
            if (!perk) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_PERK_001,
                    'Perk not found'
                );
            }

            // Use entity business logic
            perk.consumePerk(quantity, updUserId);

            return await this.updatePerk({
                perkId,
                quantity: perk.quantity,
                status: perk.status,
                updUserId,
            });
        } catch (error) {
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_003,
                `Failed to consume perk: ${error.message}`
            );
        }
    }

    async markExpiredPerks(beforeDate: Date, updUserId: string): Promise<number> {
        try {
            const result = await this.prisma.user_perk_inventory.updateMany({
                where: {
                    expiry_date: { lte: beforeDate },
                    status: PerkStatus.ACTIVE,
                    del_flag: false,
                },
                data: {
                    status: PerkStatus.EXPIRED,
                    upd_user_id: updUserId,
                    upd_date_time: new Date(),
                },
            });

            return result.count;
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_004,
                `Failed to mark expired perks: ${error.message}`
            );
        }
    }

    async deletePerk(perkId: string, updUserId: string): Promise<boolean> {
        try {
            const result = await this.prisma.user_perk_inventory.update({
                where: {
                    perk_id: perkId,
                    del_flag: false,
                },
                data: {
                    del_flag: true,
                    upd_user_id: updUserId,
                    upd_date_time: new Date(),
                },
            });

            return true;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return false;
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                `Failed to delete perk: ${error.message}`
            );
        }
    }

    async getPerkUsageStats(userId: string): Promise<PerkUsageStats> {
        try {
            const stats = await this.prisma.user_perk_inventory.groupBy({
                by: ['status', 'acquisition_type'],
                where: {
                    user_id: userId,
                    del_flag: false,
                },
                _count: { perk_id: true },
            });

            const now = new Date();
            const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

            const expiringStats = await this.prisma.user_perk_inventory.findMany({
                where: {
                    user_id: userId,
                    status: PerkStatus.ACTIVE,
                    expiry_date: { not: null },
                    del_flag: false,
                },
                select: { expiry_date: true },
            });

            const expiringIn7Days = expiringStats.filter(
                s => s.expiry_date && s.expiry_date <= sevenDaysFromNow
            ).length;

            const expiringIn30Days = expiringStats.filter(
                s => s.expiry_date && s.expiry_date <= thirtyDaysFromNow
            ).length;

            return {
                totalPerks: stats.reduce((sum, s) => sum + s._count.perk_id, 0),
                activePerks: stats.filter(s => s.status === PerkStatus.ACTIVE).reduce((sum, s) => sum + s._count.perk_id, 0),
                usedPerks: stats.filter(s => s.status === PerkStatus.USED).reduce((sum, s) => sum + s._count.perk_id, 0),
                expiredPerks: stats.filter(s => s.status === PerkStatus.EXPIRED).reduce((sum, s) => sum + s._count.perk_id, 0),
                cancelledPerks: stats.filter(s => s.status === PerkStatus.CANCELLED).reduce((sum, s) => sum + s._count.perk_id, 0),
                questPerks: stats.filter(s => s.acquisition_type === AcquisitionType.QUEST).reduce((sum, s) => sum + s._count.perk_id, 0),
                purchasedPerks: stats.filter(s => s.acquisition_type === AcquisitionType.PURCHASE).reduce((sum, s) => sum + s._count.perk_id, 0),
                giftedPerks: stats.filter(s => s.acquisition_type === AcquisitionType.GIFT).reduce((sum, s) => sum + s._count.perk_id, 0),
                expiringIn7Days,
                expiringIn30Days,
            };
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                `Failed to get perk usage stats: ${error.message}`
            );
        }
    }

    async searchPerks(filters: PerkInventoryFilters, page = 1, limit = 20): Promise<UserPerksResult> {
        try {
            const where: Prisma.user_perk_inventoryWhereInput = {
                del_flag: false,
            };

            if (filters.userId) where.user_id = filters.userId;
            if (filters.onchainItemId) where.onchain_item_id = filters.onchainItemId;
            if (filters.acquisitionType) where.acquisition_type = filters.acquisitionType;
            if (filters.sourceId) where.source_id = filters.sourceId;
            if (filters.status) where.status = filters.status;
            if (filters.createdAfter) where.ins_date_time = { gte: filters.createdAfter };
            if (filters.createdBefore) {
                where.ins_date_time = where.ins_date_time ? 
                    { ...where.ins_date_time, lte: filters.createdBefore } : 
                    { lte: filters.createdBefore };
            }
            if (filters.isExpired !== undefined) {
                if (filters.isExpired) {
                    where.expiry_date = { lte: new Date() };
                } else {
                    where.OR = [
                        { expiry_date: null },
                        { expiry_date: { gt: new Date() } },
                    ];
                }
            }

            const skip = (page - 1) * Math.min(limit, 100);
            const take = Math.min(limit, 100);

            const [totalCount, perksData] = await Promise.all([
                this.prisma.user_perk_inventory.count({ where }),
                this.prisma.user_perk_inventory.findMany({
                    where,
                    include: this.getPerkInclude(),
                    orderBy: { acquired_at: 'desc' },
                    skip,
                    take,
                }),
            ]);

            const perks = perksData.map(perk => this.mapper.toDomain(perk));

            return {
                perks,
                totalCount,
                activeCount: 0, // Would need separate query for accuracy
                usedCount: 0,
                expiredCount: 0,
                currentPage: page,
                pageSize: take,
                totalPages: Math.ceil(totalCount / take),
            };
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                `Failed to search perks: ${error.message}`
            );
        }
    }

    async getExpiringPerks(userId: string, daysAhead: number): Promise<PerkInventoryEntity[]> {
        try {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + daysAhead);

            const perksData = await this.prisma.user_perk_inventory.findMany({
                where: {
                    user_id: userId,
                    status: PerkStatus.ACTIVE,
                    expiry_date: {
                        not: null,
                        lte: futureDate,
                        gt: new Date(),
                    },
                    del_flag: false,
                },
                include: this.getPerkInclude(),
                orderBy: { expiry_date: 'asc' },
            });

            return perksData.map(perk => this.mapper.toDomain(perk));
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                `Failed to get expiring perks: ${error.message}`
            );
        }
    }

    async transferPerk(perkId: string, toUserId: string, updUserId: string): Promise<boolean> {
        try {
            const result = await this.prisma.user_perk_inventory.update({
                where: {
                    perk_id: perkId,
                    del_flag: false,
                },
                data: {
                    user_id: toUserId,
                    acquisition_type: AcquisitionType.GIFT,
                    source_id: updUserId, // Track who gifted it
                    upd_user_id: updUserId,
                    upd_date_time: new Date(),
                },
            });

            return true;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return false;
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                `Failed to transfer perk: ${error.message}`
            );
        }
    }

    async batchCreatePerks(perks: CreatePerkInventoryRequest[]): Promise<PerkInventoryEntity[]> {
        try {
            const perkData = perks.map(perk => ({
                user_id: perk.userId,
                onchain_item_id: perk.onchainItemId,
                acquisition_type: perk.acquisitionType,
                source_id: perk.sourceId,
                quantity: perk.quantity || 1,
                expiry_date: perk.expiryDate,
                status: PerkStatus.ACTIVE,
                acquired_at: new Date(),
                ins_user_id: perk.insUserId,
                ins_date_time: new Date(),
                upd_user_id: perk.insUserId,
                upd_date_time: new Date(),
                request_id: perk.requestId,
                del_flag: false,
            }));

            const result = await this.prisma.$transaction(async (tx) => {
                const createdPerks = [];
                for (const data of perkData) {
                    const created = await tx.user_perk_inventory.create({
                        data,
                        include: this.getPerkInclude(),
                    });
                    createdPerks.push(created);
                }
                return createdPerks;
            });

            return result.map(perk => this.mapper.toDomain(perk));
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                `Failed to batch create perks: ${error.message}`
            );
        }
    }

    async getPerkCount(userId: string, status?: PerkStatus): Promise<number> {
        try {
            const where: Prisma.user_perk_inventoryWhereInput = {
                user_id: userId,
                del_flag: false,
            };

            if (status) {
                where.status = status;
            }

            return await this.prisma.user_perk_inventory.count({ where });
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                `Failed to get perk count: ${error.message}`
            );
        }
    }

    async validatePerkRequirements(
        userId: string,
        requirements: { onchainItemId: string; quantity: number }[]
    ): Promise<{ isValid: boolean; missingItems: string[] }> {
        try {
            const missingItems: string[] = [];

            for (const requirement of requirements) {
                const availableQuantity = await this.prisma.user_perk_inventory.aggregate({
                    where: {
                        user_id: userId,
                        onchain_item_id: requirement.onchainItemId,
                        status: PerkStatus.ACTIVE,
                        del_flag: false,
                        OR: [
                            { expiry_date: null },
                            { expiry_date: { gt: new Date() } },
                        ],
                    },
                    _sum: { quantity: true },
                });

                const totalAvailable = availableQuantity._sum.quantity || 0;
                if (totalAvailable < requirement.quantity) {
                    missingItems.push(requirement.onchainItemId);
                }
            }

            return {
                isValid: missingItems.length === 0,
                missingItems,
            };
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                `Failed to validate perk requirements: ${error.message}`
            );
        }
    }

    async getSystemPerkStats(startDate: Date, endDate: Date): Promise<{
        totalPerksCreated: number;
        totalPerksUsed: number;
        totalActivePerks: number;
        topQuestRewards: { questId: string; count: number }[];
        topPurchasedItems: { onchainItemId: string; count: number }[];
    }> {
        try {
            const [created, used, active, questRewards, purchased] = await Promise.all([
                this.prisma.user_perk_inventory.count({
                    where: {
                        ins_date_time: { gte: startDate, lte: endDate },
                        del_flag: false,
                    },
                }),
                this.prisma.user_perk_inventory.count({
                    where: {
                        status: PerkStatus.USED,
                        upd_date_time: { gte: startDate, lte: endDate },
                        del_flag: false,
                    },
                }),
                this.prisma.user_perk_inventory.count({
                    where: {
                        status: PerkStatus.ACTIVE,
                        del_flag: false,
                    },
                }),
                this.prisma.user_perk_inventory.groupBy({
                    by: ['source_id'],
                    where: {
                        acquisition_type: AcquisitionType.QUEST,
                        ins_date_time: { gte: startDate, lte: endDate },
                        del_flag: false,
                        source_id: { not: null },
                    },
                    _count: { perk_id: true },
                    orderBy: { _count: { perk_id: 'desc' } },
                    take: 10,
                }),
                this.prisma.user_perk_inventory.groupBy({
                    by: ['onchain_item_id'],
                    where: {
                        acquisition_type: AcquisitionType.PURCHASE,
                        ins_date_time: { gte: startDate, lte: endDate },
                        del_flag: false,
                    },
                    _count: { perk_id: true },
                    orderBy: { _count: { perk_id: 'desc' } },
                    take: 10,
                }),
            ]);

            return {
                totalPerksCreated: created,
                totalPerksUsed: used,
                totalActivePerks: active,
                topQuestRewards: questRewards.map(q => ({
                    questId: q.source_id!,
                    count: q._count.perk_id,
                })),
                topPurchasedItems: purchased.map(p => ({
                    onchainItemId: p.onchain_item_id,
                    count: p._count.perk_id,
                })),
            };
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PERK_001,
                `Failed to get system perk stats: ${error.message}`
            );
        }
    }

    private getPerkInclude(): Prisma.user_perk_inventoryInclude {
        return {
            user: {
                select: {
                    user_id: true,
                    username: true,
                    email: true,
                    image_url: true,
                },
            },
            perk_catalog: {
                select: {
                    onchain_item_id: true,
                    nft_name: true,
                    nft_description: true,
                    image_url: true,
                    item_type: true,
                    blockchain_type: true,
                    attributes: true,
                    release_date: true,
                    expiry_date: true,
                },
            },
            reservations: {
                where: { del_flag: false },
                select: {
                    reservation_id: true,
                    status: true,
                    reservation_date: true,
                },
            },
        };
    }
}
import { Injectable } from '@nestjs/common';
import { Prisma, ReservationStatus } from '@prisma/client';
import { PrismaService } from './prisma.service';
import type {
    PerkReservationRepository,
    CreateReservationRequest,
    UpdateReservationRequest,
    GenerateQRRequest,
    RedeemPerkRequest,
    GetUserReservationsOptions,
    ReservationFilters,
    UserReservationsResult,
    ReservationStats,
    QRValidationResult,
    RedemptionRecord,
} from '../../domain/perks/perk-reservation.repository';
import { PerkReservationEntity } from '../../domain/perks/perk-reservation.entity';
import { PerkReservationMapper } from '../mapper/perk-reservation.mapper';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';

@Injectable()
export class PerkReservationRepositoryDb implements PerkReservationRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: PerkReservationMapper
    ) {}

    async createReservation(request: CreateReservationRequest): Promise<PerkReservationEntity> {
        try {
            const reservationData = await this.prisma.perk_reservation.create({
                data: {
                    perk_id: request.perkId,
                    user_id: request.userId,
                    reservation_date: request.reservationDate,
                    party_size: request.partySize,
                    special_requests: request.specialRequests,
                    redemption_location: request.redemptionLocation,
                    status: ReservationStatus.PENDING,
                    ins_user_id: request.insUserId,
                    ins_date_time: new Date(),
                    upd_user_id: request.insUserId,
                    upd_date_time: new Date(),
                    request_id: request.requestId,
                    del_flag: false,
                },
                include: this.getReservationInclude(),
            });

            return this.mapper.toDomain(reservationData);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new TouriiBackendAppException(
                        TouriiBackendAppErrorType.E_RESERVATION_001,
                        'Invalid perk or user reference'
                    );
                }
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_001,
                `Failed to create reservation: ${error.message}`
            );
        }
    }

    async findReservationById(reservationId: string): Promise<PerkReservationEntity | null> {
        try {
            const reservationData = await this.prisma.perk_reservation.findUnique({
                where: {
                    reservation_id: reservationId,
                    del_flag: false,
                },
                include: this.getReservationInclude(),
            });

            return reservationData ? this.mapper.toDomain(reservationData) : null;
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_001,
                `Failed to find reservation: ${error.message}`
            );
        }
    }

    async getUserReservations(userId: string, options: GetUserReservationsOptions = {}): Promise<UserReservationsResult> {
        try {
            const where: Prisma.perk_reservationWhereInput = {
                user_id: userId,
                del_flag: false,
            };

            // Apply status filter
            if (options.status && options.status.length > 0) {
                where.status = { in: options.status };
            }

            // Apply date filters
            if (options.dateFrom) {
                where.reservation_date = { gte: options.dateFrom };
            }
            if (options.dateTo) {
                where.reservation_date = where.reservation_date ? 
                    { ...where.reservation_date, lte: options.dateTo } : 
                    { lte: options.dateTo };
            }

            // QR expiry filter
            if (!options.includeExpiredQR) {
                where.OR = [
                    { qr_expires_at: null },
                    { qr_expires_at: { gt: new Date() } },
                ];
            }

            // Pagination
            const page = options.page || 1;
            const limit = Math.min(options.limit || 20, 100);
            const skip = (page - 1) * limit;

            // Sorting
            const orderBy: Prisma.perk_reservationOrderByWithRelationInput = {};
            const sortBy = options.sortBy || 'reservation_date';
            const sortOrder = options.sortOrder || 'desc';
            orderBy[sortBy] = sortOrder;

            // Get total count
            const totalCount = await this.prisma.perk_reservation.count({ where });

            // Get reservations
            const reservationsData = await this.prisma.perk_reservation.findMany({
                where,
                include: this.getReservationInclude(),
                orderBy,
                skip,
                take: limit,
            });

            // Get status counts
            const statusCounts = await this.prisma.perk_reservation.groupBy({
                by: ['status'],
                where: {
                    user_id: userId,
                    del_flag: false,
                },
                _count: { status: true },
            });

            const pendingCount = statusCounts.find(s => s.status === ReservationStatus.PENDING)?._count.status || 0;
            const confirmedCount = statusCounts.find(s => s.status === ReservationStatus.CONFIRMED)?._count.status || 0;
            const completedCount = statusCounts.find(s => s.status === ReservationStatus.COMPLETED)?._count.status || 0;
            const cancelledCount = statusCounts.find(s => s.status === ReservationStatus.CANCELLED)?._count.status || 0;

            const reservations = reservationsData.map(reservation => this.mapper.toDomain(reservation));

            return {
                reservations,
                totalCount,
                pendingCount,
                confirmedCount,
                completedCount,
                cancelledCount,
                currentPage: page,
                pageSize: limit,
                totalPages: Math.ceil(totalCount / limit),
            };
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_001,
                `Failed to get user reservations: ${error.message}`
            );
        }
    }

    async getReservationsByPerk(perkId: string, includeCompleted = false): Promise<PerkReservationEntity[]> {
        try {
            const where: Prisma.perk_reservationWhereInput = {
                perk_id: perkId,
                del_flag: false,
            };

            if (!includeCompleted) {
                where.status = { not: ReservationStatus.COMPLETED };
            }

            const reservationsData = await this.prisma.perk_reservation.findMany({
                where,
                include: this.getReservationInclude(),
                orderBy: { reservation_date: 'asc' },
            });

            return reservationsData.map(reservation => this.mapper.toDomain(reservation));
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_001,
                `Failed to get reservations by perk: ${error.message}`
            );
        }
    }

    async updateReservation(request: UpdateReservationRequest): Promise<PerkReservationEntity> {
        try {
            const updateData: Prisma.perk_reservationUpdateInput = {
                upd_user_id: request.updUserId,
                upd_date_time: new Date(),
                request_id: request.requestId,
            };

            if (request.reservationDate !== undefined) {
                updateData.reservation_date = request.reservationDate;
            }
            if (request.partySize !== undefined) {
                updateData.party_size = request.partySize;
            }
            if (request.specialRequests !== undefined) {
                updateData.special_requests = request.specialRequests;
            }
            if (request.status !== undefined) {
                updateData.status = request.status;
            }
            if (request.redemptionLocation !== undefined) {
                updateData.redemption_location = request.redemptionLocation;
            }

            const reservationData = await this.prisma.perk_reservation.update({
                where: {
                    reservation_id: request.reservationId,
                    del_flag: false,
                },
                data: updateData,
                include: this.getReservationInclude(),
            });

            return this.mapper.toDomain(reservationData);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_RESERVATION_001,
                    'Reservation not found or already deleted'
                );
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_003,
                `Failed to update reservation: ${error.message}`
            );
        }
    }

    async confirmReservation(reservationId: string, redemptionLocation: string, updUserId: string): Promise<PerkReservationEntity> {
        try {
            const reservation = await this.findReservationById(reservationId);
            if (!reservation) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_RESERVATION_001,
                    'Reservation not found'
                );
            }

            // Use entity business logic
            reservation.confirmReservation(updUserId, redemptionLocation);

            return await this.updateReservation({
                reservationId,
                status: reservation.status,
                redemptionLocation: reservation.redemptionLocation,
                updUserId,
            });
        } catch (error) {
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_001,
                `Failed to confirm reservation: ${error.message}`
            );
        }
    }

    async cancelReservation(reservationId: string, updUserId: string): Promise<PerkReservationEntity> {
        try {
            const reservation = await this.findReservationById(reservationId);
            if (!reservation) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_RESERVATION_001,
                    'Reservation not found'
                );
            }

            // Use entity business logic
            reservation.cancelReservation(updUserId);

            const updateData: Prisma.perk_reservationUpdateInput = {
                status: reservation.status,
                qr_code_data: null,
                qr_generated_at: null,
                qr_expires_at: null,
                upd_user_id: updUserId,
                upd_date_time: new Date(),
            };

            const reservationData = await this.prisma.perk_reservation.update({
                where: {
                    reservation_id: reservationId,
                    del_flag: false,
                },
                data: updateData,
                include: this.getReservationInclude(),
            });

            return this.mapper.toDomain(reservationData);
        } catch (error) {
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_002,
                `Failed to cancel reservation: ${error.message}`
            );
        }
    }

    async generateQRCode(request: GenerateQRRequest): Promise<PerkReservationEntity> {
        try {
            const reservation = await this.findReservationById(request.reservationId);
            if (!reservation) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_RESERVATION_001,
                    'Reservation not found'
                );
            }

            // Use entity business logic
            reservation.generateQRCode(request.qrCodeData, request.expiryHours || 2, request.updUserId);

            const updateData: Prisma.perk_reservationUpdateInput = {
                qr_code_data: reservation.qrCodeData,
                qr_generated_at: reservation.qrGeneratedAt,
                qr_expires_at: reservation.qrExpiresAt,
                upd_user_id: request.updUserId,
                upd_date_time: new Date(),
                request_id: request.requestId,
            };

            const reservationData = await this.prisma.perk_reservation.update({
                where: {
                    reservation_id: request.reservationId,
                    del_flag: false,
                },
                data: updateData,
                include: this.getReservationInclude(),
            });

            return this.mapper.toDomain(reservationData);
        } catch (error) {
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_006,
                `Failed to generate QR code: ${error.message}`
            );
        }
    }

    async validateQRCode(qrCodeData: string): Promise<QRValidationResult> {
        try {
            const reservationData = await this.prisma.perk_reservation.findFirst({
                where: {
                    qr_code_data: qrCodeData,
                    del_flag: false,
                },
                include: this.getReservationInclude(),
            });

            if (!reservationData) {
                return {
                    isValid: false,
                    errorMessage: 'QR code not found',
                };
            }

            const reservation = this.mapper.toDomain(reservationData);

            if (!reservation.isQRValid()) {
                return {
                    isValid: false,
                    reservation,
                    errorMessage: 'QR code is expired or not valid',
                };
            }

            return {
                isValid: true,
                reservation,
            };
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_008,
                `Failed to validate QR code: ${error.message}`
            );
        }
    }

    async redeemPerk(request: RedeemPerkRequest): Promise<PerkReservationEntity> {
        try {
            const validation = await this.validateQRCode(request.qrCodeData);
            if (!validation.isValid || !validation.reservation) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_RESERVATION_008,
                    validation.errorMessage || 'Invalid QR code'
                );
            }

            const reservation = validation.reservation;

            // Use entity business logic
            reservation.redeemPerk(request.redeemedBy, request.updUserId);

            const updateData: Prisma.perk_reservationUpdateInput = {
                status: reservation.status,
                redeemed_at: reservation.redeemedAt,
                redeemed_by: reservation.redeemedBy,
                upd_user_id: request.updUserId,
                upd_date_time: new Date(),
                request_id: request.requestId,
            };

            const reservationData = await this.prisma.perk_reservation.update({
                where: {
                    reservation_id: reservation.reservationId!,
                    del_flag: false,
                },
                data: updateData,
                include: this.getReservationInclude(),
            });

            return this.mapper.toDomain(reservationData);
        } catch (error) {
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_009,
                `Failed to redeem perk: ${error.message}`
            );
        }
    }

    async deleteReservation(reservationId: string, updUserId: string): Promise<boolean> {
        try {
            await this.prisma.perk_reservation.update({
                where: {
                    reservation_id: reservationId,
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
                TouriiBackendAppErrorType.E_RESERVATION_001,
                `Failed to delete reservation: ${error.message}`
            );
        }
    }

    async getReservationStats(userId: string): Promise<ReservationStats> {
        try {
            const [statusStats, todayCount, weekCount, qrStats, partyStats, locationStats] = await Promise.all([
                this.prisma.perk_reservation.groupBy({
                    by: ['status'],
                    where: {
                        user_id: userId,
                        del_flag: false,
                    },
                    _count: { reservation_id: true },
                }),
                this.prisma.perk_reservation.count({
                    where: {
                        user_id: userId,
                        reservation_date: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0)),
                            lt: new Date(new Date().setHours(23, 59, 59, 999)),
                        },
                        del_flag: false,
                    },
                }),
                this.prisma.perk_reservation.count({
                    where: {
                        user_id: userId,
                        ins_date_time: {
                            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                        },
                        del_flag: false,
                    },
                }),
                this.prisma.perk_reservation.aggregate({
                    where: {
                        user_id: userId,
                        del_flag: false,
                    },
                    _count: {
                        qr_code_data: true,
                    },
                }),
                this.prisma.perk_reservation.aggregate({
                    where: {
                        user_id: userId,
                        del_flag: false,
                    },
                    _avg: { party_size: true },
                }),
                this.prisma.perk_reservation.groupBy({
                    by: ['redemption_location'],
                    where: {
                        user_id: userId,
                        redemption_location: { not: null },
                        del_flag: false,
                    },
                    _count: { reservation_id: true },
                    orderBy: { _count: { reservation_id: 'desc' } },
                    take: 5,
                }),
            ]);

            const qrExpiredCount = await this.prisma.perk_reservation.count({
                where: {
                    user_id: userId,
                    qr_expires_at: { lte: new Date() },
                    del_flag: false,
                },
            });

            return {
                totalReservations: statusStats.reduce((sum, s) => sum + s._count.reservation_id, 0),
                pendingReservations: statusStats.find(s => s.status === ReservationStatus.PENDING)?._count.reservation_id || 0,
                confirmedReservations: statusStats.find(s => s.status === ReservationStatus.CONFIRMED)?._count.reservation_id || 0,
                completedReservations: statusStats.find(s => s.status === ReservationStatus.COMPLETED)?._count.reservation_id || 0,
                cancelledReservations: statusStats.find(s => s.status === ReservationStatus.CANCELLED)?._count.reservation_id || 0,
                todayReservations: todayCount,
                thisWeekReservations: weekCount,
                qrCodesGenerated: qrStats._count.qr_code_data || 0,
                qrCodesExpired: qrExpiredCount,
                avgPartySize: partyStats._avg.party_size || 0,
                popularLocations: locationStats.map(l => ({
                    location: l.redemption_location!,
                    count: l._count.reservation_id,
                })),
            };
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_001,
                `Failed to get reservation stats: ${error.message}`
            );
        }
    }

    // Additional methods continued in next part due to length...
    
    private getReservationInclude(): Prisma.perk_reservationInclude {
        return {
            perk: {
                include: {
                    user: {
                        select: {
                            user_id: true,
                            username: true,
                            email: true,
                        },
                    },
                    perk_catalog: {
                        select: {
                            onchain_item_id: true,
                            nft_name: true,
                            nft_description: true,
                            image_url: true,
                        },
                    },
                },
            },
            user: {
                select: {
                    user_id: true,
                    username: true,
                    email: true,
                    image_url: true,
                },
            },
        };
    }

    // Implementing remaining methods...
    async searchReservations(filters: ReservationFilters, page = 1, limit = 20): Promise<UserReservationsResult> {
        try {
            const where: Prisma.perk_reservationWhereInput = {
                del_flag: false,
            };

            if (filters.userId) where.user_id = filters.userId;
            if (filters.perkId) where.perk_id = filters.perkId;
            if (filters.status) where.status = filters.status;
            if (filters.reservationDateFrom) where.reservation_date = { gte: filters.reservationDateFrom };
            if (filters.reservationDateTo) {
                where.reservation_date = where.reservation_date ? 
                    { ...where.reservation_date, lte: filters.reservationDateTo } : 
                    { lte: filters.reservationDateTo };
            }
            if (filters.redemptionLocation) where.redemption_location = filters.redemptionLocation;
            if (filters.hasQRCode !== undefined) {
                if (filters.hasQRCode) {
                    where.qr_code_data = { not: null };
                } else {
                    where.qr_code_data = null;
                }
            }
            if (filters.isQRExpired !== undefined) {
                if (filters.isQRExpired) {
                    where.qr_expires_at = { lte: new Date() };
                } else {
                    where.OR = [
                        { qr_expires_at: null },
                        { qr_expires_at: { gt: new Date() } },
                    ];
                }
            }

            const skip = (page - 1) * Math.min(limit, 100);
            const take = Math.min(limit, 100);

            const [totalCount, reservationsData] = await Promise.all([
                this.prisma.perk_reservation.count({ where }),
                this.prisma.perk_reservation.findMany({
                    where,
                    include: this.getReservationInclude(),
                    orderBy: { reservation_date: 'desc' },
                    skip,
                    take,
                }),
            ]);

            const reservations = reservationsData.map(reservation => this.mapper.toDomain(reservation));

            return {
                reservations,
                totalCount,
                pendingCount: 0,
                confirmedCount: 0,
                completedCount: 0,
                cancelledCount: 0,
                currentPage: page,
                pageSize: take,
                totalPages: Math.ceil(totalCount / take),
            };
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_001,
                `Failed to search reservations: ${error.message}`
            );
        }
    }

    async getReservationsByDateRange(startDate: Date, endDate: Date, status?: ReservationStatus): Promise<PerkReservationEntity[]> {
        try {
            const where: Prisma.perk_reservationWhereInput = {
                reservation_date: {
                    gte: startDate,
                    lte: endDate,
                },
                del_flag: false,
            };

            if (status) {
                where.status = status;
            }

            const reservationsData = await this.prisma.perk_reservation.findMany({
                where,
                include: this.getReservationInclude(),
                orderBy: { reservation_date: 'asc' },
            });

            return reservationsData.map(reservation => this.mapper.toDomain(reservation));
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_001,
                `Failed to get reservations by date range: ${error.message}`
            );
        }
    }

    async getReservationsForQRGeneration(): Promise<PerkReservationEntity[]> {
        try {
            const now = new Date();
            const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            const reservationsData = await this.prisma.perk_reservation.findMany({
                where: {
                    status: ReservationStatus.CONFIRMED,
                    qr_code_data: null,
                    reservation_date: {
                        gte: now,
                        lte: twentyFourHoursFromNow,
                    },
                    del_flag: false,
                },
                include: this.getReservationInclude(),
                orderBy: { reservation_date: 'asc' },
            });

            return reservationsData.map(reservation => this.mapper.toDomain(reservation));
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_006,
                `Failed to get reservations for QR generation: ${error.message}`
            );
        }
    }

    async getExpiredQRCodes(beforeDate?: Date): Promise<PerkReservationEntity[]> {
        try {
            const cutoffDate = beforeDate || new Date();

            const reservationsData = await this.prisma.perk_reservation.findMany({
                where: {
                    qr_expires_at: { lte: cutoffDate },
                    qr_code_data: { not: null },
                    del_flag: false,
                },
                include: this.getReservationInclude(),
                orderBy: { qr_expires_at: 'asc' },
            });

            return reservationsData.map(reservation => this.mapper.toDomain(reservation));
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_001,
                `Failed to get expired QR codes: ${error.message}`
            );
        }
    }

    async getLocationReservations(redemptionLocation: string, date?: Date): Promise<PerkReservationEntity[]> {
        try {
            const targetDate = date || new Date();
            const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

            const reservationsData = await this.prisma.perk_reservation.findMany({
                where: {
                    redemption_location: redemptionLocation,
                    reservation_date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                    status: {
                        in: [ReservationStatus.CONFIRMED, ReservationStatus.COMPLETED],
                    },
                    del_flag: false,
                },
                include: this.getReservationInclude(),
                orderBy: { reservation_date: 'asc' },
            });

            return reservationsData.map(reservation => this.mapper.toDomain(reservation));
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_001,
                `Failed to get location reservations: ${error.message}`
            );
        }
    }

    async getRedemptionHistory(startDate: Date, endDate: Date, redemptionLocation?: string): Promise<RedemptionRecord[]> {
        try {
            const where: Prisma.perk_reservationWhereInput = {
                status: ReservationStatus.COMPLETED,
                redeemed_at: {
                    gte: startDate,
                    lte: endDate,
                },
                del_flag: false,
            };

            if (redemptionLocation) {
                where.redemption_location = redemptionLocation;
            }

            const reservationsData = await this.prisma.perk_reservation.findMany({
                where,
                select: {
                    reservation_id: true,
                    user_id: true,
                    perk_id: true,
                    redemption_location: true,
                    redeemed_at: true,
                    redeemed_by: true,
                    party_size: true,
                },
                orderBy: { redeemed_at: 'desc' },
            });

            return reservationsData.map(r => ({
                reservationId: r.reservation_id,
                userId: r.user_id,
                perkId: r.perk_id,
                redemptionLocation: r.redemption_location!,
                redeemedAt: r.redeemed_at!,
                redeemedBy: r.redeemed_by!,
                partySize: r.party_size,
            }));
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_001,
                `Failed to get redemption history: ${error.message}`
            );
        }
    }

    async hasReservationConflict(userId: string, reservationDate: Date, excludeReservationId?: string): Promise<boolean> {
        try {
            const where: Prisma.perk_reservationWhereInput = {
                user_id: userId,
                reservation_date: reservationDate,
                status: {
                    in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
                },
                del_flag: false,
            };

            if (excludeReservationId) {
                where.reservation_id = { not: excludeReservationId };
            }

            const count = await this.prisma.perk_reservation.count({ where });
            return count > 0;
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_001,
                `Failed to check reservation conflict: ${error.message}`
            );
        }
    }

    async getUpcomingReservations(userId: string): Promise<PerkReservationEntity[]> {
        try {
            const now = new Date();
            const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

            const reservationsData = await this.prisma.perk_reservation.findMany({
                where: {
                    user_id: userId,
                    reservation_date: {
                        gte: now,
                        lte: sevenDaysFromNow,
                    },
                    status: {
                        in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
                    },
                    del_flag: false,
                },
                include: this.getReservationInclude(),
                orderBy: { reservation_date: 'asc' },
            });

            return reservationsData.map(reservation => this.mapper.toDomain(reservation));
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_001,
                `Failed to get upcoming reservations: ${error.message}`
            );
        }
    }

    async batchUpdateReservationStatus(reservationIds: string[], status: ReservationStatus, updUserId: string): Promise<number> {
        try {
            const result = await this.prisma.perk_reservation.updateMany({
                where: {
                    reservation_id: { in: reservationIds },
                    del_flag: false,
                },
                data: {
                    status,
                    upd_user_id: updUserId,
                    upd_date_time: new Date(),
                },
            });

            return result.count;
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_003,
                `Failed to batch update reservation status: ${error.message}`
            );
        }
    }

    async getSystemReservationStats(startDate: Date, endDate: Date): Promise<{
        totalReservations: number;
        completionRate: number;
        cancellationRate: number;
        avgLeadTime: number;
        popularTimeSlots: { hour: number; count: number }[];
        popularLocations: { location: string; count: number }[];
        qrGenerationStats: {
            generated: number;
            redeemed: number;
            expired: number;
        };
    }> {
        try {
            const [total, completed, cancelled, qrGenerated, qrRedeemed, qrExpired, timeSlots, locations, leadTimeData] = await Promise.all([
                this.prisma.perk_reservation.count({
                    where: {
                        ins_date_time: { gte: startDate, lte: endDate },
                        del_flag: false,
                    },
                }),
                this.prisma.perk_reservation.count({
                    where: {
                        status: ReservationStatus.COMPLETED,
                        ins_date_time: { gte: startDate, lte: endDate },
                        del_flag: false,
                    },
                }),
                this.prisma.perk_reservation.count({
                    where: {
                        status: ReservationStatus.CANCELLED,
                        ins_date_time: { gte: startDate, lte: endDate },
                        del_flag: false,
                    },
                }),
                this.prisma.perk_reservation.count({
                    where: {
                        qr_code_data: { not: null },
                        ins_date_time: { gte: startDate, lte: endDate },
                        del_flag: false,
                    },
                }),
                this.prisma.perk_reservation.count({
                    where: {
                        status: ReservationStatus.COMPLETED,
                        qr_code_data: { not: null },
                        ins_date_time: { gte: startDate, lte: endDate },
                        del_flag: false,
                    },
                }),
                this.prisma.perk_reservation.count({
                    where: {
                        qr_expires_at: { lte: new Date() },
                        ins_date_time: { gte: startDate, lte: endDate },
                        del_flag: false,
                    },
                }),
                this.prisma.$queryRaw`
                    SELECT EXTRACT(HOUR FROM reservation_date) as hour, COUNT(*) as count
                    FROM perk_reservation
                    WHERE ins_date_time >= ${startDate} 
                    AND ins_date_time <= ${endDate}
                    AND del_flag = false
                    GROUP BY EXTRACT(HOUR FROM reservation_date)
                    ORDER BY count DESC
                    LIMIT 10
                `,
                this.prisma.perk_reservation.groupBy({
                    by: ['redemption_location'],
                    where: {
                        ins_date_time: { gte: startDate, lte: endDate },
                        redemption_location: { not: null },
                        del_flag: false,
                    },
                    _count: { reservation_id: true },
                    orderBy: { _count: { reservation_id: 'desc' } },
                    take: 10,
                }),
                this.prisma.$queryRaw`
                    SELECT AVG(EXTRACT(EPOCH FROM (reservation_date - ins_date_time)) / 86400) as avg_lead_time_days
                    FROM perk_reservation
                    WHERE ins_date_time >= ${startDate} 
                    AND ins_date_time <= ${endDate}
                    AND del_flag = false
                ` as Promise<[{ avg_lead_time_days: number }]>,
            ]);

            const completionRate = total > 0 ? (completed / total) * 100 : 0;
            const cancellationRate = total > 0 ? (cancelled / total) * 100 : 0;
            const avgLeadTime = leadTimeData[0]?.avg_lead_time_days || 0;

            return {
                totalReservations: total,
                completionRate,
                cancellationRate,
                avgLeadTime,
                popularTimeSlots: (timeSlots as any[]).map(t => ({
                    hour: Number(t.hour),
                    count: Number(t.count),
                })),
                popularLocations: locations.map(l => ({
                    location: l.redemption_location!,
                    count: l._count.reservation_id,
                })),
                qrGenerationStats: {
                    generated: qrGenerated,
                    redeemed: qrRedeemed,
                    expired: qrExpired,
                },
            };
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_001,
                `Failed to get system reservation stats: ${error.message}`
            );
        }
    }
}
import type { UserTravelLog } from '@app/core/domain/user/user-travel-log';
import type {
    CreateUserTravelLogRequest,
    UserTravelLogFilter,
    UserTravelLogRepository,
    UserTravelLogWithPagination,
} from '@app/core/domain/user/user-travel-log.repository';
import { UserMapper } from '@app/core/infrastructure/mapper/user.mapper';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

@Injectable()
export class UserTravelLogRepositoryDb implements UserTravelLogRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getUserTravelLogsWithPagination(
        filter: UserTravelLogFilter,
        page: number,
        limit: number,
    ): Promise<UserTravelLogWithPagination> {
        const skip = (page - 1) * limit;

        // Build where clause based on filters
        const whereClause: Prisma.user_travel_logWhereInput = {
            user_id: filter.userId,
            del_flag: false,
        };

        if (filter.questId) {
            whereClause.quest_id = filter.questId;
        }

        if (filter.touristSpotId) {
            whereClause.tourist_spot_id = filter.touristSpotId;
        }

        // Handle check-in method filtering
        if (filter.checkInMethod) {
            whereClause.check_in_method = filter.checkInMethod;
        } else if (filter.checkInMethods && filter.checkInMethods.length > 0) {
            whereClause.check_in_method = {
                in: filter.checkInMethods,
            };
        }

        if (filter.startDate && filter.endDate) {
            whereClause.ins_date_time = {
                gte: filter.startDate,
                lte: filter.endDate,
            };
        } else if (filter.startDate) {
            whereClause.ins_date_time = {
                gte: filter.startDate,
            };
        } else if (filter.endDate) {
            whereClause.ins_date_time = {
                lte: filter.endDate,
            };
        }

        // Execute queries in parallel
        const [logs, total] = await Promise.all([
            this.prisma.user_travel_log.findMany({
                where: whereClause,
                orderBy: {
                    ins_date_time: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.user_travel_log.count({
                where: whereClause,
            }),
        ]);

        const userTravelLogs = logs.map((log) => UserMapper.prismaModelToUserTravelLogEntity(log));

        return {
            logs: userTravelLogs,
            total,
            page,
            limit,
        };
    }

    async getUserTravelLogById(logId: string): Promise<UserTravelLog | undefined> {
        const log = await this.prisma.user_travel_log.findUnique({
            where: {
                user_travel_log_id: logId,
                del_flag: false,
            },
        });

        if (!log) {
            return undefined;
        }

        return UserMapper.prismaModelToUserTravelLogEntity(log);
    }

    async createUserTravelLog(request: CreateUserTravelLogRequest): Promise<string> {
        const travelLog = await this.prisma.user_travel_log.create({
            data: {
                user_id: request.userId,
                quest_id: request.questId,
                task_id: request.taskId,
                tourist_spot_id: request.touristSpotId,
                user_longitude: request.userLongitude,
                user_latitude: request.userLatitude,
                travel_distance: request.travelDistance ?? 0.0,
                check_in_method: request.checkInMethod,
                qr_code_value: request.qrCodeValue,
                detected_fraud: request.detectedFraud ?? false,
                fraud_reason: request.fraudReason,
                ins_user_id: request.userId,
                upd_user_id: request.userId,
            },
        });

        return travelLog.user_travel_log_id;
    }
}

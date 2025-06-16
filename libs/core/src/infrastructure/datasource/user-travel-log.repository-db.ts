import type { UserTravelLogFilter, UserTravelLogRepository, UserTravelLogWithPagination } from '@app/core/domain/user/user-travel-log.repository';
import type { UserTravelLog } from '@app/core/domain/user/user-travel-log';
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
        limit: number
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
}
import { TransformDate } from '@app/core';
import type { UserTravelLog } from '@app/core/domain/user/user-travel-log';
import type { UserTravelLogWithPagination } from '@app/core/domain/user/user-travel-log.repository';
import type { UserTravelLogListResponseDto } from '../../controller/model/tourii-response/user/user-travel-log-list-response.model';
import type { UserTravelLogResponseDto } from '../../controller/model/tourii-response/user/user-travel-log-response.model';

export class UserTravelLogResultBuilder {
    /**
     * Convert paginated travel logs to list response DTO
     */
    static userTravelLogsToListDto(
        data: UserTravelLogWithPagination,
    ): UserTravelLogListResponseDto {
        const checkins = data.logs.map((log) => this.userTravelLogToDto(log));
        const totalPages = Math.ceil(data.total / data.limit);

        return {
            checkins,
            pagination: {
                currentPage: data.page,
                totalPages,
                totalItems: data.total,
            },
        };
    }

    /**
     * Convert single travel log entity to response DTO
     */
    static userTravelLogToDto(log: UserTravelLog): UserTravelLogResponseDto {
        return {
            userTravelLogId: log.userTravelLogId,
            userId: log.userId,
            questId: log.questId,
            taskId: log.taskId,
            touristSpotId: log.touristSpotId,
            userLongitude: log.userLongitude,
            userLatitude: log.userLatitude,
            travelDistanceFromTarget: log.travelDistanceFromTarget,
            travelDistance: log.travelDistance,
            qrCodeValue: log.qrCodeValue,
            checkInMethod: log.checkInMethod,
            detectedFraud: log.detectedFraud,
            fraudReason: log.fraudReason,
            delFlag: log.delFlag,
            insUserId: log.insUserId,
            insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(log.insDateTime),
            updUserId: log.updUserId,
            updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(log.updDateTime),
        };
    }
}

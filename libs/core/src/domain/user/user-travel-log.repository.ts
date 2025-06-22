import type { CheckInMethod } from '@prisma/client';
import type { UserTravelLog } from './user-travel-log';

export interface UserTravelLogFilter {
    userId: string;
    questId?: string;
    touristSpotId?: string;
    checkInMethod?: CheckInMethod;
    checkInMethods?: CheckInMethod[]; // For filtering by multiple methods
    startDate?: Date;
    endDate?: Date;
}

export interface UserTravelLogWithPagination {
    logs: UserTravelLog[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateUserTravelLogRequest {
    userId: string;
    questId: string;
    taskId: string;
    touristSpotId: string;
    userLongitude: number;
    userLatitude: number;
    travelDistance?: number;
    checkInMethod?: CheckInMethod;
    qrCodeValue?: string;
    detectedFraud?: boolean;
    fraudReason?: string;
}

export interface UserTravelLogRepository {
    /**
     * Get user travel logs with pagination and optional filters
     * @param filter Filter criteria for travel logs
     * @param page Page number (1-based)
     * @param limit Number of items per page
     * @returns Paginated travel logs
     */
    getUserTravelLogsWithPagination(
        filter: UserTravelLogFilter,
        page: number,
        limit: number,
    ): Promise<UserTravelLogWithPagination>;

    /**
     * Get user travel log by ID
     * @param logId Travel log ID
     * @returns Travel log or undefined if not found
     */
    getUserTravelLogById(logId: string): Promise<UserTravelLog | undefined>;

    /**
     * Create a new user travel log
     * @param request Travel log creation data
     * @returns Created travel log ID
     */
    createUserTravelLog(request: CreateUserTravelLogRequest): Promise<string>;
}

import type { MomentEntity } from '@app/core/domain/feed/moment.entity';
import type { MomentRepository } from '@app/core/domain/feed/moment.repository';
import { MomentType } from '@app/core/domain/feed/moment-type';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Injectable } from '@nestjs/common';
import type { moment_view } from '@prisma/client';
import { MomentMapper } from '../mapper/moment.mapper';

// Define constants for cache keys and TTL for maintainability
const MOMENTS_CACHE_KEY_PREFIX = 'moments';
// TTL (Time-To-Live) in seconds - 5 minutes for moments since they're time-sensitive
const CACHE_TTL_SECONDS = 300;

// Define plain object interface for caching (to avoid Prisma model serialization issues)
interface MomentViewPlain {
    id: string;
    user_id: string;
    username: string | null;
    image_url: string | null;
    description: string | null;
    reward_text: string | null;
    ins_date_time: Date;
    moment_type: string;
}

@Injectable()
export class MomentRepositoryDb implements MomentRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cachingService: CachingService,
    ) {}

    async getLatest(
        limit: number,
        offset: number,
        momentType?: MomentType,
    ): Promise<MomentEntity[]> {
        // Create a unique cache key based on pagination and filter parameters
        const cacheKey = `${MOMENTS_CACHE_KEY_PREFIX}:${limit}:${offset}:${momentType || 'all'}`;

        // Define the function to fetch data from the database
        const fetchDataFn = async (): Promise<{ data: MomentViewPlain[]; totalItems: number }> => {
            // Build where clause conditionally - only filter by moment_type if it's defined
            const whereClause = momentType ? { moment_type: momentType } : {};

            const [data, totalItems] = await Promise.all([
                this.prisma.moment_view.findMany({
                    take: limit,
                    skip: offset,
                    orderBy: { ins_date_time: 'desc' },
                    where: whereClause,
                }),
                this.prisma.moment_view.count({
                    where: whereClause,
                }),
            ]);

            // Convert Prisma models to plain objects for proper caching
            const plainData: MomentViewPlain[] = data.map((moment) => ({
                id: moment.id,
                user_id: moment.user_id,
                username: moment.username,
                image_url: moment.image_url,
                description: moment.description,
                reward_text: moment.reward_text,
                ins_date_time: moment.ins_date_time,
                moment_type: moment.moment_type,
            }));

            return { data: plainData, totalItems };
        };

        // Use the CachingService to get/set the raw data
        const cachedResult = await this.cachingService.getOrSet<{
            data: MomentViewPlain[];
            totalItems: number;
        } | null>(cacheKey, fetchDataFn, CACHE_TTL_SECONDS);

        // If fetching/caching failed, return empty array
        if (!cachedResult) {
            return [];
        }

        // Map the plain data (from cache or DB) to entities
        return cachedResult.data.map((moment) =>
            MomentMapper.prismaModelToMomentEntity(moment as moment_view, cachedResult.totalItems),
        );
    }
}

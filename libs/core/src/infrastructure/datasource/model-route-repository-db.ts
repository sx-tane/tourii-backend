import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { ModelRouteRepository } from '@app/core/domain/game/model-route/model-route.repository';
import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable, Logger } from '@nestjs/common';
import type { tourist_spot } from '@prisma/client';
import { ModelRouteRelationModel } from 'prisma/relation-model/model-route-relation-model';
import { ContextStorage } from '../../support/context/context-storage';
import { ModelRouteMapper } from '../mapper/model-route-mapper';

const _MODEL_ROUTE_RAW_CACHE_KEY_PREFIX = 'model_route_raw';
const _MODEL_ROUTES_ALL_LIST_CACHE_KEY = 'model_routes_all_list';
const DEFAULT_CACHE_TTL_SECONDS = 3600; // 1 hour

@Injectable()
export class ModelRouteRepositoryDb implements ModelRouteRepository {
    private readonly logger = new Logger(ModelRouteRepositoryDb.name);

    constructor(
        private prisma: PrismaService,
        private cachingService: CachingService,
    ) {}

    async createModelRoute(modelRoute: ModelRouteEntity): Promise<ModelRouteEntity> {
        const createdModelRouteData = await this.prisma.model_route.create({
            data: ModelRouteMapper.modelRouteEntityToPrismaInput(modelRoute),
            include: {
                owned_tourist_spots: true,
                route_tourist_spots: {
                    include: {
                        tourist_spot: true,
                    },
                },
            },
        });
        const createdModelRouteEntity =
            ModelRouteMapper.prismaModelToModelRouteEntity(createdModelRouteData);

        this.logger.debug(
            `Clearing cache for new model route: ${createdModelRouteEntity.modelRouteId}`,
        );
        // Clear all cache to ensure updates are reflected
        await this.cachingService.clearAll();

        return createdModelRouteEntity;
    }

    async createTouristSpot(touristSpot: TouristSpot, modelRouteId?: string): Promise<TouristSpot> {
        const createdTouristSpotData = await this.prisma.tourist_spot.create({
            data: ModelRouteMapper.touristSpotOnlyEntityToPrismaInput(touristSpot, modelRouteId),
        });
        const createdTouristSpotEntity = ModelRouteMapper.touristSpotToEntity([
            createdTouristSpotData,
        ])[0];

        if (modelRouteId) {
            this.logger.debug(
                `Clearing cache for model route ${modelRouteId} due to new tourist spot.`,
            );
        } else {
            this.logger.debug('Created standalone tourist spot without parent model route');
        }
        // Clear all cache to ensure updates are reflected
        await this.cachingService.clearAll();

        return createdTouristSpotEntity;
    }

    async updateModelRoute(modelRoute: ModelRouteEntity): Promise<ModelRouteEntity> {
        if (!modelRoute.modelRouteId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_027);
        }
        const updated = await this.prisma.model_route.update({
            where: { model_route_id: modelRoute.modelRouteId },
            data: ModelRouteMapper.modelRouteEntityToPrismaUpdateInput(modelRoute),
            include: {
                owned_tourist_spots: true,
                route_tourist_spots: {
                    include: {
                        tourist_spot: true,
                    },
                },
            },
        });

        // Clear all cache to ensure updates are reflected
        await this.cachingService.clearAll();

        return ModelRouteMapper.prismaModelToModelRouteEntity(updated);
    }

    async updateTouristSpot(touristSpot: TouristSpot): Promise<TouristSpot> {
        if (!touristSpot.touristSpotId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_027);
        }
        const updated = await this.prisma.tourist_spot.update({
            where: { tourist_spot_id: touristSpot.touristSpotId },
            data: ModelRouteMapper.touristSpotEntityToPrismaUpdateInput(touristSpot),
        });

        // Clear all cache to ensure updates are reflected
        await this.cachingService.clearAll();

        return ModelRouteMapper.touristSpotToEntity([updated])[0];
    }

    async getTouristSpotsByStoryChapterId(storyChapterId: string): Promise<TouristSpot[]> {
        const cacheKey = `tourist_spots_by_chapter:${storyChapterId}`;

        const fetchDataFn = async () => {
            const spots = await this.prisma.tourist_spot.findMany({
                where: { story_chapter_id: storyChapterId },
            });
            return spots;
        };

        const spotPrisma = await this.cachingService.getOrSet<tourist_spot[] | null>(
            cacheKey,
            fetchDataFn,
            DEFAULT_CACHE_TTL_SECONDS,
        );

        if (!spotPrisma || spotPrisma.length === 0) {
            return [];
        }

        return ModelRouteMapper.touristSpotToEntity(spotPrisma);
    }

    async getModelRouteByModelRouteId(modelRouteId: string): Promise<ModelRouteEntity> {
        const cacheKey = `${_MODEL_ROUTE_RAW_CACHE_KEY_PREFIX}:${modelRouteId}`;

        // fetchDataFn now fetches and returns the raw Prisma data or null
        const fetchDataFn = async () => {
            this.logger.debug(
                `getModelRouteByModelRouteId: Cache miss for ${cacheKey}, fetching raw data from DB.`,
            );
            const modelRoutePrisma = await this.prisma.model_route.findUnique({
                where: { model_route_id: modelRouteId },
                include: {
                    // Include spots owned directly by this route (legacy)
                    owned_tourist_spots: {
                        orderBy: {
                            ins_date_time: 'asc',
                        },
                    },
                    // Include spots referenced through junction table
                    route_tourist_spots: {
                        orderBy: {
                            display_order: 'asc',
                        },
                        include: {
                            tourist_spot: true,
                        },
                    },
                },
            });
            if (!modelRoutePrisma) {
                this.logger.debug(
                    `getModelRouteByModelRouteId: Raw route ${modelRouteId} not found in DB.`,
                );
                return null;
            }
            this.logger.debug(
                `getModelRouteByModelRouteId: Raw route ${modelRouteId} found in DB.`,
            );
            return modelRoutePrisma; // Return raw Prisma data
        };

        // Get raw Prisma data from cache or fetch via fetchDataFn
        const rawModelRoute = await this.cachingService.getOrSet<ModelRouteRelationModel | null>(
            cacheKey,
            fetchDataFn,
            DEFAULT_CACHE_TTL_SECONDS,
        );

        if (!rawModelRoute) {
            this.logger.warn(
                `getModelRouteByModelRouteId: Raw route ${modelRouteId} not found in cache or DB fetch.`,
            );
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_027);
        }

        // Map raw data to entity AFTER cache/DB retrieval
        this.logger.debug(
            `getModelRouteByModelRouteId: Mapping raw route ${modelRouteId} to entity.`,
        );
        return ModelRouteMapper.prismaModelToModelRouteEntity(rawModelRoute);
    }

    async getModelRoutes(): Promise<ModelRouteEntity[]> {
        const cacheKey = _MODEL_ROUTES_ALL_LIST_CACHE_KEY;

        // fetchDataFn now fetches and returns an array of raw Prisma data
        const fetchDataFn = async () => {
            this.logger.debug(
                `getModelRoutes: Cache miss for ${cacheKey}, fetching all raw routes from DB.`,
            );
            const modelRoutesPrisma = await this.prisma.model_route.findMany({
                include: {
                    // Include spots owned directly by this route (legacy)
                    owned_tourist_spots: {
                        orderBy: {
                            ins_date_time: 'asc',
                        },
                    },
                    // Include spots referenced through junction table
                    route_tourist_spots: {
                        orderBy: {
                            display_order: 'asc',
                        },
                        include: {
                            tourist_spot: true,
                        },
                    },
                },
                orderBy: {
                    ins_date_time: 'asc',
                },
            });
            this.logger.debug(
                `getModelRoutes: Found ${modelRoutesPrisma.length} raw routes in DB.`,
            );
            return modelRoutesPrisma; // Return array of raw Prisma data (type should be ModelRouteRelationModel[])
        };

        // Get array of raw Prisma data from cache or fetch via fetchDataFn
        const rawModelRoutes = await this.cachingService.getOrSet<ModelRouteRelationModel[] | null>(
            cacheKey,
            fetchDataFn,
            DEFAULT_CACHE_TTL_SECONDS,
        );

        if (rawModelRoutes === null) {
            this.logger.warn(
                `getModelRoutes: Fetching all raw model routes returned null from cache/DB fetch for key ${cacheKey}. Returning empty array.`,
            );
            return [];
        }

        // Map array of raw data to entities AFTER cache/DB retrieval
        this.logger.debug(
            `getModelRoutes: Mapping ${rawModelRoutes.length} raw routes to entities.`,
        );
        return rawModelRoutes.map((rawRoute) =>
            ModelRouteMapper.prismaModelToModelRouteEntity(rawRoute),
        );
    }

    async deleteModelRoute(modelRouteId: string): Promise<boolean> {
        await this.prisma.$transaction([
            this.prisma.tourist_spot.deleteMany({ where: { model_route_id: modelRouteId } }),
            this.prisma.model_route.delete({ where: { model_route_id: modelRouteId } }),
        ]);
        // Clear all cache to ensure consistency
        await this.cachingService.clearAll();
        return true;
    }

    async deleteTouristSpot(touristSpotId: string): Promise<boolean> {
        await this.prisma.tourist_spot.delete({
            where: { tourist_spot_id: touristSpotId },
        });
        // Clear all cache to ensure consistency
        await this.cachingService.clearAll();
        return true;
    }

    async getAllTouristSpots(): Promise<TouristSpot[]> {
        const cacheKey = 'all_tourist_spots';

        const rawTouristSpots = await this.cachingService.getOrSet<tourist_spot[]>(
            cacheKey,
            async () => {
                return await this.prisma.tourist_spot.findMany({
                    where: {
                        del_flag: false,
                    },
                    orderBy: {
                        ins_date_time: 'desc',
                    },
                });
            },
            DEFAULT_CACHE_TTL_SECONDS,
        );

        if (!rawTouristSpots) {
            this.logger.warn(
                'getAllTouristSpots: Failed to fetch tourist spots, returning empty array',
            );
            return [];
        }

        // Map to entities
        return rawTouristSpots.map((spot) => ModelRouteMapper.touristSpotToEntity([spot])[0]);
    }

    async findTouristSpotsByHashtags(
        hashtags: string[],
        mode: 'all' | 'any',
        region?: string,
    ): Promise<TouristSpot[]> {
        const normalizedHashtags = hashtags.map((h) => h.toLowerCase());
        const cacheKey = `tourist_spots_hashtags:${normalizedHashtags.sort().join(',')}:${mode}:${region || 'all'}`;

        const rawTouristSpots = await this.cachingService.getOrSet<tourist_spot[]>(
            cacheKey,
            async () => {
                // Use raw SQL for case-insensitive hashtag matching
                let hashtagConditionSql: string;
                const hashtagParams: string[] = [];

                if (mode === 'all') {
                    // All hashtags must be present (case-insensitive)
                    const conditions = normalizedHashtags.map((tag) => {
                        hashtagParams.push(tag);
                        return `EXISTS (
                            SELECT 1 FROM unnest(tourist_spot_hashtag) AS tag 
                            WHERE LOWER(tag) = $${hashtagParams.length}
                        )`;
                    });
                    hashtagConditionSql = conditions.join(' AND ');
                } else {
                    // Any hashtag can match (case-insensitive)
                    hashtagParams.push(...normalizedHashtags);
                    const placeholders = normalizedHashtags
                        .map((_, index) => `$${index + 1}`)
                        .join(', ');
                    hashtagConditionSql = `EXISTS (
                        SELECT 1 FROM unnest(tourist_spot_hashtag) AS tag 
                        WHERE LOWER(tag) = ANY(ARRAY[${placeholders}])
                    )`;
                }

                // Build base SQL query
                let sql = `
                    SELECT ts.* FROM tourist_spot ts
                    WHERE ts.del_flag = false
                    AND (${hashtagConditionSql})
                `;
                let paramCount = hashtagParams.length;

                // Add region filter if provided
                if (region) {
                    sql += ` AND EXISTS (
                        SELECT 1 FROM model_route mr 
                        WHERE mr.model_route_id = ts.model_route_id 
                        AND LOWER(mr.region) = $${++paramCount}
                    )`;
                    hashtagParams.push(region.toLowerCase());
                }

                sql += ` ORDER BY ts.ins_date_time DESC`;

                // Execute raw SQL query
                const rawSpots = await this.prisma.$queryRawUnsafe<tourist_spot[]>(
                    sql,
                    ...hashtagParams,
                );

                return rawSpots;
            },
            DEFAULT_CACHE_TTL_SECONDS,
        );

        if (!rawTouristSpots) {
            this.logger.warn(
                'findTouristSpotsByHashtags: Failed to fetch tourist spots, returning empty array',
            );
            return [];
        }

        // Map to entities
        return rawTouristSpots.map((spot) => ModelRouteMapper.touristSpotToEntity([spot])[0]);
    }

    async createRouteTouristSpotJunctions(
        junctionRecords: Array<{
            modelRouteId: string;
            touristSpotId: string;
            displayOrder: number;
            isPrimary: boolean;
            createdBy: string;
        }>,
    ): Promise<void> {
        try {
            // Use createMany for batch insert
            await this.prisma.route_tourist_spot.createMany({
                data: junctionRecords.map((record) => ({
                    model_route_id: record.modelRouteId,
                    tourist_spot_id: record.touristSpotId,
                    display_order: record.displayOrder,
                    is_primary: record.isPrimary,
                    created_by: record.createdBy,
                })),
                skipDuplicates: true, // Skip if junction already exists
            });

            this.logger.debug(`Created ${junctionRecords.length} route-tourist spot junctions`, {
                routeId: junctionRecords[0]?.modelRouteId,
            });
        } catch (error) {
            this.logger.error('Failed to create route-tourist spot junctions', {
                error: error instanceof Error ? error.message : String(error),
                recordCount: junctionRecords.length,
            });
            throw error;
        }
    }

    async createTouristRoute(
        routeName: string,
        regionDesc: string,
        recommendations: string[],
        touristSpotIds: string[],
        userId: string,
    ): Promise<ModelRouteEntity> {
        try {
            // First, get tourist spots to determine region
            const touristSpots = await this.prisma.tourist_spot.findMany({
                where: {
                    tourist_spot_id: { in: touristSpotIds },
                    del_flag: false,
                },
            });

            if (touristSpots.length === 0) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_027);
            }

            // Determine region from first hashtag of first tourist spot
            const region = this.determineRegionFromHashtags(touristSpots);

            // Calculate center coordinates
            const centerLat =
                touristSpots.reduce((sum, spot) => sum + spot.latitude, 0) / touristSpots.length;
            const centerLng =
                touristSpots.reduce((sum, spot) => sum + spot.longitude, 0) / touristSpots.length;

            const now = ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date();

            // Create tourist route entity
            const routeEntity = new ModelRouteEntity(
                {
                    routeName,
                    regionDesc,
                    recommendation: recommendations,
                    region,
                    regionLatitude: centerLat,
                    regionLongitude: centerLng,
                    regionBackgroundMedia: undefined, // Will be set later if needed
                    isAiGenerated: false, // Tourist-created route
                    storyId: undefined, // Standalone route
                    insUserId: userId,
                    insDateTime: now,
                    updUserId: userId,
                    updDateTime: now,
                    touristSpotList: [], // Empty - will use junction table
                },
                undefined,
            );

            // Create the route record
            const createdRoute = await this.createModelRoute(routeEntity);

            // Create junction table records
            const junctionRecords = touristSpotIds.map((spotId, index) => ({
                modelRouteId: createdRoute.modelRouteId!,
                touristSpotId: spotId,
                displayOrder: index + 1,
                isPrimary: index === 0, // First spot is primary
                createdBy: userId,
            }));

            await this.createRouteTouristSpotJunctions(junctionRecords);

            this.logger.debug(`Created tourist route: ${routeName}`, {
                routeId: createdRoute.modelRouteId,
                userId,
                spotCount: touristSpotIds.length,
            });

            return createdRoute;
        } catch (error) {
            this.logger.error('Failed to create tourist route', {
                error: error instanceof Error ? error.message : String(error),
                routeName,
                userId,
                spotCount: touristSpotIds.length,
            });
            throw error;
        }
    }

    async getUnifiedRoutes(filters?: {
        source?: 'ai' | 'manual' | 'all';
        region?: string;
        userId?: string;
        limit?: number;
        offset?: number;
    }): Promise<ModelRouteEntity[]> {
        const cacheKey = `unified_routes:${JSON.stringify(filters || {})}`;

        const fetchDataFn = async () => {
            this.logger.debug('getUnifiedRoutes: Cache miss, fetching from DB', { filters });

            // Build dynamic where clause
            const whereClause: any = {
                del_flag: false,
            };

            // Filter by source (AI vs manual)
            if (filters?.source && filters.source !== 'all') {
                whereClause.is_ai_generated = filters.source === 'ai';
            }

            // Filter by region
            if (filters?.region) {
                whereClause.region = {
                    contains: filters.region,
                    mode: 'insensitive',
                };
            }

            // Filter by user
            if (filters?.userId) {
                whereClause.ins_user_id = filters.userId;
            }

            const modelRoutesPrisma = await this.prisma.model_route.findMany({
                where: whereClause,
                include: {
                    // Include spots owned directly by this route (legacy)
                    owned_tourist_spots: {
                        orderBy: {
                            ins_date_time: 'asc',
                        },
                    },
                    // Include spots referenced through junction table
                    route_tourist_spots: {
                        orderBy: {
                            display_order: 'asc',
                        },
                        include: {
                            tourist_spot: true,
                        },
                    },
                },
                orderBy: {
                    ins_date_time: 'desc', // Most recent first
                },
                take: filters?.limit,
                skip: filters?.offset,
            });

            this.logger.debug(`getUnifiedRoutes: Found ${modelRoutesPrisma.length} routes`, {
                filters,
            });
            return modelRoutesPrisma;
        };

        const rawModelRoutes = await this.cachingService.getOrSet<ModelRouteRelationModel[] | null>(
            cacheKey,
            fetchDataFn,
            DEFAULT_CACHE_TTL_SECONDS,
        );

        if (!rawModelRoutes) {
            this.logger.warn('getUnifiedRoutes: No routes found', { filters });
            return [];
        }

        // Map to entities
        return rawModelRoutes.map((rawRoute) =>
            ModelRouteMapper.prismaModelToModelRouteEntity(rawRoute),
        );
    }

    /**
     * Determines region from tourist spot hashtags (uses first hashtag as region)
     */
    private determineRegionFromHashtags(touristSpots: any[]): string {
        for (const spot of touristSpots) {
            if (
                spot.tourist_spot_hashtag &&
                Array.isArray(spot.tourist_spot_hashtag) &&
                spot.tourist_spot_hashtag.length > 0
            ) {
                // Use first hashtag as region name
                const firstHashtag = spot.tourist_spot_hashtag[0];
                if (typeof firstHashtag === 'string' && firstHashtag.length > 0) {
                    return firstHashtag;
                }
            }
        }

        // Fallback to 'Unknown' if no hashtags found
        return 'Unknown';
    }
}

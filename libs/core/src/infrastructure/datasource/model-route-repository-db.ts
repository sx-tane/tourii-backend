import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { ModelRouteRepository } from '@app/core/domain/game/model-route/model-route.repository';
import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable, Logger } from '@nestjs/common';
import { ModelRouteRelationModel } from 'prisma/relation-model/model-route-relation-model';
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
                tourist_spot: true,
            },
        });
        const createdModelRouteEntity =
            ModelRouteMapper.prismaModelToModelRouteEntity(createdModelRouteData);

        this.logger.debug(
            `Invalidating cache for new model route: ${createdModelRouteEntity.modelRouteId}`,
        );
        if (createdModelRouteEntity.modelRouteId) {
            await this.cachingService.invalidate(
                `${_MODEL_ROUTE_RAW_CACHE_KEY_PREFIX}:${createdModelRouteEntity.modelRouteId}`,
            );
        }
        await this.cachingService.invalidate(_MODEL_ROUTES_ALL_LIST_CACHE_KEY);

        return createdModelRouteEntity;
    }

    async createTouristSpot(touristSpot: TouristSpot, modelRouteId: string): Promise<TouristSpot> {
        const createdTouristSpotData = await this.prisma.tourist_spot.create({
            data: ModelRouteMapper.touristSpotOnlyEntityToPrismaInput(touristSpot, modelRouteId),
        });
        const createdTouristSpotEntity = ModelRouteMapper.touristSpotToEntity([
            createdTouristSpotData,
        ])[0];

        this.logger.debug(
            `Invalidating cache for model route ${modelRouteId} due to new tourist spot.`,
        );
        await this.cachingService.invalidate(
            `${_MODEL_ROUTE_RAW_CACHE_KEY_PREFIX}:${modelRouteId}`,
        );
        await this.cachingService.invalidate(_MODEL_ROUTES_ALL_LIST_CACHE_KEY);

        return createdTouristSpotEntity;
    }

    async updateModelRoute(modelRoute: ModelRouteEntity): Promise<ModelRouteEntity> {
        if (!modelRoute.modelRouteId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_027);
        }
        const updated = await this.prisma.model_route.update({
            where: { model_route_id: modelRoute.modelRouteId },
            data: ModelRouteMapper.modelRouteEntityToPrismaUpdateInput(modelRoute),
            include: { tourist_spot: true },
        });

        await this.cachingService.invalidate(`${_MODEL_ROUTE_RAW_CACHE_KEY_PREFIX}:${modelRoute.modelRouteId}`);
        await this.cachingService.invalidate(_MODEL_ROUTES_ALL_LIST_CACHE_KEY);

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

        await this.cachingService.invalidate(`${_MODEL_ROUTE_RAW_CACHE_KEY_PREFIX}:${updated.model_route_id}`);
        await this.cachingService.invalidate(_MODEL_ROUTES_ALL_LIST_CACHE_KEY);

        return ModelRouteMapper.touristSpotToEntity([updated])[0];
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
                    tourist_spot: true,
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
                    tourist_spot: true,
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
        await this.cachingService.invalidate(`${_MODEL_ROUTE_RAW_CACHE_KEY_PREFIX}:${modelRouteId}`);
        await this.cachingService.invalidate(_MODEL_ROUTES_ALL_LIST_CACHE_KEY);
        return true;
    }

    async deleteTouristSpot(touristSpotId: string): Promise<boolean> {
        const spot = await this.prisma.tourist_spot.delete({
            where: { tourist_spot_id: touristSpotId },
            select: { model_route_id: true },
        });
        await this.cachingService.invalidate(`${_MODEL_ROUTE_RAW_CACHE_KEY_PREFIX}:${spot.model_route_id}`);
        await this.cachingService.invalidate(_MODEL_ROUTES_ALL_LIST_CACHE_KEY);
        return true;
    }
}

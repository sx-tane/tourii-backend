import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { ModelRouteRepository } from '@app/core/domain/game/model-route/model-route.repository';
import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable, Logger } from '@nestjs/common';
import { ModelRouteMapper } from '../mapper/model-route-mapper';

const _MODEL_ROUTE_RAW_CACHE_KEY_PREFIX = 'model_route_raw';

@Injectable()
export class ModelRouteRepositoryDb implements ModelRouteRepository {
    private readonly logger = new Logger(ModelRouteRepositoryDb.name);

    constructor(
        private prisma: PrismaService,
        private _cachingService: CachingService,
    ) {}

    async createModelRoute(modelRoute: ModelRouteEntity): Promise<ModelRouteEntity> {
        const createdModelRoute = await this.prisma.model_route.create({
            data: ModelRouteMapper.modelRouteEntityToPrismaInput(modelRoute),
            include: {
                tourist_spot: true,
            },
        });
        return ModelRouteMapper.prismaModelToModelRouteEntity(createdModelRoute);
    }

    async createTouristSpot(touristSpot: TouristSpot, modelRouteId: string): Promise<TouristSpot> {
        const createdTouristSpot = await this.prisma.tourist_spot.create({
            data: ModelRouteMapper.touristSpotOnlyEntityToPrismaInput(touristSpot, modelRouteId),
        });

        return ModelRouteMapper.touristSpotToEntity([createdTouristSpot])[0];
    }

    async getModelRouteByModelRouteId(modelRouteId: string): Promise<ModelRouteEntity> {
        const modelRoute = await this.prisma.model_route.findUnique({
            where: { model_route_id: modelRouteId },
            include: {
                tourist_spot: true,
            },
        });
        if (!modelRoute) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_027, // Model route not found
            );
        }
        return ModelRouteMapper.prismaModelToModelRouteEntity(modelRoute);
    }
}

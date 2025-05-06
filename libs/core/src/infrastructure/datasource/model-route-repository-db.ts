import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { ModelRouteRepository } from '@app/core/domain/game/model-route/model-route.repository';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Injectable } from '@nestjs/common';

const _MODEL_ROUTE_RAW_CACHE_KEY_PREFIX = 'model_route_raw';

@Injectable()
export class ModelRouteRepositoryDb implements ModelRouteRepository {
    constructor(
        private prisma: PrismaService,
        private cachingService: CachingService,
    ) {}

    async createModelRoute(
        modelRoute: ModelRouteEntity,
    ): Promise<ModelRouteEntity> {
        const createdModelRoute = await this.prisma.model_route.create({
            data: modelRoute,
        });
        return ModelRouteMapper.prismaModelToModelRouteEntity(
            createdModelRoute,
        );
    }
}

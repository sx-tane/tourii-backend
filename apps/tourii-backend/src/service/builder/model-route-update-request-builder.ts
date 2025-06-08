import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { ContextStorage } from '@app/core/support/context/context-storage';
import type { ModelRouteUpdateRequestDto } from '@app/tourii-backend/controller/model/tourii-request/update/model-route-update-request.model';

export class ModelRouteUpdateRequestBuilder {
    static dtoToModelRoute(dto: ModelRouteUpdateRequestDto): ModelRouteEntity {
        return new ModelRouteEntity(
            {
                storyId: dto.storyId,
                routeName: dto.routeName,
                region: dto.region,
                regionDesc: dto.regionDesc,
                regionLatitude: dto.regionLatitude,
                regionLongitude: dto.regionLongitude,
                regionBackgroundMedia: dto.regionBackgroundMedia,
                recommendation: dto.recommendation,
                delFlag: dto.delFlag,
                updUserId: dto.updUserId,
                updDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
            },
            dto.modelRouteId,
        );
    }
}

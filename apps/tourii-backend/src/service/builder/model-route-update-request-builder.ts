import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { GeoInfo } from '@app/core/domain/geo/geo-info';
import { ContextStorage } from '@app/core/support/context/context-storage';
import type { ModelRouteUpdateRequestDto } from '@app/tourii-backend/controller/model/tourii-request/update/model-route-update-request.model';

export class ModelRouteUpdateRequestBuilder {
    static dtoToModelRoute(
        dto: ModelRouteUpdateRequestDto,
        regionGeoInfo?: GeoInfo,
    ): ModelRouteEntity {
        return new ModelRouteEntity(
            {
                storyId: dto.storyId,
                routeName: dto.routeName,
                region: dto.region,
                regionDesc: dto.regionDesc,
                regionLatitude: regionGeoInfo?.latitude,
                regionLongitude: regionGeoInfo?.longitude,
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

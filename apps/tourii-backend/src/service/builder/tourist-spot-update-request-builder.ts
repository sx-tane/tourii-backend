import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { GeoInfo } from '@app/core/domain/geo/geo-info';
import { ContextStorage } from '@app/core/support/context/context-storage';
import type { TouristSpotUpdateRequestDto } from '@app/tourii-backend/controller/model/tourii-request/update/tourist-spot-update-request.model';

export class TouristSpotUpdateRequestBuilder {
    static dtoToTouristSpot(
        dto: TouristSpotUpdateRequestDto,
        geoInfo?: GeoInfo,
    ): TouristSpot {
        return new TouristSpot({
            storyChapterId: dto.storyChapterId,
            touristSpotId: dto.touristSpotId,
            touristSpotName: dto.touristSpotName,
            touristSpotDesc: dto.touristSpotDesc,
            latitude: geoInfo?.latitude,
            longitude: geoInfo?.longitude,
            address: geoInfo?.formattedAddress,
            bestVisitTime: dto.bestVisitTime,
            touristSpotHashtag: dto.touristSpotHashtag,
            imageSet: dto.imageSet ?? undefined,
            delFlag: dto.delFlag,
            updUserId: dto.updUserId,
            updDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
        });
    }
}

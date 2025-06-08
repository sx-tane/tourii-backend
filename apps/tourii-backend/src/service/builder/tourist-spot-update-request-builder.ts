import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { ContextStorage } from '@app/core/support/context/context-storage';
import type { TouristSpotUpdateRequestDto } from '@app/tourii-backend/controller/model/tourii-request/update/tourist-spot-update-request.model';

export class TouristSpotUpdateRequestBuilder {
    static dtoToTouristSpot(dto: TouristSpotUpdateRequestDto): TouristSpot {
        return new TouristSpot({
            storyChapterId: dto.storyChapterId,
            touristSpotId: dto.touristSpotId,
            touristSpotName: dto.touristSpotName,
            touristSpotDesc: dto.touristSpotDesc,
            latitude: dto.latitude,
            longitude: dto.longitude,
            bestVisitTime: dto.bestVisitTime,
            address: dto.address,
            storyChapterLink: dto.storyChapterLink,
            touristSpotHashtag: dto.touristSpotHashtag,
            imageSet: dto.imageSet ?? undefined,
            delFlag: dto.delFlag,
            updUserId: dto.updUserId,
            updDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
        });
    }
}

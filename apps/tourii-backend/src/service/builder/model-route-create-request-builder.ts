import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { StoryEntity } from '@app/core/domain/game/story/story.entity';
import { GeoInfo } from '@app/core/domain/geo/geo-info';
import { ContextStorage } from '@app/core/support/context/context-storage';
import type { ModelRouteCreateRequestDto } from '@app/tourii-backend/controller/model/tourii-request/create/model-route-create-request.model';
import { Logger } from '@nestjs/common';

export class ModelRouteCreateRequestBuilder {
    static dtoToModelRoute(
        dto: ModelRouteCreateRequestDto,
        storyEntity: StoryEntity,
        geoInfoList: GeoInfo[],
        regionInfo: GeoInfo,
        insUserId: string,
    ): ModelRouteEntity {
        const geoInfoMap = new Map<string, GeoInfo>();
        geoInfoList.forEach((info) => {
            if (info.touristSpotName) {
                geoInfoMap.set(info.touristSpotName, info);
            }
        });

        const enrichedTouristSpotList = dto.touristSpotList.map((spotDto) => {
            const matchingGeoInfo = geoInfoMap.get(spotDto.touristSpotName);

            const storyChapterLink = `/v2/touriiverse/${storyEntity.id}/chapters/${spotDto.storyChapterId}`;

            if (!matchingGeoInfo) {
                Logger.warn(
                    `Could not find matching GeoInfo for tourist spot: ${spotDto.touristSpotName}`,
                );
                return new TouristSpot({
                    storyChapterId: spotDto.storyChapterId,
                    touristSpotName: spotDto.touristSpotName,
                    touristSpotDesc: spotDto.touristSpotDesc,
                    bestVisitTime: spotDto.bestVisitTime,
                    touristSpotHashtag: spotDto.touristSpotHashtag,
                    imageSet: spotDto.imageSet
                        ? [spotDto.imageSet.main, ...spotDto.imageSet.small]
                        : undefined,
                    storyChapterLink: storyChapterLink,
                    updUserId: insUserId,
                    updDateTime:
                        ContextStorage.getStore()?.getSystemDateTimeJST() ??
                        new Date(),
                });
            }

            return new TouristSpot({
                storyChapterId: spotDto.storyChapterId,
                touristSpotName: spotDto.touristSpotName,
                touristSpotDesc: spotDto.touristSpotDesc,
                latitude: matchingGeoInfo.latitude,
                longitude: matchingGeoInfo.longitude,
                address: matchingGeoInfo.formattedAddress,
                storyChapterLink: storyChapterLink,
                bestVisitTime: spotDto.bestVisitTime,
                touristSpotHashtag: spotDto.touristSpotHashtag,
                imageSet: spotDto.imageSet
                    ? [spotDto.imageSet.main, ...spotDto.imageSet.small]
                    : undefined,
                delFlag: false,
                insUserId: insUserId,
                insDateTime:
                    ContextStorage.getStore()?.getSystemDateTimeJST() ??
                    new Date(),
                updUserId: insUserId,
                updDateTime:
                    ContextStorage.getStore()?.getSystemDateTimeJST() ??
                    new Date(),
                requestId: ContextStorage.getStore()?.getRequestId()?.value,
            });
        });

        return new ModelRouteEntity(
            {
                storyId: storyEntity.id,
                routeName: dto.routeName,
                region: storyEntity.sagaName,
                regionLatitude: regionInfo.latitude,
                regionLongitude: regionInfo.longitude,
                regionBackgroundMedia: storyEntity.backgroundMedia,
                recommendation: dto.recommendation,
                touristSpotList: enrichedTouristSpotList,
                delFlag: false,
                insUserId: insUserId,
                insDateTime:
                    ContextStorage.getStore()?.getSystemDateTimeJST() ??
                    new Date(),
                updUserId: insUserId,
                updDateTime:
                    ContextStorage.getStore()?.getSystemDateTimeJST() ??
                    new Date(),
                requestId: ContextStorage.getStore()?.getRequestId()?.value,
            },
            undefined,
        );
    }
}

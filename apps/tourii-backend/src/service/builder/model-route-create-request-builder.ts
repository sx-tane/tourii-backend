import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { StoryEntity } from '@app/core/domain/game/story/story.entity';
import { GeoInfo } from '@app/core/domain/geo/geo-info';
import { ContextStorage } from '@app/core/support/context/context-storage';
import type { ModelRouteCreateRequestDto } from '@app/tourii-backend/controller/model/tourii-request/create/model-route-create-request.model';
import { TouristSpotCreateRequestDto } from '@app/tourii-backend/controller/model/tourii-request/create/tourist-spot-create-request.model';
import { Logger } from '@nestjs/common';

export class ModelRouteCreateRequestBuilder {
    static dtoToTouristSpot(
        dto: TouristSpotCreateRequestDto[],
        geoInfoList: GeoInfo[],
        storyEntity: StoryEntity | null,
        insUserId: string,
    ): TouristSpot[] {
        const geoInfoMap = new Map<string, GeoInfo>();
        geoInfoList.forEach((info) => {
            if (info.touristSpotName) {
                geoInfoMap.set(info.touristSpotName, info);
            }
        });

        return dto.map((spotDto) => {
            const matchingGeoInfo = geoInfoMap.get(spotDto.touristSpotName);

            const storyChapterLink = storyEntity && spotDto.storyChapterId
                ? `/v2/touriiverse/${storyEntity.id}/chapters/${spotDto.storyChapterId}` 
                : null;

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
                    imageSet: spotDto.imageSet ?? undefined,
                    storyChapterLink: storyChapterLink,
                    updUserId: insUserId,
                    updDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
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
                imageSet: spotDto.imageSet ?? undefined,
                delFlag: false,
                insUserId: insUserId,
                insDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
                updUserId: insUserId,
                updDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
                requestId: ContextStorage.getStore()?.getRequestId()?.value,
            });
        });
    }

    static dtoToModelRoute(
        dto: ModelRouteCreateRequestDto,
        storyEntity: StoryEntity | null,
        touristSpotGeoInfoList: GeoInfo[],
        regionInfo: GeoInfo,
        insUserId: string,
    ): ModelRouteEntity {
        return new ModelRouteEntity(
            {
                storyId: storyEntity?.id || null,
                routeName: dto.routeName,
                region: dto.region,
                regionDesc: dto.regionDesc,
                regionLatitude: regionInfo.latitude,
                regionLongitude: regionInfo.longitude,
                regionBackgroundMedia: dto.regionBackgroundMedia,
                recommendation: dto.recommendation,
                touristSpotList: dto.touristSpotList
                    ? ModelRouteCreateRequestBuilder.dtoToTouristSpot(
                          dto.touristSpotList,
                          touristSpotGeoInfoList,
                          storyEntity,
                          insUserId,
                      )
                    : [],
                delFlag: false,
                insUserId: insUserId,
                insDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
                updUserId: insUserId,
                updDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
                requestId: ContextStorage.getStore()?.getRequestId()?.value,
            },
            undefined,
        );
    }
}

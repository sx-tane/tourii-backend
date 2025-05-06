import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { WeatherInfo } from '@app/core/domain/geo/weather-info';
import { TransformDate } from '@app/core/support/transformer/date-transformer';
import { ModelRouteResponseDto } from '@app/tourii-backend/controller/model/tourii-response/model-route-response.model';
import { TouristSpotResponseDto } from '@app/tourii-backend/controller/model/tourii-response/tourist-spot-response.model';

export class ModelRouteResultBuilder {
    static touristSpotToDto(
        touristSpot: TouristSpot,
        currentTouristSpotWeatherList: WeatherInfo[],
    ): TouristSpotResponseDto {
        const weatherInfo = currentTouristSpotWeatherList.find(
            (weather) => weather.touristSpotName === touristSpot.touristSpotName,
        );
        return {
            touristSpotId: touristSpot.touristSpotId ?? '',
            storyChapterId: touristSpot.storyChapterId ?? '',
            touristSpotName: touristSpot.touristSpotName ?? '',
            touristSpotDesc: touristSpot.touristSpotDesc ?? '',
            touristSpotLatitude: touristSpot.latitude ?? 0,
            touristSpotLongitude: touristSpot.longitude ?? 0,
            bestVisitTime: touristSpot.bestVisitTime ?? '',
            address: touristSpot.address ?? '',
            storyChapterLink: touristSpot.storyChapterLink ?? '',
            touristSpotHashtag: touristSpot.touristSpotHashtag ?? [],
            imageSet: touristSpot.imageSet ?? { main: '', small: [] },
            weatherInfo: {
                temperatureCelsius: weatherInfo?.temperatureCelsius ?? 0,
                weatherName: weatherInfo?.weatherName ?? '',
                weatherDesc: weatherInfo?.weatherDesc ?? '',
            },
            delFlag: touristSpot.delFlag ?? false,
            insUserId: touristSpot.insUserId ?? '',
            insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(touristSpot.insDateTime) ?? '',
            updUserId: touristSpot.updUserId,
            updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(touristSpot.updDateTime) ?? '',
        };
    }

    static modelRouteToDto(
        modelRoute: ModelRouteEntity,
        currentTouristSpotWeatherList: WeatherInfo[],
        currentRegionWeatherInfo: WeatherInfo,
    ): ModelRouteResponseDto {
        return {
            modelRouteId: modelRoute.modelRouteId ?? '',
            storyId: modelRoute.storyId ?? '',
            routeName: modelRoute.routeName ?? '',
            region: modelRoute.region ?? '',
            regionLatitude: modelRoute.regionLatitude ?? 0,
            regionLongitude: modelRoute.regionLongitude ?? 0,
            regionBackgroundMedia: modelRoute.regionBackgroundMedia ?? '',
            recommendation: modelRoute.recommendation ?? [],
            touristSpotList:
                modelRoute.touristSpotList?.map((touristSpot) =>
                    ModelRouteResultBuilder.touristSpotToDto(
                        touristSpot,
                        currentTouristSpotWeatherList,
                    ),
                ) ?? [],
            regionWeatherInfo: {
                ...currentRegionWeatherInfo,
            },
            delFlag: modelRoute.delFlag ?? false,
            insUserId: modelRoute.insUserId ?? '',
            insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(modelRoute.insDateTime) ?? '',
            updUserId: modelRoute.updUserId,
            updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(modelRoute.updDateTime) ?? '',
        };
    }
}

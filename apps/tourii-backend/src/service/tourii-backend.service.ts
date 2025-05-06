import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { ModelRouteRepository } from '@app/core/domain/game/model-route/model-route.repository';
import { StoryChapter } from '@app/core/domain/game/story/chapter-story';
import { StoryEntity } from '@app/core/domain/game/story/story.entity';
import type { StoryRepository } from '@app/core/domain/game/story/story.repository';
import { GeoInfo, isGeoInfoListUndefined } from '@app/core/domain/geo/geo-info';
import { GeoInfoRepository } from '@app/core/domain/geo/geo-info.repository';
import { WeatherInfo, isWeatherResultUndefined } from '@app/core/domain/geo/weather-info';
import { WeatherInfoRepository } from '@app/core/domain/geo/weather-info.repository';
import type { UserRepository } from '@app/core/domain/user/user.repository';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Inject, Injectable } from '@nestjs/common';
import type { StoryChapterCreateRequestDto } from '../controller/model/tourii-request/create/chapter-story-create-request.model';
import type { ModelRouteCreateRequestDto } from '../controller/model/tourii-request/create/model-route-create-request.model';
import type { StoryCreateRequestDto } from '../controller/model/tourii-request/create/story-create-request.model';
import type { TouristSpotCreateRequestDto } from '../controller/model/tourii-request/create/tourist-spot-create-request.model';
import type { StoryChapterResponseDto } from '../controller/model/tourii-response/chapter-story-response.model';
import type { ModelRouteResponseDto } from '../controller/model/tourii-response/model-route-response.model';
import type { StoryResponseDto } from '../controller/model/tourii-response/story-response.model';
import type { TouristSpotResponseDto } from '../controller/model/tourii-response/tourist-spot-response.model';
import { TouriiBackendConstants } from '../tourii-backend.constant';
import { ModelRouteCreateRequestBuilder } from './builder/model-route-create-request-builder';
import { ModelRouteResultBuilder } from './builder/model-route-result-builder';
import { StoryCreateRequestBuilder } from './builder/story-create-request-builder';
import { StoryResultBuilder } from './builder/story-result-builder';

@Injectable()
export class TouriiBackendService {
    constructor(
        @Inject(TouriiBackendConstants.USER_REPOSITORY_TOKEN)
        private readonly userRepository: UserRepository,
        @Inject(TouriiBackendConstants.STORY_REPOSITORY_TOKEN)
        private readonly storyRepository: StoryRepository,
        @Inject(TouriiBackendConstants.MODEL_ROUTE_REPOSITORY_TOKEN)
        private readonly modelRouteRepository: ModelRouteRepository,
        @Inject(TouriiBackendConstants.GEO_INFO_REPOSITORY_TOKEN)
        private readonly geoInfoRepository: GeoInfoRepository,
        @Inject(TouriiBackendConstants.WEATHER_INFO_REPOSITORY_TOKEN)
        private readonly weatherInfoRepository: WeatherInfoRepository,
    ) {}

    /**
     * Create story
     * @param saga Story create request DTO
     * @returns Story response DTO
     */
    async createStory(saga: StoryCreateRequestDto): Promise<StoryResponseDto> {
        // 1. Create story entity
        const storySaga: StoryEntity = await this.storyRepository.createStory(
            StoryCreateRequestBuilder.dtoToStory(saga, 'admin'),
        );

        // 2. Return story response DTO
        return StoryResultBuilder.storyToDto(storySaga);
    }

    /**
     * Create story chapter
     * @param storyId Story ID
     * @param chapter Story chapter create request DTO
     * @returns Story chapter response DTO
     */
    async createStoryChapter(
        storyId: string,
        chapter: StoryChapterCreateRequestDto,
    ): Promise<StoryChapterResponseDto> {
        // 1. Create story chapter
        const storyChapter: StoryChapter = await this.storyRepository.createStoryChapter(
            storyId,
            StoryCreateRequestBuilder.dtoToStoryChapter(chapter, 'admin'),
        );

        // 2. Return story chapter response DTO
        return StoryResultBuilder.storyChapterToDto(storyChapter, storyId);
    }

    /**
     * Get stories
     * @returns Story response DTO list
     */
    async getStories(): Promise<StoryResponseDto[]> {
        // 1. Fetch story saga
        const storySaga: StoryEntity[] | undefined = await this.storyRepository.getStories();

        // 2. Check if story saga is undefined
        if (!storySaga) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023);
        }

        // 3. Return story response DTO list
        return storySaga.map((story) => StoryResultBuilder.storyToDto(story));
    }

    /**
     * Get story chapters
     * @param storyId Story ID
     * @returns Story chapter response DTO list
     */
    async getStoryChapters(storyId: string): Promise<StoryChapterResponseDto[]> {
        const storyChapter: StoryChapter[] =
            await this.storyRepository.getStoryChaptersByStoryId(storyId);
        if (!storyChapter) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023);
        }
        return storyChapter.map((storyChapter) =>
            StoryResultBuilder.storyChapterToDto(storyChapter, storyId),
        );
    }

    /**
     * Create model route
     * @param modelRoute Model route create request DTO
     * @returns Model route response DTO
     */
    async createModelRoute(modelRoute: ModelRouteCreateRequestDto): Promise<ModelRouteResponseDto> {
        // 1. Fetch dependencies
        const { storyEntity, touristSpotGeoInfoList, regionInfo } =
            await this.fetchNeededModelRouteCreationData(modelRoute);

        // 2. Create model route entity and save to database
        const modelRouteEntity: ModelRouteEntity = await this.modelRouteRepository.createModelRoute(
            ModelRouteCreateRequestBuilder.dtoToModelRoute(
                modelRoute,
                storyEntity,
                touristSpotGeoInfoList,
                regionInfo,
                'admin',
            ),
        );

        // 3. Fetch weather data
        const { currentTouristSpotWeatherList, currentRegionWeatherInfo } =
            await this.fetchWeatherData(touristSpotGeoInfoList, regionInfo);

        // 4. Build response DTO
        const modelRouteResponseDto: ModelRouteResponseDto =
            ModelRouteResultBuilder.modelRouteToDto(
                modelRouteEntity,
                currentTouristSpotWeatherList,
                currentRegionWeatherInfo,
            );

        // 5. Update story chapters
        await this.updateStoryChaptersWithTouristSpotIds(modelRouteResponseDto);

        return modelRouteResponseDto;
    }

    /**
     * Create tourist spot
     * @param touristSpot Tourist spot create request DTO
     * @returns Tourist spot response DTO
     */
    async createTouristSpot(
        touristSpot: TouristSpotCreateRequestDto,
    ): Promise<TouristSpotResponseDto> {
        const touristSpotEntity = await this.touristSpotRepository.createTouristSpot(touristSpot);
        return TouristSpotResultBuilder.touristSpotToDto(touristSpotEntity);
    }

    // async createUser(user: UserEntity) {
    //   // service logic
    //   // dto -> entity
    //   return this.userRepository.createUser(user);
    // }

    // async getUserByUserId(userId: string) {
    //   return this.userRepository.getUserInfoByUserId(userId);
    // }

    // --- Private Helper Methods ---

    /**
     * Fetch needed model route creation data
     * @param modelRoute Model route create request DTO
     * @returns Model route creation data
     */
    private async fetchNeededModelRouteCreationData(
        modelRoute: ModelRouteCreateRequestDto,
    ): Promise<{
        storyEntity: StoryEntity;
        touristSpotGeoInfoList: GeoInfo[];
        regionInfo: GeoInfo;
    }> {
        // 1. Fetch story entity
        const storyEntity: StoryEntity = await this.storyRepository.getStoryById(
            modelRoute.storyId,
        );
        if (!storyEntity) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_023, // Consider a more specific error for story not found
            );
        }

        // 2. Fetch tourist spot geo info list and region info
        const [touristSpotGeoInfoList, regionInfo] = await Promise.all([
            this.geoInfoRepository.getGeoLocationInfoByTouristSpotNameList(
                modelRoute.touristSpotList.map((touristSpot) => touristSpot.touristSpotName),
            ),
            this.geoInfoRepository.getRegionInfoByRegionName(modelRoute.region),
        ]);

        // 3. Check if geo info list is undefined
        if (
            isGeoInfoListUndefined(touristSpotGeoInfoList) ||
            isGeoInfoListUndefined([regionInfo])
        ) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_025, // Geo info not found
            );
        }

        // 4. Return needed data
        return {
            storyEntity,
            touristSpotGeoInfoList,
            regionInfo,
        };
    }

    /**
     * Fetch weather data
     * @param geoInfoList Geo info list
     * @param regionInfo Region info
     * @returns Weather info
     */
    private async fetchWeatherData(
        geoInfoList: GeoInfo[],
        regionInfo: GeoInfo,
    ): Promise<{
        currentTouristSpotWeatherList: WeatherInfo[];
        currentRegionWeatherInfo: WeatherInfo;
    }> {
        // 1. Fetch current tourist spot weather list and current region weather info
        const [currentTouristSpotWeatherList, currentRegionWeather] = await Promise.all([
            this.weatherInfoRepository.getCurrentWeatherByGeoInfoList(geoInfoList),
            this.weatherInfoRepository.getCurrentWeatherByGeoInfoList([regionInfo]),
        ]);

        // 2. Check if weather result is undefined
        if (
            isWeatherResultUndefined(currentTouristSpotWeatherList) ||
            isWeatherResultUndefined(currentRegionWeather)
        ) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_026, // Weather info not found
            );
        }

        // 3. Return needed data
        return {
            currentTouristSpotWeatherList,
            currentRegionWeatherInfo: currentRegionWeather[0],
        };
    }

    /**
     * Update story chapters with tourist spot ids
     * @param modelRouteResponseDto Model route response DTO
     * @returns void
     */
    private async updateStoryChaptersWithTouristSpotIds(
        modelRouteResponseDto: ModelRouteResponseDto,
    ): Promise<void> {
        // 1. Update story chapters with tourist spot ids
        const isUpdated = await this.storyRepository.updateTouristSpotIdListInStoryChapter(
            modelRouteResponseDto.touristSpotList.map((touristSpot) => ({
                storyChapterId: touristSpot.storyChapterId,
                touristSpotId: touristSpot.touristSpotId,
            })),
        );
        if (!isUpdated) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_024, // Update failed
            );
        }

        // 2. Return void
    }
}

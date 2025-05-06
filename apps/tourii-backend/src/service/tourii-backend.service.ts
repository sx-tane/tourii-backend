import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { ModelRouteRepository } from '@app/core/domain/game/model-route/model-route.repository';
import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { QuestRepository } from '@app/core/domain/game/quest/quest.repository';
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
import { QuestType } from '@prisma/client';
import type { StoryChapterCreateRequestDto } from '../controller/model/tourii-request/create/chapter-story-create-request.model';
import type { ModelRouteCreateRequestDto } from '../controller/model/tourii-request/create/model-route-create-request.model';
import type { StoryCreateRequestDto } from '../controller/model/tourii-request/create/story-create-request.model';
import type { TouristSpotCreateRequestDto } from '../controller/model/tourii-request/create/tourist-spot-create-request.model';
import type { StoryChapterResponseDto } from '../controller/model/tourii-response/chapter-story-response.model';
import type { ModelRouteResponseDto } from '../controller/model/tourii-response/model-route-response.model';
import { QuestResponseDto } from '../controller/model/tourii-response/quest-response.model';
import type { StoryResponseDto } from '../controller/model/tourii-response/story-response.model';
import type { TouristSpotResponseDto } from '../controller/model/tourii-response/tourist-spot-response.model';
import { TouriiBackendConstants } from '../tourii-backend.constant';
import { ModelRouteCreateRequestBuilder } from './builder/model-route-create-request-builder';
import { ModelRouteResultBuilder } from './builder/model-route-result-builder';
import { QuestResultBuilder } from './builder/quest-result-builder';
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
        @Inject(TouriiBackendConstants.QUEST_REPOSITORY_TOKEN)
        private readonly questRepository: QuestRepository,
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
        const storyEntity = await this.fetchStoryEntityById(modelRoute.storyId);
        const touristSpotGeoInfoList = await this.fetchGeoInfosByName(
            modelRoute.touristSpotList.map((spot) => spot.touristSpotName),
        );
        const regionInfo = await this.fetchRegionInfoByName(modelRoute.region);

        // 2. Create model route entity and save to database
        const modelRouteEntity: ModelRouteEntity = await this.modelRouteRepository.createModelRoute(
            ModelRouteCreateRequestBuilder.dtoToModelRoute(
                modelRoute,
                storyEntity,
                touristSpotGeoInfoList,
                regionInfo,
                'admin', // Assuming 'admin' for insUserId
            ),
        );

        // 3. Fetch weather data
        const [currentTouristSpotWeatherList, currentRegionWeather] = await Promise.all([
            this.fetchWeatherInfosByGeo(touristSpotGeoInfoList),
            this.fetchWeatherInfosByGeo([regionInfo]), // Fetch weather for region
        ]);
        const currentRegionWeatherInfo = currentRegionWeather[0]; // Expecting single result

        // 4. Build response DTO
        const modelRouteResponseDto: ModelRouteResponseDto =
            ModelRouteResultBuilder.modelRouteToDto(
                modelRouteEntity,
                currentTouristSpotWeatherList,
                currentRegionWeatherInfo,
            );

        // 5. Update story chapters using the entity returned from the repository
        const pairsToUpdate = modelRouteEntity.getValidChapterSpotPairs();
        if (pairsToUpdate.length > 0) {
            await this.updateStoryChaptersWithTouristSpotIds(pairsToUpdate);
        }

        return modelRouteResponseDto;
    }

    /**
     * Create tourist spot and add it to an existing model route
     * @param touristSpot Tourist spot create request DTO
     * @param modelRouteId ID of the model route to add the spot to
     * @returns Tourist spot response DTO
     */
    async createTouristSpot(
        touristSpotDto: TouristSpotCreateRequestDto,
        modelRouteId: string,
    ): Promise<TouristSpotResponseDto> {
        // 1. Fetch parent model route (to get storyId and validate existence)
        const modelRouteEntity: ModelRouteEntity =
            await this.modelRouteRepository.getModelRouteByModelRouteId(modelRouteId);
        if (!modelRouteEntity) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_023, // Or a more specific "Model Route Not Found" error
            );
        }
        if (!modelRouteEntity.storyId) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_023, // Or a more specific error
            );
        }

        // 2. Fetch necessary data using helpers
        const storyEntity = await this.fetchStoryEntityById(modelRouteEntity.storyId);
        const [touristSpotGeoInfo] = await this.fetchGeoInfosByName([
            touristSpotDto.touristSpotName,
        ]); // Expecting single result

        // 3. Create tourist spot entity instance
        //    Note: dtoToTouristSpot expects an array and returns an array, we take the first element.
        const touristSpotEntityInstance = ModelRouteCreateRequestBuilder.dtoToTouristSpot(
            [touristSpotDto],
            [touristSpotGeoInfo], // Pass the fetched geo info
            storyEntity,
            'admin', // Assuming 'admin' for insUserId
        )[0];

        // 4. Add tourist spot to the model route via repository
        const createdTouristSpotEntity: TouristSpot =
            await this.modelRouteRepository.createTouristSpot(
                touristSpotEntityInstance,
                modelRouteId,
            );

        // 5. Fetch weather data for the new spot
        const [currentTouristSpotWeatherInfo] = await this.fetchWeatherInfosByGeo([
            touristSpotGeoInfo, // Use the geo info fetched earlier
        ]);

        // 6. Build response DTO
        //    Note: touristSpotToDto might expect an array of weather info
        const touristSpotResponseDto: TouristSpotResponseDto =
            ModelRouteResultBuilder.touristSpotToDto(createdTouristSpotEntity, [
                currentTouristSpotWeatherInfo,
            ]);

        // 7. Update the corresponding story chapter if needed
        if (createdTouristSpotEntity.touristSpotId && createdTouristSpotEntity.storyChapterId) {
            await this.updateStoryChaptersWithTouristSpotIds([
                {
                    storyChapterId: createdTouristSpotEntity.storyChapterId,
                    touristSpotId: createdTouristSpotEntity.touristSpotId,
                },
            ]);
        }

        return touristSpotResponseDto;
    }

    async fetchQuestsWithPagination(
        page: number,
        limit: number,
        isPremium?: boolean,
        isUnlocked?: boolean,
        questType?: QuestType,
    ): Promise<QuestResponseDto> {
        const quests = await this.questRepository.fetchQuestsWithPagination(
            page,
            limit,
            isPremium,
            isUnlocked,
            questType,
        );
        return QuestResultBuilder.questWithPaginationToDto(quests);
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
     * Fetches a StoryEntity by its ID, throwing an error if not found.
     */
    private async fetchStoryEntityById(storyId: string): Promise<StoryEntity> {
        const storyEntity = await this.storyRepository.getStoryById(storyId);
        if (!storyEntity) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_023, // Story not found
            );
        }
        return storyEntity;
    }

    /**
     * Fetches GeoInfo for a list of names, throwing an error if any are not found.
     */
    private async fetchGeoInfosByName(names: string[]): Promise<GeoInfo[]> {
        if (!names || names.length === 0) {
            return []; // Return empty array if no names provided
        }
        const geoInfos =
            await this.geoInfoRepository.getGeoLocationInfoByTouristSpotNameList(names);
        if (isGeoInfoListUndefined(geoInfos) || geoInfos.length !== names.length) {
            // Adding a check to ensure we got results for all requested names might be needed
            // depending on repository behavior (does it return partial results or throw?)
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_025, // Geo info not found
            );
        }
        return geoInfos;
    }

    /**
     * Fetches GeoInfo for a single region name, throwing an error if not found.
     */
    private async fetchRegionInfoByName(regionName: string): Promise<GeoInfo> {
        const regionInfo = await this.geoInfoRepository.getRegionInfoByRegionName(regionName);
        // Assuming getRegionInfoByRegionName returns GeoInfo or undefined/throws
        if (!regionInfo) {
            // Adjust check based on actual return type
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_025, // Geo info not found
            );
        }
        return regionInfo;
    }

    /**
     * Fetches WeatherInfo for a list of GeoInfo objects, throwing an error if not found.
     */
    private async fetchWeatherInfosByGeo(geoInfos: GeoInfo[]): Promise<WeatherInfo[]> {
        if (!geoInfos || geoInfos.length === 0) {
            return []; // Return empty array if no geoInfos provided
        }
        const weatherInfos =
            await this.weatherInfoRepository.getCurrentWeatherByGeoInfoList(geoInfos);
        if (isWeatherResultUndefined(weatherInfos) || weatherInfos.length !== geoInfos.length) {
            // Add check for partial results if necessary
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_026, // Weather info not found
            );
        }
        return weatherInfos;
    }

    /**
     * Update story chapters with tourist spot ids
     * @param pairs Array of { storyChapterId, touristSpotId } pairs
     * @returns void
     */
    private async updateStoryChaptersWithTouristSpotIds(
        pairs: { storyChapterId: string; touristSpotId: string }[],
    ): Promise<void> {
        // 0. Check if pairs is undefined or empty
        if (!pairs || pairs.length === 0) {
            // Nothing to update
            return;
        }

        // 1. Update story chapters with tourist spot ids
        const isUpdated = await this.storyRepository.updateTouristSpotIdListInStoryChapter(pairs);
        if (!isUpdated) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_024, // Update failed
            );
        }

        // 2. Return void
    }

    // Remove old private fetch methods if they are no longer used
    // private async fetchNeededModelRouteCreationData(...) { ... }
    // private async fetchNeddedTouristSpotCreationData(...) { ... }
    // private async fetchWeatherData(...) { ... }
    // private async fetchWeatherDataForTouristSpot(...) { ... }
}

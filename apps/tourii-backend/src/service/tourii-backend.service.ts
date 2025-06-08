import type { EncryptionRepository } from '@app/core/domain/auth/encryption.repository';
import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { ModelRouteRepository } from '@app/core/domain/game/model-route/model-route.repository';
import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { GroupQuestRepository } from '@app/core/domain/game/quest/group-quest.repository';
import { QuestRepository } from '@app/core/domain/game/quest/quest.repository';
import { StoryChapter } from '@app/core/domain/game/story/chapter-story';
import { StoryEntity } from '@app/core/domain/game/story/story.entity';
import type { StoryRepository } from '@app/core/domain/game/story/story.repository';
import { UserStoryLogRepository } from '@app/core/domain/game/story/user-story-log.repository';
import { GeoInfo } from '@app/core/domain/geo/geo-info';
import { GeoInfoRepository } from '@app/core/domain/geo/geo-info.repository';
import { LocationInfo } from '@app/core/domain/geo/location-info';
import { LocationInfoRepository } from '@app/core/domain/geo/location-info.repository';
import { WeatherInfo } from '@app/core/domain/geo/weather-info';
import { WeatherInfoRepository } from '@app/core/domain/geo/weather-info.repository';
import { DigitalPassportRepository } from '@app/core/domain/passport/digital-passport.repository';
import { UserEntity } from '@app/core/domain/user/user.entity';
import type { UserRepository } from '@app/core/domain/user/user.repository';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { QuestStatus, QuestType, StoryStatus } from '@prisma/client';
import { ethers } from 'ethers';
import type { StoryChapterCreateRequestDto } from '../controller/model/tourii-request/create/chapter-story-create-request.model';
import type { LoginRequestDto } from '../controller/model/tourii-request/create/login-request.model';
import type { ModelRouteCreateRequestDto } from '../controller/model/tourii-request/create/model-route-create-request.model';
import type { QuestCreateRequestDto } from '../controller/model/tourii-request/create/quest-create-request.model';
import type { QuestTaskCreateRequestDto } from '../controller/model/tourii-request/create/quest-task-create-request.model';
import type { StoryCreateRequestDto } from '../controller/model/tourii-request/create/story-create-request.model';
import type { TouristSpotCreateRequestDto } from '../controller/model/tourii-request/create/tourist-spot-create-request.model';
import type { StoryChapterUpdateRequestDto } from '../controller/model/tourii-request/update/chapter-story-update-request.model';
import type { ModelRouteUpdateRequestDto } from '../controller/model/tourii-request/update/model-route-update-request.model';
import type { QuestTaskUpdateRequestDto } from '../controller/model/tourii-request/update/quest-task-update-request.model';
import type { QuestUpdateRequestDto } from '../controller/model/tourii-request/update/quest-update-request.model';
import type { StoryUpdateRequestDto } from '../controller/model/tourii-request/update/story-update-request.model';
import type { TouristSpotUpdateRequestDto } from '../controller/model/tourii-request/update/tourist-spot-update-request.model';
import { AuthSignupResponseDto } from '../controller/model/tourii-response/auth-signup-response.model';
import type { StoryChapterResponseDto } from '../controller/model/tourii-response/chapter-story-response.model';
import type { ModelRouteResponseDto } from '../controller/model/tourii-response/model-route-response.model';
import { QuestListResponseDto } from '../controller/model/tourii-response/quest-list-response.model';
import {
    QuestResponseDto,
    TaskResponseDto,
} from '../controller/model/tourii-response/quest-response.model';
import type { StoryResponseDto } from '../controller/model/tourii-response/story-response.model';
import type { TouristSpotResponseDto } from '../controller/model/tourii-response/tourist-spot-response.model';
import { GroupQuestGateway } from '../group-quest/group-quest.gateway';
import { TouriiBackendConstants } from '../tourii-backend.constant';
import { ModelRouteCreateRequestBuilder } from './builder/model-route-create-request-builder';
import { ModelRouteResultBuilder } from './builder/model-route-result-builder';
import { ModelRouteUpdateRequestBuilder } from './builder/model-route-update-request-builder';
import { QuestCreateRequestBuilder } from './builder/quest-create-request-builder';
import { QuestResultBuilder } from './builder/quest-result-builder';
import { QuestUpdateRequestBuilder } from './builder/quest-update-request-builder';
import { StoryCreateRequestBuilder } from './builder/story-create-request-builder';
import { StoryResultBuilder } from './builder/story-result-builder';
import { StoryUpdateRequestBuilder } from './builder/story-update-request-builder';
import { TouristSpotUpdateRequestBuilder } from './builder/tourist-spot-update-request-builder';
import { UserCreateBuilder } from './builder/user-create-builder';

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
        @Inject(TouriiBackendConstants.LOCATION_INFO_REPOSITORY_TOKEN)
        private readonly locationInfoRepository: LocationInfoRepository,
        @Inject(TouriiBackendConstants.QUEST_REPOSITORY_TOKEN)
        private readonly questRepository: QuestRepository,
        @Inject(TouriiBackendConstants.ENCRYPTION_REPOSITORY_TOKEN)
        private readonly encryptionRepository: EncryptionRepository,
        @Inject(TouriiBackendConstants.USER_STORY_LOG_REPOSITORY_TOKEN)
        private readonly userStoryLogRepository: UserStoryLogRepository,
        @Inject(TouriiBackendConstants.DIGITAL_PASSPORT_REPOSITORY_TOKEN)
        private readonly passportRepository: DigitalPassportRepository,
        @Inject(TouriiBackendConstants.GROUP_QUEST_REPOSITORY_TOKEN)
        private readonly groupQuestRepository: GroupQuestRepository,
        private readonly groupQuestGateway: GroupQuestGateway,
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

    async updateStory(saga: StoryUpdateRequestDto): Promise<StoryResponseDto> {
        const updated = await this.storyRepository.updateStory(
            StoryUpdateRequestBuilder.dtoToStory(saga),
        );
        return StoryResultBuilder.storyToDto(updated);
    }

    async updateStoryChapter(
        chapter: StoryChapterUpdateRequestDto,
    ): Promise<StoryChapterResponseDto> {
        const updated = await this.storyRepository.updateStoryChapter(
            StoryUpdateRequestBuilder.dtoToStoryChapter(chapter),
        );
        return StoryResultBuilder.storyChapterToDto(updated, updated.sagaName ?? '');
    }

    /**
     * Create model route
     * @param modelRoute Model route create request DTO
     * @returns Model route response DTO
     */
    async createModelRoute(modelRoute: ModelRouteCreateRequestDto): Promise<ModelRouteResponseDto> {
        // 1. Standardize region name using Google Places API
        let standardizedRegionName = modelRoute.region;
        try {
            const regionLocationInfo = await this.locationInfoRepository.getLocationInfo(
                modelRoute.region,
            );
            standardizedRegionName = regionLocationInfo.name;
            Logger.log(
                `Using standardized region name: "${standardizedRegionName}" instead of "${modelRoute.region}"`,
            );
        } catch (error) {
            Logger.warn(
                `Failed to get standardized region name for "${modelRoute.region}": ${error}`,
            );
        }

        // 2. Standardize tourist spot names using Google Places API
        const standardizedTouristSpots = await Promise.all(
            modelRoute.touristSpotList.map(async (spot) => {
                let standardizedSpotName = spot.touristSpotName;
                try {
                    const spotLocationInfo = await this.locationInfoRepository.getLocationInfo(
                        spot.touristSpotName,
                    );
                    standardizedSpotName = spotLocationInfo.name;
                    Logger.log(
                        `Using standardized spot name: "${standardizedSpotName}" instead of "${spot.touristSpotName}"`,
                    );
                } catch (error) {
                    Logger.warn(
                        `Failed to get standardized name for spot "${spot.touristSpotName}": ${error}`,
                    );
                }
                return { ...spot, touristSpotName: standardizedSpotName };
            }),
        );

        // 3. Create modified model route DTO with standardized names
        const modifiedModelRoute = {
            ...modelRoute,
            region: standardizedRegionName,
            touristSpotList: standardizedTouristSpots,
        };

        // 4. Fetch dependencies using standardized names
        const storyEntity = await this.storyRepository.getStoryById(modelRoute.storyId);
        const touristSpotGeoInfoList =
            await this.geoInfoRepository.getGeoLocationInfoByTouristSpotNameList(
                standardizedTouristSpots.map((spot) => spot.touristSpotName),
            );
        const regionInfo =
            await this.geoInfoRepository.getRegionInfoByRegionName(standardizedRegionName);

        // 5. Create model route entity and save to database
        const modelRouteEntity: ModelRouteEntity = await this.modelRouteRepository.createModelRoute(
            ModelRouteCreateRequestBuilder.dtoToModelRoute(
                modifiedModelRoute, // Use modified DTO with standardized names
                storyEntity,
                touristSpotGeoInfoList,
                regionInfo,
                'admin', // Assuming 'admin' for insUserId
            ),
        );

        // 6. Fetch weather data
        const [currentTouristSpotWeatherList, currentRegionWeather] = await Promise.all([
            this.weatherInfoRepository.getCurrentWeatherByGeoInfoList(touristSpotGeoInfoList),
            this.weatherInfoRepository.getCurrentWeatherByGeoInfoList([regionInfo]), // Fetch weather for region
        ]);
        const currentRegionWeatherInfo = currentRegionWeather[0]; // Expecting single result

        // 7. Build response DTO
        const modelRouteResponseDto: ModelRouteResponseDto =
            ModelRouteResultBuilder.modelRouteToDto(
                modelRouteEntity,
                currentTouristSpotWeatherList,
                currentRegionWeatherInfo,
            );

        // 8. Update story chapters using the entity returned from the repository
        const pairsToUpdate = modelRouteEntity.getValidChapterSpotPairs();
        if (pairsToUpdate.length > 0) {
            await this.updateStoryChaptersWithTouristSpotIds(pairsToUpdate);
        }

        return modelRouteResponseDto;
    }

    /**
     * Create tourist spot and add it to an existing model route
     * @param touristSpotDto Tourist spot create request DTO
     * @param modelRouteId ID of the model route to add the spot to
     * @returns Tourist spot response DTO
     */
    async createTouristSpot(
        touristSpotDto: TouristSpotCreateRequestDto,
        modelRouteId: string,
    ): Promise<TouristSpotResponseDto> {
        // 1. Fetch standardized place name from Google Places API
        let standardizedSpotName = touristSpotDto.touristSpotName;
        try {
            const locationInfo = await this.locationInfoRepository.getLocationInfo(
                touristSpotDto.touristSpotName,
            );
            standardizedSpotName = locationInfo.name; // Use Google's standardized name
            Logger.log(
                `Using standardized name: "${standardizedSpotName}" instead of "${touristSpotDto.touristSpotName}"`,
            );
        } catch (error) {
            // If Google Places lookup fails, log but continue with user-provided name
            Logger.warn(
                `Failed to get standardized name for "${touristSpotDto.touristSpotName}": ${error}`,
            );
        }

        // 2. Fetch parent model route (to get storyId and validate existence)
        const modelRouteEntity: ModelRouteEntity =
            await this.modelRouteRepository.getModelRouteByModelRouteId(modelRouteId);

        // It's still good to check for essential data integrity if the entity is found.
        if (!modelRouteEntity.storyId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023);
        }

        // 3. Fetch necessary data using helpers (using standardized name for geo lookup)
        const storyEntity = await this.storyRepository.getStoryById(modelRouteEntity.storyId);
        const [touristSpotGeoInfo] =
            await this.geoInfoRepository.getGeoLocationInfoByTouristSpotNameList([
                standardizedSpotName, // Use standardized name for geo lookup
            ]); // Expecting single result

        // 4. Create tourist spot entity instance with standardized name
        //    Note: dtoToTouristSpot expects an array and returns an array, we take the first element.
        const modifiedDto = { ...touristSpotDto, touristSpotName: standardizedSpotName };
        const touristSpotEntityInstance = ModelRouteCreateRequestBuilder.dtoToTouristSpot(
            [modifiedDto],
            [touristSpotGeoInfo], // Pass the fetched geo info
            storyEntity,
            'admin', // Assuming 'admin' for insUserId
        )[0];

        // 5. Add tourist spot to the model route via repository
        const createdTouristSpotEntity: TouristSpot =
            await this.modelRouteRepository.createTouristSpot(
                touristSpotEntityInstance,
                modelRouteId,
            );

        // 6. Fetch weather data for the new spot
        const [currentTouristSpotWeatherInfo] =
            await this.weatherInfoRepository.getCurrentWeatherByGeoInfoList([
                touristSpotGeoInfo, // Use the geo info fetched earlier
            ]);

        // 7. Build response DTO
        //    Note: touristSpotToDto might expect an array of weather info
        const touristSpotResponseDto: TouristSpotResponseDto =
            ModelRouteResultBuilder.touristSpotToDto(createdTouristSpotEntity, [
                currentTouristSpotWeatherInfo,
            ]);

        // 8. Update the corresponding story chapter if needed
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
    ): Promise<QuestListResponseDto> {
        const quests = await this.questRepository.fetchQuestsWithPagination(
            page,
            limit,
            isPremium,
            isUnlocked,
            questType,
        );

        return QuestResultBuilder.questWithPaginationToDto(quests);
    }

    async getQuestById(questId: string): Promise<QuestResponseDto> {
        const quest = await this.questRepository.fetchQuestById(questId);
        return QuestResultBuilder.questToDto(quest);
    }

    async createQuest(dto: QuestCreateRequestDto): Promise<QuestResponseDto> {
        const questEntity = QuestCreateRequestBuilder.dtoToQuest(dto, 'admin');
        const created = await this.questRepository.createQuest(questEntity);
        return QuestResultBuilder.questToDto(created);
    }

    async createQuestTask(
        questId: string,
        dto: QuestTaskCreateRequestDto,
    ): Promise<TaskResponseDto> {
        const taskEntity = QuestCreateRequestBuilder.dtoToQuestTask(dto, questId, 'admin');
        const created = await this.questRepository.createQuestTask(taskEntity);
        return QuestResultBuilder.taskToDto(created);
    }

    /**
     * Update quest
     * @param quest Quest update request DTO
     * @returns Quest response DTO
     */
    async updateQuest(quest: QuestUpdateRequestDto): Promise<QuestResponseDto> {
        const current = await this.questRepository.fetchQuestById(quest.questId);
        const questEntity = QuestUpdateRequestBuilder.dtoToQuest(quest, current);
        const updated = await this.questRepository.updateQuest(questEntity);

        if (quest.taskList && quest.taskList.length > 0 && current.tasks) {
            const taskMap = new Map(current.tasks.map((t) => [t.taskId, t]));
            await Promise.all(
                quest.taskList.map((taskDto) => {
                    const baseTask = taskMap.get(taskDto.taskId);
                    return baseTask
                        ? this.questRepository.updateQuestTask(
                              QuestUpdateRequestBuilder.dtoToQuestTask(taskDto, baseTask),
                          )
                        : Promise.resolve();
                }),
            );
        }

        return QuestResultBuilder.questToDto(updated);
    }

    async updateQuestTask(task: QuestTaskUpdateRequestDto): Promise<TaskResponseDto> {
        const current = await this.questRepository.fetchQuestById(task.questId);
        const baseTask = current.tasks?.find((t) => t.taskId === task.taskId);
        if (!baseTask) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023);
        }
        const taskEntity = QuestUpdateRequestBuilder.dtoToQuestTask(task, baseTask);
        const updated = await this.questRepository.updateQuestTask(taskEntity);
        return QuestResultBuilder.taskToDto(updated);
    }

    async updateModelRoute(modelRoute: ModelRouteUpdateRequestDto): Promise<ModelRouteResponseDto> {
        // 1. Standardize region name using Google Places API (if provided)
        let standardizedRegionName = modelRoute.region;
        if (modelRoute.region) {
            try {
                const regionLocationInfo = await this.locationInfoRepository.getLocationInfo(
                    modelRoute.region,
                );
                standardizedRegionName = regionLocationInfo.name;
                Logger.log(
                    `Using standardized region name: "${standardizedRegionName}" instead of "${modelRoute.region}"`,
                );
            } catch (error) {
                Logger.warn(
                    `Failed to get standardized region name for "${modelRoute.region}": ${error}`,
                );
            }
        }

        // 2. Standardize tourist spot names using Google Places API (if provided)
        let standardizedTouristSpots = modelRoute.touristSpotList;
        if (modelRoute.touristSpotList && modelRoute.touristSpotList.length > 0) {
            standardizedTouristSpots = await Promise.all(
                modelRoute.touristSpotList.map(async (spot) => {
                    let standardizedSpotName = spot.touristSpotName;
                    if (spot.touristSpotName) {
                        try {
                            const spotLocationInfo =
                                await this.locationInfoRepository.getLocationInfo(
                                    spot.touristSpotName,
                                );
                            standardizedSpotName = spotLocationInfo.name;
                            Logger.log(
                                `Using standardized spot name: "${standardizedSpotName}" instead of "${spot.touristSpotName}"`,
                            );
                        } catch (error) {
                            Logger.warn(
                                `Failed to get standardized name for spot "${spot.touristSpotName}": ${error}`,
                            );
                        }
                    }
                    return { ...spot, touristSpotName: standardizedSpotName };
                }),
            );
        }

        // 3. Create modified model route DTO with standardized names
        const modifiedModelRoute = {
            ...modelRoute,
            region: standardizedRegionName,
            touristSpotList: standardizedTouristSpots,
        };

        // 4. Update model route with standardized names
        const updated = await this.modelRouteRepository.updateModelRoute(
            ModelRouteUpdateRequestBuilder.dtoToModelRoute(modifiedModelRoute),
        );
        if (!updated.modelRouteId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_027);
        }
        return this.getModelRouteById(updated.modelRouteId);
    }

    async updateTouristSpot(
        touristSpot: TouristSpotUpdateRequestDto,
    ): Promise<TouristSpotResponseDto> {
        // 1. Standardize tourist spot name using Google Places API (if provided)
        let standardizedTouristSpot = touristSpot;
        if (touristSpot.touristSpotName) {
            let standardizedSpotName = touristSpot.touristSpotName;
            try {
                const locationInfo = await this.locationInfoRepository.getLocationInfo(
                    touristSpot.touristSpotName,
                );
                standardizedSpotName = locationInfo.name;
                Logger.log(
                    `Using standardized name: "${standardizedSpotName}" instead of "${touristSpot.touristSpotName}"`,
                );
            } catch (error) {
                Logger.warn(
                    `Failed to get standardized name for "${touristSpot.touristSpotName}": ${error}`,
                );
            }
            standardizedTouristSpot = { ...touristSpot, touristSpotName: standardizedSpotName };
        }

        // 2. Update tourist spot with standardized name
        const updated = await this.modelRouteRepository.updateTouristSpot(
            TouristSpotUpdateRequestBuilder.dtoToTouristSpot(standardizedTouristSpot),
        );

        if (updated.touristSpotId && updated.storyChapterId) {
            await this.updateStoryChaptersWithTouristSpotIds([
                {
                    storyChapterId: updated.storyChapterId,
                    touristSpotId: updated.touristSpotId,
                },
            ]);
        }

        // 3. Validate tourist spot name before proceeding with geo/weather lookups
        if (!updated.touristSpotName || updated.touristSpotName.trim() === '') {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        // Fetch geo information with proper error handling
        let geoInfo: GeoInfo;
        try {
            const geoInfoList =
                await this.geoInfoRepository.getGeoLocationInfoByTouristSpotNameList([
                    updated.touristSpotName,
                ]);

            if (!geoInfoList || geoInfoList.length === 0) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_025);
            }

            geoInfo = geoInfoList[0];
        } catch (error) {
            if (error instanceof TouriiBackendAppException) throw error;
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004);
        }

        // Fetch weather information with proper error handling
        let weatherInfo: WeatherInfo;
        try {
            const weatherInfoList = await this.weatherInfoRepository.getCurrentWeatherByGeoInfoList(
                [geoInfo],
            );

            if (!weatherInfoList || weatherInfoList.length === 0) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_026);
            }

            weatherInfo = weatherInfoList[0];
        } catch (error) {
            if (error instanceof TouriiBackendAppException) throw error;
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_004);
        }

        return ModelRouteResultBuilder.touristSpotToDto(updated, [weatherInfo]);
    }

    /**
     * Signup user
     * @param email Email
     * @param socialProvider Social provider
     * @param socialId Social ID
     * @param ipAddress IP address
     * @returns Auth signup response DTO
     */
    async signupUser(
        email: string,
        socialProvider: string,
        socialId: string,
        ipAddress: string,
    ): Promise<AuthSignupResponseDto> {
        const wallet = ethers.Wallet.createRandom();
        const encryptedPrivateKey = this.encryptionRepository.encryptString(wallet.privateKey);
        const userEntity = UserCreateBuilder.fromSignup(
            email,
            socialProvider,
            socialId,
            wallet.address,
            encryptedPrivateKey,
            ipAddress,
        );
        try {
            await this.passportRepository.mint(wallet.address);
        } catch (error) {
            Logger.warn(`Passport mint failed: ${error}`, 'TouriiBackendService');
        }
        const created = await this.userRepository.createUser(userEntity);
        return {
            userId: created.userId ?? '',
            walletAddress: wallet.address,
        };
    }

    /**
     * Get all model routes
     * @returns Model route response DTO list
     */
    async getModelRoutes(): Promise<ModelRouteResponseDto[]> {
        const modelRouteEntities = await this.modelRouteRepository.getModelRoutes();
        if (!modelRouteEntities || modelRouteEntities.length === 0) {
            return [];
        }

        // 1. Collect all unique geo identifiers (spot names and region names)
        const allSpotNames = new Set<string>();
        const allRegionNames = new Set<string>();

        for (const entity of modelRouteEntities) {
            if (entity.region) {
                allRegionNames.add(entity.region);
            }
            entity.touristSpotList?.forEach((spot) => {
                if (spot.touristSpotName) {
                    allSpotNames.add(spot.touristSpotName);
                }
            });
        }

        const uniqueSpotNames = Array.from(allSpotNames);
        const uniqueRegionNames = Array.from(allRegionNames);

        // 2. Batch fetch GeoInfo
        let spotGeoInfos: GeoInfo[] = [];
        let regionGeoInfos: GeoInfo[] = [];

        try {
            if (uniqueSpotNames.length > 0) {
                spotGeoInfos =
                    await this.geoInfoRepository.getGeoLocationInfoByTouristSpotNameList(
                        uniqueSpotNames,
                    );
                // Ensure all requested spotGeoInfos were found
                if (spotGeoInfos.length !== uniqueSpotNames.length) {
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_025);
                }
            }
            if (uniqueRegionNames.length > 0) {
                regionGeoInfos = await Promise.all(
                    uniqueRegionNames.map(async (name) => {
                        const regionGeo =
                            await this.geoInfoRepository.getRegionInfoByRegionName(name);
                        // getRegionInfoByRegionName should throw if not found, but double check
                        if (!regionGeo)
                            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_025);
                        return regionGeo;
                    }),
                );
            }
        } catch (error) {
            if (error instanceof TouriiBackendAppException) throw error;
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004); // Generic Geo API error if not already specific
        }

        const spotGeoInfoMap = new Map(spotGeoInfos.map((geo) => [geo.touristSpotName, geo]));
        const regionGeoInfoMap = new Map(regionGeoInfos.map((geo) => [geo.touristSpotName, geo])); // Assuming region name was used as touristSpotName in its GeoInfo

        // 3. Batch fetch WeatherInfo
        const allGeoInfosForWeatherFetch = [...spotGeoInfos, ...regionGeoInfos].filter(
            (geo): geo is GeoInfo => !!geo, // Ensure only valid GeoInfo objects are passed
        );
        const weatherInfoMap = new Map<string, WeatherInfo>(); // Keyed by spotName/regionName
        try {
            if (allGeoInfosForWeatherFetch.length > 0) {
                const fetchedWeatherInfos =
                    await this.weatherInfoRepository.getCurrentWeatherByGeoInfoList(
                        allGeoInfosForWeatherFetch,
                    );
                // Ensure all requested weatherInfos were found
                if (fetchedWeatherInfos.length !== allGeoInfosForWeatherFetch.length) {
                    Logger.error(
                        `Weather not found for tourist spot: ${allGeoInfosForWeatherFetch.length} ${fetchedWeatherInfos.length}`,
                        'TouriiBackendService',
                    );
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_026);
                }
                fetchedWeatherInfos.forEach((weather) => {
                    if (weather.touristSpotName) {
                        weatherInfoMap.set(weather.touristSpotName, weather);
                    } else {
                        // This case should ideally not happen if data from weather repo is consistent
                        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001); // Bad data from weather service
                    }
                });
            }
        } catch (error) {
            if (error instanceof TouriiBackendAppException) throw error;
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_004); // Generic Weather API error
        }

        // 4. Build Response DTOs
        const responseDtos: ModelRouteResponseDto[] = [];
        for (const entity of modelRouteEntities) {
            if (!entity.modelRouteId || !entity.region || !entity.touristSpotList) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_027); // Route entity incomplete
            }

            const currentTouristSpotGeoInfos: GeoInfo[] = [];
            entity.touristSpotList?.forEach((spot) => {
                if (spot.touristSpotName) {
                    const geo = spotGeoInfoMap.get(spot.touristSpotName);
                    if (geo) {
                        currentTouristSpotGeoInfos.push(geo);
                    } else {
                        // This implies a spot name in the entity didn't match any fetched GeoInfo, or was filtered.
                        // If geoInfoRepository.getGeoLocationInfoByTouristSpotNameList throws/filters, this might not be hit for missing.
                        // Assuming E_TB_025 was already thrown if a name in uniqueSpotNames wasn't found.
                        // If it gets here, it implies an internal logic error or inconsistent data.
                        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_025);
                    }
                } else {
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001); // Spot missing name
                }
            });

            const currentRegionGeoInfo = regionGeoInfoMap.get(entity.region);
            if (!currentRegionGeoInfo) {
                // Similar to above, E_TB_025 should have been thrown if region name wasn't found during batch fetch.
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_025);
            }

            const currentTouristSpotWeatherList: WeatherInfo[] = [];
            currentTouristSpotGeoInfos.forEach((geo) => {
                const weather = weatherInfoMap.get(geo.touristSpotName);
                if (weather) {
                    currentTouristSpotWeatherList.push(weather);
                } else {
                    // E_TB_026 should have been thrown if weather for a fetched GeoInfo wasn't found.
                    Logger.error(
                        `Weather not found for tourist spot: ${geo.touristSpotName} ${geo.touristSpotName}`,
                        'TouriiBackendService',
                    );
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_026);
                }
            });

            let currentRegionWeatherInfo: WeatherInfo | undefined;
            if (currentRegionGeoInfo) {
                Logger.debug(
                    `Looking for weather for region: "${currentRegionGeoInfo.touristSpotName}"`,
                );
                Logger.debug(
                    `Available weather keys: ${Array.from(weatherInfoMap.keys()).join(', ')}`,
                );

                // Primary lookup by exact name match
                currentRegionWeatherInfo = weatherInfoMap.get(currentRegionGeoInfo.touristSpotName);

                // Fallback: try case-insensitive lookup
                if (!currentRegionWeatherInfo) {
                    const regionNameLower = currentRegionGeoInfo.touristSpotName.toLowerCase();
                    for (const [key, weather] of weatherInfoMap.entries()) {
                        if (key.toLowerCase() === regionNameLower) {
                            currentRegionWeatherInfo = weather;
                            Logger.debug(
                                `Found weather using case-insensitive match: "${key}" for region "${currentRegionGeoInfo.touristSpotName}"`,
                            );
                            break;
                        }
                    }
                }

                // Second fallback: try partial name match (for cases like "Aomori Prefecture" vs "Aomori")
                if (!currentRegionWeatherInfo) {
                    const regionNameLower = currentRegionGeoInfo.touristSpotName.toLowerCase();
                    for (const [key, weather] of weatherInfoMap.entries()) {
                        const keyLower = key.toLowerCase();
                        if (
                            keyLower.includes(regionNameLower) ||
                            regionNameLower.includes(keyLower)
                        ) {
                            currentRegionWeatherInfo = weather;
                            Logger.debug(
                                `Found weather using partial match: "${key}" for region "${currentRegionGeoInfo.touristSpotName}"`,
                            );
                            break;
                        }
                    }
                }
            }

            if (!currentRegionWeatherInfo) {
                Logger.error(
                    `Weather not found for region: "${currentRegionGeoInfo.touristSpotName}". Available keys: [${Array.from(weatherInfoMap.keys()).join(', ')}]`,
                    'TouriiBackendService',
                );
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_026);
            }

            responseDtos.push(
                ModelRouteResultBuilder.modelRouteToDto(
                    entity,
                    currentTouristSpotWeatherList, // This should be an array of WeatherInfo
                    currentRegionWeatherInfo, // Now guaranteed to be WeatherInfo due to the check above
                ),
            );
        }
        return responseDtos;
    }

    /**
     * Get model route by ID
     * @param modelRouteId ID of the model route
     * @returns Model route response DTO
     */
    async getModelRouteById(modelRouteId: string): Promise<ModelRouteResponseDto> {
        const modelRouteEntity =
            await this.modelRouteRepository.getModelRouteByModelRouteId(modelRouteId);
        // getModelRouteByModelRouteId in repo already throws if not found, so no need to check here.

        if (!modelRouteEntity.region || !modelRouteEntity.touristSpotList) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_027);
        }

        const spotNames = modelRouteEntity.touristSpotList
            .map((spot) => spot.touristSpotName)
            .filter((name): name is string => typeof name === 'string');

        if (spotNames.length !== modelRouteEntity.touristSpotList.length) {
            // A spot is missing a name
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        // Fetch all GeoInfo together
        const [touristSpotGeoInfoList, regionGeoInfo] = await Promise.all([
            this.geoInfoRepository
                .getGeoLocationInfoByTouristSpotNameList(spotNames)
                .then((geos) => {
                    if (geos.length !== spotNames.length)
                        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_025);
                    return geos;
                }),
            this.geoInfoRepository
                .getRegionInfoByRegionName(modelRouteEntity.region)
                .then((geo) => {
                    if (!geo)
                        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_025);
                    return geo;
                }),
        ]).catch((error) => {
            if (error instanceof TouriiBackendAppException) throw error;
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004);
        });

        // Fetch all WeatherInfo together
        const allGeoInfosForWeather = [...touristSpotGeoInfoList, regionGeoInfo];
        const weatherInfos = await this.weatherInfoRepository
            .getCurrentWeatherByGeoInfoList(allGeoInfosForWeather)
            .catch((error) => {
                if (error instanceof TouriiBackendAppException) throw error;
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_004);
            });

        if (weatherInfos.length !== allGeoInfosForWeather.length) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_026);
        }

        const currentTouristSpotWeatherList = weatherInfos.slice(0, touristSpotGeoInfoList.length);
        const currentRegionWeatherInfo = weatherInfos[touristSpotGeoInfoList.length];

        return ModelRouteResultBuilder.modelRouteToDto(
            modelRouteEntity,
            currentTouristSpotWeatherList,
            currentRegionWeatherInfo,
        );
    }

    async createUser(user: UserEntity) {
        // service logic
        // dto -> entity
        return this.userRepository.createUser(user);
    }

    async loginUser(login: LoginRequestDto): Promise<UserEntity> {
        let user: UserEntity | undefined;
        if (login.username) {
            user = await this.userRepository.getUserByUsername(login.username);
        }
        if (!user && login.passportWalletAddress) {
            user = await this.userRepository.getUserByPassportWallet(login.passportWalletAddress);
        }
        if (!user && login.discordId) {
            user = await this.userRepository.getUserByDiscordId(login.discordId);
        }
        if (!user && login.googleEmail) {
            user = await this.userRepository.getUserByGoogleEmail(login.googleEmail);
        }

        if (!user) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
        }

        if (user.password !== login.password) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_005);
        }

        if (
            (login.passportWalletAddress &&
                user.passportWalletAddress !== login.passportWalletAddress) ||
            (login.discordId && user.discordId !== login.discordId) ||
            (login.googleEmail && user.googleEmail !== login.googleEmail)
        ) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_005);
        }

        return user;
    }

    /**
     * Get group members
     * @param questId Quest ID
     * @returns Group members
     */
    async getGroupMembers(questId: string) {
        return this.groupQuestRepository.getGroupMembers(questId);
    }

    /**
     * Start group quest
     * @param questId Quest ID
     * @param leaderId Leader ID
     * @returns void
     */
    async startGroupQuest(questId: string, leaderId: string) {
        const group = await this.getGroupMembers(questId);
        if (group.leaderUserId !== leaderId) {
            throw new ForbiddenException('Only leader can start the quest');
        }
        if (group.members.length === 0) return { message: 'Group quest started!' };
        await this.groupQuestRepository.updateMembersStatus(
            questId,
            group.members.map((m) => m.userId),
            QuestStatus.ONGOING,
        );
        this.groupQuestGateway.broadcastQuestStarted(questId);
        return { message: 'Group quest started!' };
    }

    /**
     * Get location info
     * @param query Query string
     * @returns Location info
     */
    async getLocationInfo(query: string): Promise<LocationInfo> {
        return this.locationInfoRepository.getLocationInfo(query);
    }

    /**
     * Track chapter progress
     * @param userId User ID
     * @param chapterId Chapter ID
     * @param status Story status
     * @returns void
     */
    async trackChapterProgress(
        userId: string,
        chapterId: string,
        status: StoryStatus,
    ): Promise<void> {
        await this.userStoryLogRepository.trackProgress(userId, chapterId, status);
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
}

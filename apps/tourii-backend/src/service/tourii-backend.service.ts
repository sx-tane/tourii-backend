import {
    R2StorageRepository,
    TransformDate,
    UserTaskLogRepository,
    UserTravelLogRepository,
} from '@app/core';
import type { EncryptionRepository } from '@app/core/domain/auth/encryption.repository';
import { JwtRepository, QrCodePayload } from '@app/core/domain/auth/jwt.repository';
import { MomentType } from '@app/core/domain/feed/moment-type';
import { MomentRepository } from '@app/core/domain/feed/moment.repository';
import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { ModelRouteRepository } from '@app/core/domain/game/model-route/model-route.repository';
import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { GroupQuestRepository } from '@app/core/domain/game/quest/group-quest.repository';
import { QuestRepository } from '@app/core/domain/game/quest/quest.repository';
import { TaskRepository } from '@app/core/domain/game/quest/task.repository';
import { StoryChapter } from '@app/core/domain/game/story/chapter-story';
import { StoryEntity } from '@app/core/domain/game/story/story.entity';
import type { StoryRepository } from '@app/core/domain/game/story/story.repository';
import {
    StoryCompletionResult,
    UserStoryLogRepository,
} from '@app/core/domain/game/story/user-story-log.repository';
import { GeoInfo } from '@app/core/domain/geo/geo-info';
import { GeoInfoRepository } from '@app/core/domain/geo/geo-info.repository';
import { LocationInfoRepository } from '@app/core/domain/geo/location-info.repository';
import { WeatherInfo } from '@app/core/domain/geo/weather-info';
import { WeatherInfoRepository } from '@app/core/domain/geo/weather-info.repository';
import { LocationTrackingService } from '@app/core/domain/location/location-tracking.service';
import { DigitalPassportRepository } from '@app/core/domain/passport/digital-passport.repository';
import { PassportMetadataRepository } from '@app/core/domain/passport/passport-metadata.repository';
import { PassportPdfRepository } from '@app/core/domain/passport/passport-pdf.repository';
import { DeviceInfo, WalletPassRepository } from '@app/core/domain/passport/wallet-pass.repository';
import { UserEntity } from '@app/core/domain/user/user.entity';
import type { GetAllUsersOptions, UserRepository } from '@app/core/domain/user/user.repository';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { CheckInMethod, QuestType, StoryStatus, TaskStatus } from '@prisma/client';
import { ethers } from 'ethers';
import { imageSize } from 'image-size';
import type { StoryChapterCreateRequestDto } from '../controller/model/tourii-request/create/chapter-story-create-request.model';
import type { LocalInteractionSubmissionDto } from '../controller/model/tourii-request/create/local-interaction-request.model';
import type { LoginRequestDto } from '../controller/model/tourii-request/create/login-request.model';
import type { ModelRouteCreateRequestDto } from '../controller/model/tourii-request/create/model-route-create-request.model';
import type { QuestCreateRequestDto } from '../controller/model/tourii-request/create/quest-create-request.model';
import type { QuestTaskCreateRequestDto } from '../controller/model/tourii-request/create/quest-task-create-request.model';
import type { StoryCreateRequestDto } from '../controller/model/tourii-request/create/story-create-request.model';
import type { TouristSpotCreateRequestDto } from '../controller/model/tourii-request/create/tourist-spot-create-request.model';
import type { CheckinsFetchRequestDto } from '../controller/model/tourii-request/fetch/checkins-fetch-request.model';
import type { StoryChapterUpdateRequestDto } from '../controller/model/tourii-request/update/chapter-story-update-request.model';
import type { ModelRouteUpdateRequestDto } from '../controller/model/tourii-request/update/model-route-update-request.model';
import type { QuestTaskUpdateRequestDto } from '../controller/model/tourii-request/update/quest-task-update-request.model';
import type { QuestUpdateRequestDto } from '../controller/model/tourii-request/update/quest-update-request.model';
import type { StoryUpdateRequestDto } from '../controller/model/tourii-request/update/story-update-request.model';
import type { TouristSpotUpdateRequestDto } from '../controller/model/tourii-request/update/tourist-spot-update-request.model';
import {
    AdminUserListResponseDto,
    AdminUserQueryDto,
} from '../controller/model/tourii-response/admin/admin-user-list-response.model';
import { AuthSignupResponseDto } from '../controller/model/tourii-response/auth-signup-response.model';
import type { StoryChapterResponseDto } from '../controller/model/tourii-response/chapter-story-response.model';
import { HomepageHighlightsResponseDto } from '../controller/model/tourii-response/homepage/highlight-response.model';
import type { LocalInteractionResponseDto } from '../controller/model/tourii-response/local-interaction-response.model';
import { LocationInfoResponseDto } from '../controller/model/tourii-response/location-info-response.model';
import type { ModelRouteResponseDto } from '../controller/model/tourii-response/model-route-response.model';
import { MomentListResponseDto } from '../controller/model/tourii-response/moment-response.model';
import { QrScanResponseDto } from '../controller/model/tourii-response/qr-scan-response.model';
import { QuestListResponseDto } from '../controller/model/tourii-response/quest-list-response.model';
import {
    QuestResponseDto,
    TaskResponseDto,
} from '../controller/model/tourii-response/quest-response.model';
import { QuestTaskPhotoUploadResponseDto } from '../controller/model/tourii-response/quest-task-photo-upload-response.model';
import { QuestTaskSocialShareResponseDto } from '../controller/model/tourii-response/quest-task-social-share-response.model';
import type { StoryResponseDto } from '../controller/model/tourii-response/story-response.model';
import { SubmitTaskResponseDto } from '../controller/model/tourii-response/submit-tasks-response.model';
import type { TouristSpotResponseDto } from '../controller/model/tourii-response/tourist-spot-response.model';
import {
    UserResponseDto,
    UserSensitiveInfoResponseDto,
} from '../controller/model/tourii-response/user/user-response.model';
import type { UserTravelLogListResponseDto } from '../controller/model/tourii-response/user/user-travel-log-list-response.model';
import { GroupQuestGateway } from '../group-quest/group-quest.gateway';
import { TouriiBackendConstants } from '../tourii-backend.constant';
import { LocationInfoResultBuilder } from './builder/location-info-result-builder';

// Passport service interfaces
export interface PassportPdfResult {
    tokenId: string;
    downloadUrl: string;
    qrCode: string;
    expiresAt: Date;
}

export interface WalletPassResult {
    tokenId: string;
    platform: 'apple' | 'google';
    downloadUrl?: string;
    redirectUrl: string;
    expiresAt: Date;
    passBuffer?: Buffer;
}

export interface BothWalletPassesResult {
    tokenId: string;
    apple: WalletPassResult;
    google: WalletPassResult;
}

export interface VerificationResult {
    valid: boolean;
    tokenId: string;
    verifiedAt: Date;
    expiresAt?: Date;
    passportData?: {
        username: string;
        level: string;
        passportType: string;
        questsCompleted: number;
        travelDistance: number;
        magatamaPoints: number;
        registeredAt: Date;
    };
    error?: string;
}

export interface BatchVerificationRequest {
    tokens: string[];
}

export interface BatchVerificationResult {
    results: VerificationResult[];
    summary: {
        total: number;
        valid: number;
        invalid: number;
    };
}

export interface VerificationStats {
    tokenId?: string;
    totalVerifications: number;
    todayVerifications: number;
    lastVerified?: Date;
    popularPassports?: {
        tokenId: string;
        username: string;
        verificationCount: number;
    }[];
}

import { ModelRouteCreateRequestBuilder } from './builder/model-route-create-request-builder';
import { ModelRouteResultBuilder } from './builder/model-route-result-builder';
import { ModelRouteUpdateRequestBuilder } from './builder/model-route-update-request-builder';
import { QuestCreateRequestBuilder } from './builder/quest-create-request-builder';
import { QuestResultBuilder } from './builder/quest-result-builder';
import { QuestUpdateRequestBuilder } from './builder/quest-update-request-builder';
import { StoryCreateRequestBuilder } from './builder/story-create-request-builder';
import { StoryResultBuilder } from './builder/story-result-builder';
import { StoryUpdateRequestBuilder } from './builder/story-update-request-builder';
import { TaskResultBuilder } from './builder/task-result-builder';
import { TouristSpotUpdateRequestBuilder } from './builder/tourist-spot-update-request-builder';
import { UserCreateBuilder } from './builder/user-create-builder';
import { UserResultBuilder } from './builder/user-result-builder';
import { UserTravelLogResultBuilder } from './builder/user-travel-log-result-builder';

@Injectable()
export class TouriiBackendService {
    private readonly logger = new Logger(TouriiBackendService.name);
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
        @Inject(TouriiBackendConstants.MOMENT_REPOSITORY_TOKEN)
        private readonly momentRepository: MomentRepository,
        @Inject(TouriiBackendConstants.R2_STORAGE_REPOSITORY_TOKEN)
        private readonly r2StorageRepository: R2StorageRepository,
        @Inject(TouriiBackendConstants.USER_TASK_LOG_REPOSITORY_TOKEN)
        private readonly userTaskLogRepository: UserTaskLogRepository,
        @Inject(TouriiBackendConstants.TASK_REPOSITORY_TOKEN)
        private readonly taskRepository: TaskRepository,
        @Inject(TouriiBackendConstants.USER_TRAVEL_LOG_REPOSITORY_TOKEN)
        private readonly userTravelLogRepository: UserTravelLogRepository,
        @Inject(TouriiBackendConstants.LOCATION_TRACKING_SERVICE_TOKEN)
        private readonly locationTrackingService: LocationTrackingService,
        @Inject(TouriiBackendConstants.PASSPORT_PDF_REPOSITORY_TOKEN)
        private readonly passportPdfRepository: PassportPdfRepository,
        @Inject(TouriiBackendConstants.WALLET_PASS_REPOSITORY_TOKEN)
        private readonly walletPassRepository: WalletPassRepository,
        @Inject(TouriiBackendConstants.JWT_REPOSITORY_TOKEN)
        private readonly jwtRepository: JwtRepository,
        @Inject(TouriiBackendConstants.PASSPORT_METADATA_REPOSITORY_TOKEN)
        private readonly passportMetadataRepository: PassportMetadataRepository,
        private readonly groupQuestGateway: GroupQuestGateway,
    ) {}

    // ==========================================
    // USER & AUTH METHODS
    // ==========================================

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
     * Create user
     * @param user User entity
     * @returns User entity
     */
    async createUser(user: UserEntity) {
        // service logic
        // dto -> entity
        return this.userRepository.createUser(user);
    }

    /**
     * Login user
     * @param login Login request DTO
     * @returns User entity
     */
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
     * Get user profile
     * @param userId User ID
     * @returns User profile response DTO
     */
    async getUserProfile(userId: string): Promise<UserResponseDto> {
        const user = await this.userRepository.getUserInfoByUserId(userId);
        if (!user) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
        }
        return UserResultBuilder.userToDto(user);
    }

    /**
     * Get user sensitive info
     * @param userId User ID
     * @returns User sensitive info response DTO
     */
    async getUserSensitiveInfo(userId: string): Promise<UserSensitiveInfoResponseDto> {
        const user = await this.userRepository.getUserInfoByUserId(userId);
        if (!user) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
        }
        return UserResultBuilder.userSensitiveInfoToDto(user);
    }

    /**
     * Get all users with pagination and filtering (Admin only)
     * @param query Admin user query with filters and pagination
     * @returns Paginated list of users with admin details
     */
    async getAllUsersForAdmin(query: AdminUserQueryDto): Promise<AdminUserListResponseDto> {
        // Parse and validate query parameters
        const page = Math.max(1, parseInt(query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));

        // Parse date filters
        const startDate = query.startDate ? new Date(query.startDate) : undefined;
        const endDate = query.endDate ? new Date(query.endDate) : undefined;

        // Parse boolean filters
        const isPremium = query.isPremium !== undefined ? query.isPremium === 'true' : undefined;
        const isBanned = query.isBanned !== undefined ? query.isBanned === 'true' : undefined;

        const options: GetAllUsersOptions = {
            page,
            limit,
            searchTerm: query.searchTerm,
            role: query.role,
            isPremium,
            isBanned,
            startDate,
            endDate,
            sortBy: query.sortBy || 'registered_at',
            sortOrder: query.sortOrder || 'desc',
        };

        const result = await this.userRepository.getAllUsersWithPagination(options);

        // Build response DTOs with summary stats
        const adminUsers = result.users.map((user) => {
            const dto = UserResultBuilder.userToDto(user);

            // Add summary statistics for admin view
            const summaryStats = {
                achievementCount: user.userAchievements?.length || 0,
                onchainItemCount: user.userOnchainItems?.length || 0,
                storyCompletedCount:
                    user.userStoryLogs?.filter((log) => log.status === 'COMPLETED').length || 0,
                taskCompletedCount:
                    user.userTaskLogs?.filter((log) => log.status === 'COMPLETED').length || 0,
                totalCheckinsCount: user.userTravelLogs?.length || 0,
                discordActivityCount: user.discordActivityLogs?.length || 0,
                invitesSentCount: user.userInviteLogs?.length || 0,
            };

            return {
                ...dto,
                // Add admin-specific fields
                latestIpAddress: user.latestIpAddress,
                summaryStats,
            };
        });

        return {
            users: adminUsers,
            pagination: {
                totalCount: result.totalCount,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            },
            filters: {
                searchTerm: query.searchTerm,
                role: query.role,
                isPremium,
                isBanned,
                startDate,
                endDate,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            },
        };
    }

    /**
     * Get user travel checkins with pagination and optional filters
     * @param query Checkins fetch request with filters and pagination params
     * @param requestingUserId User ID making the request
     * @returns Paginated user travel log checkins response DTO
     */
    async getUserCheckins(
        query: CheckinsFetchRequestDto,
        requestingUserId: string,
    ): Promise<UserTravelLogListResponseDto> {
        // Determine target user ID - use query.userId if provided, otherwise use requesting user
        const targetUserId = query.userId || requestingUserId;

        // Users can only see their own check-ins unless they're admin
        if (targetUserId !== requestingUserId) {
            const user = await this.userRepository.getUserInfoByUserId(requestingUserId);
            if (user?.role !== 'ADMIN') {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
            }
        }

        // Build filter object
        const filter = {
            userId: targetUserId,
            questId: query.questId,
            touristSpotId: query.touristSpotId,
            startDate: query.startDate,
            endDate: query.endDate,
            checkInMethod: query.checkInMethod,
            checkInMethods: query.source
                ? query.source === 'manual'
                    ? [CheckInMethod.QR_CODE, CheckInMethod.GPS]
                    : [CheckInMethod.AUTO_DETECTED, CheckInMethod.BACKGROUND_GPS]
                : undefined,
        };

        // Get paginated results from repository
        const checkins = await this.userTravelLogRepository.getUserTravelLogsWithPagination(
            filter,
            query.page,
            query.limit,
        );

        // Transform to response DTO
        return UserTravelLogResultBuilder.userTravelLogsToListDto(checkins);
    }

    // ==========================================
    // STORY METHODS
    // ==========================================

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
     * Update story
     * @param saga Story update request DTO
     * @returns Story response DTO
     */
    async updateStory(saga: StoryUpdateRequestDto): Promise<StoryResponseDto> {
        const updated = await this.storyRepository.updateStory(
            StoryUpdateRequestBuilder.dtoToStory(saga),
        );
        return StoryResultBuilder.storyToDto(updated);
    }

    /**
     * Update story chapter
     * @param chapter Story chapter update request DTO
     * @returns Story chapter response DTO
     */
    async updateStoryChapter(
        chapter: StoryChapterUpdateRequestDto,
    ): Promise<StoryChapterResponseDto> {
        const updated = await this.storyRepository.updateStoryChapter(
            StoryUpdateRequestBuilder.dtoToStoryChapter(chapter),
        );
        return StoryResultBuilder.storyChapterToDto(updated, updated.sagaName ?? '');
    }

    /**
     * Delete story
     * @param storyId Story ID
     * @returns void
     */
    async deleteStory(storyId: string): Promise<void> {
        await this.storyRepository.deleteStory(storyId);
    }

    /**
     * Delete story chapter
     * @param chapterId Story chapter ID
     * @returns void
     */
    async deleteStoryChapter(chapterId: string): Promise<void> {
        await this.storyRepository.deleteStoryChapter(chapterId);
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
        latitude?: number,
        longitude?: number,
    ): Promise<void> {
        // If location coordinates provided, try auto-detection for location validation
        if (latitude && longitude) {
            try {
                const locationDetection = await this.locationTrackingService.detectLocationFromAPI({
                    userId,
                    latitude,
                    longitude,
                    apiSource: 'story_progress',
                    confidence: 0.8,
                    metadata: {
                        chapterId,
                        status,
                        action: 'chapter_progress_tracking',
                    },
                });

                if (locationDetection && locationDetection.nearbyTouristSpots.length > 0) {
                    // Find tourist spots associated with this story chapter
                    const relevantSpots = locationDetection.nearbyTouristSpots.filter((spot) => {
                        // Check if any spot is related to the story/chapter
                        return spot.touristSpotId; // Basic filter - can be enhanced with chapter-spot mapping
                    });

                    if (relevantSpots.length > 0) {
                        // Create travel logs for relevant story locations
                        for (const spot of relevantSpots) {
                            try {
                                await this.locationTrackingService.createAutoDetectedTravelLog({
                                    userId,
                                    questId: spot.questId || '',
                                    taskId: '', // No specific task for story progress
                                    touristSpotId: spot.touristSpotId,
                                    detectedLocation: { latitude, longitude },
                                    checkInMethod: 'AUTO_DETECTED',
                                    apiSource: 'story_progress',
                                    confidence: locationDetection.confidence,
                                    metadata: {
                                        storyProgress: true,
                                        chapterId,
                                        status,
                                        detectedDistance: spot.distance,
                                        locationValidated: true,
                                    },
                                });
                            } catch (error) {
                                this.logger.warn(
                                    `Failed to create story progress travel log: ${error}`,
                                );
                            }
                        }
                        this.logger.log(
                            `Auto-detected story progress location for chapter: ${chapterId}`,
                        );
                    }
                }
            } catch (error) {
                this.logger.warn(`Location detection failed for story progress: ${error}`);
            }
        }

        await this.userStoryLogRepository.trackProgress(userId, chapterId, status);
    }

    /**
     * Start story reading
     * @param userId User ID
     * @param chapterId Chapter ID
     * @returns void
     */
    async startStoryReading(userId: string, chapterId: string): Promise<void> {
        await this.userStoryLogRepository.startStoryReading(userId, chapterId);
    }

    /**
     * Complete story reading with quest unlocking and rewards
     * @param userId User ID
     * @param chapterId Chapter ID
     * @returns Story completion result with unlocked quests and rewards
     */
    async completeStoryWithQuestUnlocking(
        userId: string,
        chapterId: string,
    ): Promise<StoryCompletionResult> {
        return await this.userStoryLogRepository.completeStoryWithQuestUnlocking(userId, chapterId);
    }

    /**
     * Get story progress for a user and chapter
     * @param userId User ID
     * @param chapterId Chapter ID
     * @returns Story progress information
     */
    async getStoryProgress(
        userId: string,
        chapterId: string,
    ): Promise<{
        status: StoryStatus;
        unlockedAt: Date | null;
        finishedAt: Date | null;
        canStart: boolean;
        canComplete: boolean;
    } | null> {
        const progress = await this.userStoryLogRepository.getStoryProgress(userId, chapterId);

        if (!progress) {
            return {
                status: StoryStatus.UNREAD,
                unlockedAt: null,
                finishedAt: null,
                canStart: true,
                canComplete: false,
            };
        }

        return {
            ...progress,
            canStart: progress.status === StoryStatus.UNREAD,
            canComplete: progress.status === StoryStatus.IN_PROGRESS,
        };
    }

    // ==========================================
    // MODEL ROUTE METHODS
    // ==========================================

    /**
     * Create model route
     * @param modelRoute Model route create request DTO
     * @returns Model route response DTO
     */
    async createModelRoute(modelRoute: ModelRouteCreateRequestDto): Promise<ModelRouteResponseDto> {
        // 1. First pass: Standardize tourist spot names and addresses using Google Places API
        const standardizedSpots = await Promise.all(
            modelRoute.touristSpotList.map(async (spot) => {
                let standardizedName = spot.touristSpotName;
                let standardizedAddress = spot.address;

                try {
                    const locationInfo = await this.locationInfoRepository.getLocationInfo(
                        spot.touristSpotName,
                        undefined,
                        undefined,
                        spot.address,
                    );
                    standardizedName = locationInfo.name;
                    standardizedAddress = locationInfo.formattedAddress || spot.address;
                    Logger.log(
                        `Standardized "${spot.touristSpotName}" → "${standardizedName}" with address "${standardizedAddress}"`,
                    );
                } catch (error) {
                    Logger.warn(`Failed to standardize spot "${spot.touristSpotName}": ${error}`);
                    // Keep original values if standardization fails
                }

                return {
                    ...spot,
                    touristSpotName: standardizedName,
                    address: standardizedAddress,
                };
            }),
        );

        // 2. Second pass: Get accurate lat/long using standardized names + addresses
        const standardizedNames = standardizedSpots.map((spot) => spot.touristSpotName);
        const standardizedAddresses = standardizedSpots
            .map((spot) => spot.address)
            .filter((addr): addr is string => !!addr);

        // Fetch story entity only if storyId is provided
        const [storyEntity, touristSpotGeoInfoList, regionInfo] = await Promise.all([
            modelRoute.storyId
                ? this.storyRepository.getStoryById(modelRoute.storyId)
                : Promise.resolve(null),
            this.geoInfoRepository.getGeoLocationInfoByTouristSpotNameList(
                standardizedNames,
                standardizedAddresses, // Pass addresses for enhanced accuracy
            ),
            this.geoInfoRepository.getRegionInfoByRegionName(modelRoute.region),
        ]);

        // 3. Create modified model route DTO with standardized data
        const modifiedModelRoute = {
            ...modelRoute,
            touristSpotList: standardizedSpots,
        };

        // 4. Create model route entity and save to database
        const modelRouteEntity: ModelRouteEntity = await this.modelRouteRepository.createModelRoute(
            ModelRouteCreateRequestBuilder.dtoToModelRoute(
                modifiedModelRoute,
                storyEntity,
                touristSpotGeoInfoList,
                regionInfo,
                'admin',
            ),
        );

        // 5. Fetch weather data
        const [currentTouristSpotWeatherList, currentRegionWeather] = await Promise.all([
            this.weatherInfoRepository.getCurrentWeatherByGeoInfoList(touristSpotGeoInfoList),
            this.weatherInfoRepository.getCurrentWeatherByGeoInfoList([regionInfo]),
        ]);
        const currentRegionWeatherInfo = currentRegionWeather[0];

        // 6. Build response DTO
        const modelRouteResponseDto: ModelRouteResponseDto =
            ModelRouteResultBuilder.modelRouteToDto(
                modelRouteEntity,
                currentTouristSpotWeatherList,
                currentRegionWeatherInfo,
            );

        // 7. Update story chapters using the entity returned from the repository
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
        // 1. First pass: Standardize tourist spot name and address using Google Places API
        let standardizedSpotName = touristSpotDto.touristSpotName;
        let standardizedAddress = touristSpotDto.address;

        try {
            const locationInfo = await this.locationInfoRepository.getLocationInfo(
                touristSpotDto.touristSpotName,
                undefined,
                undefined,
                touristSpotDto.address,
            );
            standardizedSpotName = locationInfo.name;
            standardizedAddress = locationInfo.formattedAddress || touristSpotDto.address;
            Logger.log(
                `Standardized "${touristSpotDto.touristSpotName}" → "${standardizedSpotName}" with address "${standardizedAddress}"`,
            );
        } catch (error) {
            Logger.warn(`Failed to standardize spot "${touristSpotDto.touristSpotName}": ${error}`);
        }

        // 2. Fetch parent model route (to get storyId and validate existence)
        const modelRouteEntity: ModelRouteEntity =
            await this.modelRouteRepository.getModelRouteByModelRouteId(modelRouteId);

        if (!modelRouteEntity.storyId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023);
        }

        // 3. Second pass: Get accurate lat/long using standardized name + address
        const storyEntity = await this.storyRepository.getStoryById(modelRouteEntity.storyId);
        const addresses = standardizedAddress ? [standardizedAddress] : undefined;
        const [touristSpotGeoInfo] =
            await this.geoInfoRepository.getGeoLocationInfoByTouristSpotNameList(
                [standardizedSpotName],
                addresses,
            );

        // 4. Create tourist spot entity instance with standardized name
        //    Note: dtoToTouristSpot expects an array and returns an array, we take the first element.
        const modifiedDto = { ...touristSpotDto, touristSpotName: standardizedSpotName };
        const touristSpotEntityInstance = ModelRouteCreateRequestBuilder.dtoToTouristSpot(
            [modifiedDto],
            [touristSpotGeoInfo], // Pass the fetched geo info
            touristSpotDto.storyChapterId ? storyEntity : null,
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

    /**
     * Update model route
     * @param modelRoute Model route update request DTO
     * @returns Model route response DTO
     */
    async updateModelRoute(modelRoute: ModelRouteUpdateRequestDto): Promise<ModelRouteResponseDto> {
        // 1. Standardize tourist spot names using Google Places API (if provided)
        // let standardizedTouristSpots = modelRoute.touristSpotList;
        if (modelRoute.touristSpotList && modelRoute.touristSpotList.length > 0) {
            // First, collect all spot names that need standardization
            const spotNamesToStandardize = modelRoute.touristSpotList
                .filter((spot) => spot.touristSpotName)
                .map((spot) => spot.touristSpotName);

            // Batch fetch standardized names
            const standardizedNames = new Map<string, string>();
            await Promise.all(
                spotNamesToStandardize.map(async (name) => {
                    try {
                        const locationInfo = await this.locationInfoRepository.getLocationInfo(
                            name,
                            undefined,
                            undefined,
                            undefined,
                        );
                        standardizedNames.set(name, locationInfo.name);
                        Logger.log(
                            `Using standardized spot name: "${locationInfo.name}" instead of "${name}"`,
                        );
                    } catch (error) {
                        Logger.warn(`Failed to get standardized name for spot "${name}": ${error}`);
                        standardizedNames.set(name, name); // Fallback to original name
                    }
                }),
            );

            // Create standardized spots with proper type safety
            // standardizedTouristSpots = modelRoute.touristSpotList.map((spot) => {
            //     const standardizedName = spot.touristSpotName
            //         ? (standardizedNames.get(spot.touristSpotName) ?? spot.touristSpotName)
            //         : spot.touristSpotName;

            //     // Only include fields that are part of the create DTO
            //     return {
            //         touristSpotId: spot.touristSpotId,

            //         storyChapterId: spot.storyChapterId,
            //         touristSpotName: standardizedName,
            //         touristSpotDesc: spot.touristSpotDesc,
            //         bestVisitTime: spot.bestVisitTime,
            //         touristSpotHashtag: spot.touristSpotHashtag,
            //         imageSet: spot.imageSet,
            //         delFlag: spot.delFlag ?? false,
            //         updUserId: spot.updUserId ?? modelRoute.updUserId,
            //     };
            // });
        }

        // 2. Fetch region geo information if region name provided
        let regionGeoInfo: GeoInfo | undefined;
        if (modelRoute.region) {
            try {
                regionGeoInfo = await this.geoInfoRepository.getRegionInfoByRegionName(
                    modelRoute.region,
                );
                if (!regionGeoInfo) {
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_025);
                }
            } catch (error) {
                if (error instanceof TouriiBackendAppException) throw error;
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004);
            }
        }

        // 3. Create modified model route DTO with standardized names
        const modifiedModelRoute = {
            ...modelRoute,
            region: modelRoute.region,
            touristSpotList: [],
        };

        // 4. Update model route and tourist spots in a transaction
        const updated = await this.modelRouteRepository.updateModelRoute(
            ModelRouteUpdateRequestBuilder.dtoToModelRoute(modifiedModelRoute, regionGeoInfo),
        );

        if (!updated.modelRouteId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_027);
        }

        // 5. Update tourist spots in parallel after model route update succeeds
        // if (standardizedTouristSpots.length > 0) {
        //     // Get existing model route to get tourist spots
        //     const existingModelRoute = await this.modelRouteRepository.getModelRouteByModelRouteId(
        //         updated.modelRouteId,
        //     );
        //     const existingSpots = existingModelRoute.touristSpotList ?? [];
        //     const spotMap = new Map(existingSpots.map((spot) => [spot.touristSpotId, spot]));

        //     await Promise.all(
        //         standardizedTouristSpots
        //             .filter((spot) => spot.touristSpotId && spotMap.has(spot.touristSpotId))
        //             .map((spot) => {
        //                 const existingSpot = spotMap.get(spot.touristSpotId);
        //                 if (!existingSpot?.touristSpotId) return Promise.resolve();

        //                 return this.updateTouristSpot({
        //                     ...spot,
        //                     touristSpotId: existingSpot.touristSpotId,
        //                     updUserId: spot.updUserId ?? modelRoute.updUserId,
        //                     delFlag: spot.delFlag ?? false,
        //                 });
        //             }),
        //     );
        // }

        return this.getModelRouteById(updated.modelRouteId);
    }

    /**
     * Update tourist spot
     * @param touristSpot Tourist spot update request DTO
     * @returns Tourist spot response DTO
     */
    async updateTouristSpot(
        touristSpot: TouristSpotUpdateRequestDto,
    ): Promise<TouristSpotResponseDto> {
        // 1. Get existing tourist spot to check for storyChapterId transition
        let existingTouristSpot: TouristSpot | undefined;
        try {
            // Get the existing tourist spot by querying all model routes that contain it
            const modelRoutes = await this.modelRouteRepository.getModelRoutes();
            for (const route of modelRoutes) {
                if (route.touristSpotList) {
                    const spot = route.touristSpotList.find(
                        (s: TouristSpot) => s.touristSpotId === touristSpot.touristSpotId,
                    );
                    if (spot) {
                        existingTouristSpot = spot;
                        break;
                    }
                }
            }
        } catch (error) {
            Logger.warn(`Failed to fetch existing tourist spot: ${error}`);
        }

        // 2. Standardize tourist spot name using Google Places API (if provided)
        let standardizedTouristSpot = touristSpot;
        let geoInfo: GeoInfo | undefined;
        if (touristSpot.touristSpotName) {
            const standardizedSpotName = touristSpot.touristSpotName;
            try {
                // const locationInfo = await this.locationInfoRepository.getLocationInfo(
                //     touristSpot.touristSpotName,
                // );
                // standardizedSpotName = locationInfo.name;
                Logger.log(
                    `Using standardized name: "${standardizedSpotName}" instead of "${touristSpot.touristSpotName}"`,
                );
            } catch (error) {
                Logger.warn(
                    `Failed to get standardized name for "${touristSpot.touristSpotName}": ${error}`,
                );
            }

            // Fetch geo information for updated name
            // try {
            //     const geoInfoList =
            //         await this.geoInfoRepository.getGeoLocationInfoByTouristSpotNameList([
            //             standardizedSpotName,
            //         ]);
            //     if (!geoInfoList || geoInfoList.length === 0) {
            //         throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_025);
            //     }
            //     geoInfo = geoInfoList[0];
            // } catch (error) {
            //     if (error instanceof TouriiBackendAppException) throw error;
            //     throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004);
            // }

            standardizedTouristSpot = { ...touristSpot, touristSpotName: standardizedSpotName };
        }

        // 3. Update tourist spot with standardized name and geo information
        const updated = await this.modelRouteRepository.updateTouristSpot(
            TouristSpotUpdateRequestBuilder.dtoToTouristSpot(standardizedTouristSpot, geoInfo),
        );

        // 4. Handle story chapter linking based on storyChapterId changes
        const oldStoryChapterId = existingTouristSpot?.storyChapterId;
        const newStoryChapterId = updated.storyChapterId;
        
        // Check if we're transitioning from null/undefined to a valid chapter ID, or updating to a new valid chapter
        const shouldUpdateChapterLink = updated.touristSpotId && 
            newStoryChapterId && 
            (!oldStoryChapterId || oldStoryChapterId !== newStoryChapterId);

        if (shouldUpdateChapterLink) {
            Logger.log(
                `Story chapter transition detected for tourist spot ${updated.touristSpotId}: "${oldStoryChapterId}" → "${newStoryChapterId}"`,
            );
            await this.updateStoryChaptersWithTouristSpotIds([
                {
                    storyChapterId: newStoryChapterId,
                    touristSpotId: updated.touristSpotId,
                },
            ]);
        }

        // 5. Validate tourist spot name before proceeding with geo/weather lookups
        if (!updated.touristSpotName || updated.touristSpotName.trim() === '') {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        // geoInfo should already be fetched above when name is provided
        if (!geoInfo) {
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
        }

        // Fetch weather information with proper error handling
        let weatherInfo: WeatherInfo;
        try {
            const weatherInfoList = await this.weatherInfoRepository.getCurrentWeatherByGeoInfoList(
                geoInfo ? [geoInfo] : [],
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

    /**
     * Get tourist spots by story chapter ID
     * @param storyChapterId Story chapter ID
     * @returns Tourist spot response DTOs
     */
    async getTouristSpotsByStoryChapterId(
        storyChapterId: string,
    ): Promise<TouristSpotResponseDto[]> {
        const spots =
            await this.modelRouteRepository.getTouristSpotsByStoryChapterId(storyChapterId);

        if (!spots || spots.length === 0) {
            return [];
        }

        const geoInfos: GeoInfo[] = spots.map((spot) => ({
            touristSpotName: spot.touristSpotName ?? '',
            latitude: spot.latitude ?? 0,
            longitude: spot.longitude ?? 0,
            formattedAddress: spot.address ?? '',
        }));

        const weatherInfos =
            await this.weatherInfoRepository.getCurrentWeatherByGeoInfoList(geoInfos);

        return spots.map((spot) => ModelRouteResultBuilder.touristSpotToDto(spot, weatherInfos));
    }

    /**
     * Get location info
     * @param query Query string (place name)
     * @param latitude Latitude for location bias
     * @param longitude Longitude for location bias
     * @param address Address for enhanced search accuracy
     * @returns Location info response DTO
     */
    async getLocationInfo(
        query: string,
        latitude?: number,
        longitude?: number,
        address?: string,
    ): Promise<LocationInfoResponseDto> {
        const locationInfo = await this.locationInfoRepository.getLocationInfo(
            query,
            latitude,
            longitude,
            address,
        );

        return LocationInfoResultBuilder.locationInfoToDto(locationInfo);
    }

    /**
     * Delete model route
     * @param modelRouteId Model route ID
     * @returns void
     */
    async deleteModelRoute(modelRouteId: string): Promise<void> {
        await this.modelRouteRepository.deleteModelRoute(modelRouteId);
    }

    /**
     * Delete tourist spot
     * @param touristSpotId Tourist spot ID
     * @returns void
     */
    async deleteTouristSpot(touristSpotId: string): Promise<void> {
        await this.modelRouteRepository.deleteTouristSpot(touristSpotId);
    }

    // ==========================================
    // QUEST METHODS
    // ==========================================

    /**
     * Fetch quests with pagination
     * @param page
     * @param limit
     * @param isPremium
     * @param isUnlocked
     * @param questType
     * @param userId
     * @returns Quest list response DTO
     */
    async fetchQuestsWithPagination(
        page: number,
        limit: number,
        isPremium?: boolean,
        isUnlocked?: boolean,
        questType?: QuestType,
        userId?: string,
    ): Promise<QuestListResponseDto> {
        const quests = await this.questRepository.fetchQuestsWithPagination(
            page,
            limit,
            isPremium,
            isUnlocked,
            questType,
            userId,
        );

        return QuestResultBuilder.questWithPaginationToDto(quests);
    }

    /**
     * Get quest by ID
     * @param questId Quest ID
     * @param userId User ID
     * @returns Quest response DTO
     */
    async getQuestById(questId: string, userId?: string): Promise<QuestResponseDto> {
        const quest = await this.questRepository.fetchQuestById(questId, userId);
        return QuestResultBuilder.questToDto(quest);
    }

    async getQuestsByTouristSpotId(
        touristSpotId: string,
        userId?: string,
        latitude?: number,
        longitude?: number,
    ): Promise<QuestResponseDto[]> {
        // If location coordinates and userId provided, try auto-detection for presence verification
        if (userId && latitude && longitude) {
            try {
                const locationDetection = await this.locationTrackingService.detectLocationFromAPI({
                    userId,
                    latitude,
                    longitude,
                    apiSource: 'quest_spot_query',
                    confidence: 0.7,
                    metadata: {
                        touristSpotId,
                        action: 'quest_discovery',
                    },
                });

                if (locationDetection && locationDetection.nearbyTouristSpots.length > 0) {
                    // Check if the queried tourist spot is among the detected ones
                    const matchingSpot = locationDetection.nearbyTouristSpots.find(
                        (spot) => spot.touristSpotId === touristSpotId,
                    );

                    if (matchingSpot) {
                        // User is actually at the tourist spot - create travel log
                        try {
                            await this.locationTrackingService.createAutoDetectedTravelLog({
                                userId,
                                questId: matchingSpot.questId || '',
                                taskId: '', // No specific task for spot discovery
                                touristSpotId,
                                detectedLocation: { latitude, longitude },
                                checkInMethod: 'AUTO_DETECTED',
                                apiSource: 'quest_spot_query',
                                confidence: locationDetection.confidence,
                                metadata: {
                                    questDiscovery: true,
                                    detectedDistance: matchingSpot.distance,
                                    presenceVerified: true,
                                },
                            });
                            this.logger.log(
                                `Auto-detected user presence at tourist spot: ${touristSpotId}`,
                            );
                        } catch (error) {
                            this.logger.warn(`Failed to create auto-detected travel log: ${error}`);
                        }
                    }
                }
            } catch (error) {
                this.logger.warn(`Location detection failed for quest spot query: ${error}`);
            }
        }

        const quests = await this.questRepository.fetchQuestsByTouristSpotId(touristSpotId, userId);
        return quests.map((q) => QuestResultBuilder.questToDto(q));
    }

    /**
     * Create quest
     * @param dto Quest create request DTO
     * @returns Quest response DTO
     */
    async createQuest(dto: QuestCreateRequestDto): Promise<QuestResponseDto> {
        const questEntity = QuestCreateRequestBuilder.dtoToQuest(dto, 'admin');
        const created = await this.questRepository.createQuest(questEntity);
        return QuestResultBuilder.questToDto(created);
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
                              QuestUpdateRequestBuilder.dtoToQuestTask(taskDto),
                          )
                        : Promise.resolve();
                }),
            );
        }

        return QuestResultBuilder.questToDto(updated);
    }

    /**
     * Create quest task
     * @param questId Quest ID
     * @param dto Quest task create request DTO
     * @returns Task response DTO
     */
    async createQuestTask(
        questId: string,
        dto: QuestTaskCreateRequestDto,
    ): Promise<TaskResponseDto> {
        const taskEntity = QuestCreateRequestBuilder.dtoToQuestTask(dto, 'admin');
        const created = await this.questRepository.createQuestTask(taskEntity, questId);
        return QuestResultBuilder.taskToDto(created);
    }

    /**
     * Update quest task
     * @param task Quest task update request DTO
     * @returns Task response DTO
     */
    async updateQuestTask(task: QuestTaskUpdateRequestDto): Promise<TaskResponseDto> {
        const taskEntity = QuestUpdateRequestBuilder.dtoToQuestTask(task);
        const updated = await this.questRepository.updateQuestTask(taskEntity);
        return QuestResultBuilder.taskToDto(updated);
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
    async startGroupQuest(
        questId: string,
        leaderId: string,
        latitude?: number,
        longitude?: number,
    ) {
        // Validate input parameters
        if (!leaderId || typeof leaderId !== 'string' || leaderId.trim() === '') {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        const group = await this.getGroupMembers(questId);

        // Validate that the quest has a valid leader
        if (!group.leaderUserId || group.leaderUserId.trim() === '') {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
        }

        // Authorization check - only the actual leader can start the quest
        if (group.leaderUserId !== leaderId) {
            Logger.warn(
                `Unauthorized quest start attempt. Quest: ${questId}, Leader: ${group.leaderUserId}, Attempted by: ${leaderId}`,
                'TouriiBackendService',
            );
            throw new ForbiddenException('Only leader can start the quest');
        }

        // If location coordinates provided, try auto-detection for co-location verification
        if (latitude && longitude) {
            try {
                const locationDetection = await this.locationTrackingService.detectLocationFromAPI({
                    userId: leaderId,
                    latitude,
                    longitude,
                    apiSource: 'group_quest_start',
                    confidence: 0.9,
                    metadata: {
                        questId,
                        action: 'group_quest_initiation',
                        leaderUserId: leaderId,
                        memberCount: group.members.length,
                    },
                });

                if (locationDetection && locationDetection.nearbyTouristSpots.length > 0) {
                    // Find quest-related tourist spots
                    const questSpots = locationDetection.nearbyTouristSpots.filter(
                        (spot) => spot.questId === questId || spot.touristSpotId,
                    );

                    if (questSpots.length > 0) {
                        // Create travel log for quest leader's location verification
                        for (const spot of questSpots) {
                            try {
                                await this.locationTrackingService.createAutoDetectedTravelLog({
                                    userId: leaderId,
                                    questId,
                                    taskId: '', // No specific task for group quest start
                                    touristSpotId: spot.touristSpotId,
                                    detectedLocation: { latitude, longitude },
                                    checkInMethod: 'AUTO_DETECTED',
                                    apiSource: 'group_quest_start',
                                    confidence: locationDetection.confidence,
                                    metadata: {
                                        groupQuestStart: true,
                                        isLeader: true,
                                        detectedDistance: spot.distance,
                                        coLocationVerified: true,
                                        memberCount: group.members.length,
                                    },
                                });
                            } catch (error) {
                                this.logger.warn(
                                    `Failed to create group quest start travel log: ${error}`,
                                );
                            }
                        }
                        this.logger.log(
                            `Auto-detected group quest leader location for quest: ${questId}`,
                        );
                    }
                }
            } catch (error) {
                this.logger.warn(`Location detection failed for group quest start: ${error}`);
            }
        }

        // Update member statuses if there are members
        if (group.members.length > 0) {
            await this.groupQuestRepository.updateMembersStatus(
                questId,
                group.members.map((m) => m.userId),
                TaskStatus.ONGOING,
            );
        }

        // Always broadcast quest started for consistency
        this.groupQuestGateway.broadcastQuestStarted(questId);

        return { message: 'Group quest started!' };
    }

    /**
     * Delete quest
     * @param questId Quest ID
     * @returns void
     */
    async deleteQuest(questId: string): Promise<void> {
        await this.questRepository.deleteQuest(questId);
    }

    /**
     * Delete quest task
     * @param taskId Quest task ID
     * @returns void
     */
    async deleteQuestTask(taskId: string): Promise<void> {
        await this.questRepository.deleteQuestTask(taskId);
    }

    /**
     * Upload quest task photo
     * @param taskId Quest task ID
     * @param userId User ID
     * @param file File buffer and mimetype
     * @returns Quest task photo upload response DTO
     */
    async uploadQuestTaskPhoto(
        taskId: string,
        userId: string,
        file: { buffer: Buffer; mimetype: string },
    ): Promise<QuestTaskPhotoUploadResponseDto> {
        if (!file) throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.mimetype))
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);

        // Get file extension based on mimetype
        const getFileExtension = (mimetype: string): string => {
            switch (mimetype) {
                case 'image/jpeg':
                    return '.jpg';
                case 'image/png':
                    return '.png';
                case 'image/webp':
                    return '.webp';
                default:
                    return '.jpg'; // fallback
            }
        };

        const size = imageSize(file.buffer);
        if (!size.width || !size.height) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        // Check if image meets minimum dimension requirements for either landscape or portrait
        const isValidLandscape = size.width >= 1080 && size.height >= 720;
        const isValidPortrait = size.width >= 720 && size.height >= 1080;

        if (!isValidLandscape && !isValidPortrait) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        const fileExtension = getFileExtension(file.mimetype);
        const key = `quest-tasks/${taskId}/${userId}/proof${fileExtension}`;

        // Try to extract location from photo EXIF data
        let detectedLocation: { latitude: number; longitude: number } | null = null;
        try {
            detectedLocation = await this.locationTrackingService.extractLocationFromPhoto(
                file.buffer,
            );

            if (detectedLocation) {
                // Check if location matches any nearby tourist spots
                const locationDetection = await this.locationTrackingService.detectLocationFromAPI({
                    userId,
                    latitude: detectedLocation.latitude,
                    longitude: detectedLocation.longitude,
                    apiSource: 'photo_upload',
                    confidence: 0.9,
                });

                if (locationDetection && locationDetection.nearbyTouristSpots.length > 0) {
                    this.logger.debug(
                        `Found ${locationDetection.nearbyTouristSpots.length} nearby tourist spots:`,
                        {
                            spots: locationDetection.nearbyTouristSpots.map((spot) => ({
                                touristSpotId: spot.touristSpotId,
                                taskId: spot.taskId,
                                questId: spot.questId,
                                distance: spot.distance,
                            })),
                            searchingForTaskId: taskId,
                        },
                    );

                    // Find the matching tourist spot for this task
                    const matchingSpot = locationDetection.nearbyTouristSpots.find(
                        (spot) => spot.taskId === taskId,
                    );

                    if (matchingSpot) {
                        this.logger.debug(
                            `Found matching tourist spot for task ${taskId}:`,
                            matchingSpot,
                        );

                        // Auto-create travel log for detected location
                        try {
                            await this.locationTrackingService.createAutoDetectedTravelLog({
                                userId,
                                questId: matchingSpot.questId || '',
                                taskId,
                                touristSpotId: matchingSpot.touristSpotId,
                                detectedLocation,
                                checkInMethod: 'AUTO_DETECTED',
                                apiSource: 'photo_upload',
                                confidence: locationDetection.confidence,
                                metadata: {
                                    photoUpload: true,
                                    detectedDistance: matchingSpot.distance,
                                },
                            });

                            this.logger.log(
                                `Successfully created auto-detected travel log for photo upload: ${detectedLocation.latitude}, ${detectedLocation.longitude}`,
                            );
                        } catch (error) {
                            this.logger.warn('Failed to create auto-detected travel log', error);
                            // Don't fail the photo upload if travel log creation fails
                        }
                    } else {
                        this.logger.warn(
                            `No matching tourist spot found for task ${taskId}. Found spots belong to other tasks.`,
                        );
                    }
                } else {
                    this.logger.debug(
                        `No nearby tourist spots found within 1km of coordinates ${detectedLocation.latitude}, ${detectedLocation.longitude}`,
                    );
                }
            }
        } catch (error) {
            this.logger.warn('Failed to extract location from photo EXIF data', error);
            // Continue with photo upload even if location detection fails
        }

        const proofUrl = await this.r2StorageRepository.uploadProof(
            file.buffer,
            key,
            file.mimetype,
        );

        // Submit for manual verification instead of auto-completing
        await this.userTaskLogRepository.submitPhotoTaskForVerification(userId, taskId, proofUrl);

        return {
            message: 'Photo submitted successfully and pending admin verification',
            proofUrl,
            estimatedReviewTime: '24-48 hours',
        };
    }

    /**
     * Complete social sharing task
     * @param taskId Quest task ID
     * @param userId User ID
     * @param proofUrl Social media post URL
     * @param latitude Optional latitude for location tracking
     * @param longitude Optional longitude for location tracking
     * @returns Social share completion response
     */
    async completeSocialShareTask(
        taskId: string,
        userId: string,
        proofUrl: string,
        latitude?: number,
        longitude?: number,
    ): Promise<QuestTaskSocialShareResponseDto> {
        // Optional URL format validation
        this.validateSocialUrl(proofUrl);

        // If location coordinates provided, try auto-detection
        if (latitude && longitude) {
            try {
                const locationDetection = await this.locationTrackingService.detectLocationFromAPI({
                    userId,
                    latitude,
                    longitude,
                    apiSource: 'social_share',
                    confidence: 0.8,
                    metadata: {
                        taskId,
                        proofUrl,
                        action: 'social_share_completion',
                    },
                });

                if (locationDetection && locationDetection.nearbyTouristSpots.length > 0) {
                    // Find the matching tourist spot for this task
                    const matchingSpot = locationDetection.nearbyTouristSpots.find(
                        (spot) => spot.taskId === taskId,
                    );

                    if (matchingSpot) {
                        // Auto-create travel log for detected location
                        try {
                            await this.locationTrackingService.createAutoDetectedTravelLog({
                                userId,
                                questId: matchingSpot.questId || '',
                                taskId,
                                touristSpotId: matchingSpot.touristSpotId,
                                detectedLocation: { latitude, longitude },
                                checkInMethod: 'AUTO_DETECTED',
                                apiSource: 'social_share',
                                confidence: locationDetection.confidence,
                                metadata: {
                                    socialShare: true,
                                    proofUrl,
                                    detectedDistance: matchingSpot.distance,
                                },
                            });

                            this.logger.log(
                                `Auto-detected location for social share: ${latitude}, ${longitude}`,
                            );
                        } catch (error) {
                            this.logger.warn(
                                'Failed to create auto-detected travel log for social share',
                                error,
                            );
                            // Don't fail the social share if travel log creation fails
                        }
                    }
                }
            } catch (error) {
                this.logger.warn('Failed to auto-detect location for social share task', error);
                // Continue with social share completion even if location detection fails
            }
        }

        // Submit for manual verification instead of auto-completing
        await this.userTaskLogRepository.submitSocialTaskForVerification(userId, taskId, proofUrl);
        return {
            message: 'Social share submitted successfully and pending admin verification.',
            estimatedReviewTime: '24-48 hours',
        };
    }

    async submitLocalInteractionTask(
        taskId: string,
        userId: string,
        submission: LocalInteractionSubmissionDto,
    ): Promise<LocalInteractionResponseDto> {
        // Handle file upload if not text
        let contentUrl = submission.content;
        if (submission.interactionType !== 'text') {
            const fileBuffer = Buffer.from(submission.content, 'base64');
            const mimeType = submission.interactionType === 'photo' ? 'image/jpeg' : 'audio/mpeg';
            const key = `local-interactions/${taskId}/${userId}/${Date.now()}.${submission.interactionType === 'photo' ? 'jpg' : 'mp3'}`;

            contentUrl = await this.r2StorageRepository.uploadProof(fileBuffer, key, mimeType);
        }

        // Submit for verification (same pattern as photo upload)
        await this.userTaskLogRepository.submitLocalInteractionTaskForVerification(
            userId,
            taskId,
            submission.interactionType,
            contentUrl,
        );

        return {
            message: 'Local interaction submitted successfully and pending admin verification',
            status: TaskStatus.ONGOING,
            estimatedReviewTime: '24-48 hours',
        };
    }

    /**
     * Validate social media URL format (optional validation)
     * @param url Social media URL to validate
     */
    private validateSocialUrl(url: string): void {
        try {
            const parsedUrl = new URL(url);
            const domain = parsedUrl.hostname.toLowerCase();

            // List of supported social media platforms
            const supportedPlatforms = [
                'twitter.com',
                'x.com',
                'instagram.com',
                'facebook.com',
                'linkedin.com',
                'tiktok.com',
                'youtube.com',
                'reddit.com',
            ];

            const isSupported = supportedPlatforms.some(
                (platform) => domain === platform || domain === `www.${platform}`,
            );

            if (!isSupported) {
                Logger.warn(`Unsupported social platform: ${domain}`, 'TouriiBackendService');
                // Note: We don't throw an error here to be flexible with new platforms
            }
        } catch (_error) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }
    }

    // ==========================================
    // DASHBOARD METHODS
    // ==========================================

    /**
     * Retrieve a page of the most recent traveler activity moments.
     * Moments are aggregated from quests, stories, travels, item claims,
     * and invites using the `moment_view` database view.
     *
     * @param page page number (default: 1)
     * @param limit items per page (default: 10)
     * @param momentType moment type (default: MomentType.STORY)
     * @returns Moment response DTO
     */
    async getLatestMoments(
        page = 1,
        limit = 10,
        momentType?: MomentType,
    ): Promise<MomentListResponseDto> {
        const offset = (page - 1) * limit;
        const moments = await this.momentRepository.getLatest(limit, offset, momentType);

        // Handle empty moments array gracefully
        if (!moments || moments.length === 0) {
            return {
                moments: [],
                pagination: { currentPage: page, totalPages: 0, totalItems: 0 },
            };
        }

        const momentListResponseDto = moments.map((m) => {
            return {
                imageUrl: m.imageUrl,
                username: m.username,
                description: m.description,
                rewardText: m.rewardText,
                insDateTime: TransformDate.transformDateToYYYYMMDDHHmmss(m.insDateTime) ?? '',
            };
        });

        // Safely access totalItems with fallback to 0
        const totalItems = moments[0]?.totalItems ?? 0;
        const totalPages = Math.ceil(totalItems / limit);

        return {
            moments: momentListResponseDto,
            pagination: { currentPage: page, totalPages, totalItems },
        };
    }

    // ==========================================
    // HOMEPAGE METHODS
    // ==========================================

    /**
     * Get homepage highlights
     * @returns Homepage highlights response DTO
     */
    async getHomepageHighlights(): Promise<HomepageHighlightsResponseDto> {
        const [latestChapterResult, popularQuests] = await Promise.all([
            this.storyRepository.getLatestStoryChapter(),
            this.questRepository.getMostPopularQuest(),
        ]);

        const latestChapterDto = latestChapterResult
            ? {
                  storyId: latestChapterResult.storyId,
                  chapterId: latestChapterResult.chapter.storyChapterId ?? '',
                  chapterNumber: latestChapterResult.chapter.chapterNumber ?? '',
                  title: latestChapterResult.chapter.chapterTitle ?? '',
                  imageUrl: latestChapterResult.chapter.chapterImage ?? null,
                  region: latestChapterResult.sagaName ?? null,
                  link: `/v2/touriiverse/${latestChapterResult.storyId}/chapters/${latestChapterResult.chapter.storyChapterId}`,
              }
            : null;

        const popularQuestsDto = popularQuests.map((quest) => ({
            questId: quest.questId ?? '',
            title: quest.questName ?? '',
            imageUrl: quest.questImage ?? null,
            link: `/v2/quests/${quest.questId}`,
        }));

        return { latestChapter: latestChapterDto, popularQuests: popularQuestsDto };
    }

    // ==========================================
    // ADMIN VERIFICATION METHODS
    // ==========================================

    /**
     * Get pending task submissions for admin verification
     * @param options Query options with pagination and filters
     * @returns Paginated list of pending submissions
     */
    async getPendingSubmissions(options: {
        page: number;
        limit: number;
        taskType?: 'PHOTO_UPLOAD' | 'SHARE_SOCIAL' | 'ANSWER_TEXT' | 'LOCAL_INTERACTION';
    }) {
        const result = await this.userTaskLogRepository.getPendingSubmissions(options);

        return {
            submissions: result.submissions.map((submission) => ({
                userTaskLogId: submission.userTaskLogId,
                userId: submission.userId,
                username: submission.username,
                taskId: submission.taskId,
                questId: submission.questId,
                questName: submission.questName,
                taskType: submission.action,
                submissionData: submission.submissionData,
                userResponse: submission.userResponse,
                submittedAt: submission.completedAt,
                daysSinceSubmission: Math.floor(
                    (Date.now() - new Date(submission.completedAt || '').getTime()) /
                        (1000 * 60 * 60 * 24),
                ),
            })),
            pagination: {
                page: options.page,
                limit: options.limit,
                totalCount: result.totalCount,
                totalPages: Math.ceil(result.totalCount / options.limit),
            },
        };
    }

    /**
     * Manually verify (approve/reject) a task submission
     * @param userTaskLogId Task log ID to verify
     * @param action Approve or reject
     * @param adminUserId Admin user performing verification
     * @param rejectionReason Optional reason if rejecting
     * @returns Verification result
     */
    async verifyTaskSubmission(
        userTaskLogId: string,
        action: 'approve' | 'reject',
        adminUserId: string,
        rejectionReason?: string,
    ) {
        await this.userTaskLogRepository.verifySubmission(
            userTaskLogId,
            action,
            adminUserId,
            rejectionReason,
        );

        return {
            success: true,
            message: `Submission ${action}d successfully`,
            userTaskLogId,
            action,
            verifiedBy: adminUserId,
            verifiedAt: new Date().toISOString(),
            ...(rejectionReason && { rejectionReason }),
        };
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
    }

    async submitAnswerTextTask(
        taskId: string,
        answer: string,
        userId: string,
    ): Promise<SubmitTaskResponseDto> {
        // Submit for manual verification instead of auto-completing
        await this.userTaskLogRepository.submitTextTaskForVerification(userId, taskId, answer);

        return {
            success: true,
            message: 'Text answer submitted successfully and pending admin verification',
            estimatedReviewTime: '24-48 hours',
        };
    }

    async submitSelectOptionTask(
        taskId: string,
        selectedOptionIds: number[],
        userId: string,
    ): Promise<SubmitTaskResponseDto> {
        const submitResponse = await this.taskRepository.submitSelectOptionsTask(
            taskId,
            selectedOptionIds,
            userId,
        );
        return TaskResultBuilder.submitTaskResponseToDto(submitResponse);
    }

    async submitCheckInTask(
        taskId: string,
        longitude: number,
        latitude: number,
        userId: string,
    ): Promise<SubmitTaskResponseDto> {
        const submitResponse = await this.taskRepository.submitCheckInTask(
            taskId,
            longitude,
            latitude,
            userId,
        );
        return TaskResultBuilder.submitTaskResponseToDto(submitResponse);
    }

    async completeQrScanTask(
        taskId: string,
        userId: string,
        scannedCode: string,
        latitude?: number,
        longitude?: number,
    ): Promise<QrScanResponseDto> {
        // Optional location tracking for anti-cheat
        if (latitude && longitude) {
            try {
                const locationDetection = await this.locationTrackingService.detectLocationFromAPI({
                    userId,
                    latitude,
                    longitude,
                    apiSource: 'qr_scan',
                    confidence: 0.8,
                    metadata: { taskId, scannedCode, action: 'qr_scan_completion' },
                });

                // Create travel log for matching tourist spots
                await this.locationTrackingService.createAutoDetectedTravelLog({
                    userId,
                    questId: '', // Will be filled after task completion
                    taskId,
                    touristSpotId: '', // Auto-detected by location tracking
                    detectedLocation: { latitude, longitude },
                    checkInMethod: CheckInMethod.QR_CODE,
                    apiSource: 'qr_scan',
                    confidence: locationDetection?.confidence ?? 0,
                    metadata: {
                        qrCodeScanned: true,
                        qrCodeValue: scannedCode,
                        action: 'qr_scan_completion',
                    },
                });
            } catch (error) {
                this.logger.warn('Failed to auto-detect location for QR scan task', error);
                // Continue with task completion even if location tracking fails
            }
        }

        // Complete QR scan task via repository
        const result = await this.userTaskLogRepository.completeQrScanTask(
            userId,
            taskId,
            scannedCode,
        );

        return {
            success: true,
            message: 'QR code accepted and task completed successfully',
            taskId,
            questId: result.questId,
            magatama_point_awarded: result.magatama_point_awarded,
            completed_at: new Date().toISOString(),
        };
    }

    // ==========================================
    // PASSPORT METHODS
    // ==========================================

    // ---------- PDF Passport Methods ----------
    async generateAndUploadPdf(tokenId: string): Promise<PassportPdfResult> {
        try {
            this.logger.log(`Generating and uploading PDF for token ID: ${tokenId}`);

            // Validate token ID
            const isValid = await this.passportPdfRepository.validateTokenId(tokenId);
            if (!isValid) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
            }

            // Generate PDF
            const pdfData = await this.passportPdfRepository.generatePdf(tokenId);

            // Upload to R2 storage
            const uploadKey = `${tokenId}-${Date.now()}.pdf`;
            const downloadUrl = await this.r2StorageRepository.uploadPassportPdf(
                pdfData.pdfBuffer,
                uploadKey,
            );

            return {
                tokenId,
                downloadUrl,
                qrCode: pdfData.qrCode,
                expiresAt: pdfData.expiresAt,
            };
        } catch (error) {
            this.logger.error(`Failed to generate and upload PDF for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async generatePdfPreview(tokenId: string): Promise<Buffer> {
        try {
            this.logger.log(`Generating PDF preview for token ID: ${tokenId}`);

            // Validate token ID
            const isValid = await this.passportPdfRepository.validateTokenId(tokenId);
            if (!isValid) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
            }

            // Generate PDF
            const pdfData = await this.passportPdfRepository.generatePdf(tokenId);
            return pdfData.pdfBuffer;
        } catch (error) {
            this.logger.error(`Failed to generate PDF preview for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async downloadPdf(tokenId: string): Promise<Buffer> {
        try {
            this.logger.log(`Downloading PDF for token ID: ${tokenId}`);

            // Validate token ID
            const isValid = await this.passportPdfRepository.validateTokenId(tokenId);
            if (!isValid) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
            }

            // Generate PDF on-demand
            const pdfData = await this.passportPdfRepository.generatePdf(tokenId);
            return pdfData.pdfBuffer;
        } catch (error) {
            this.logger.error(`Failed to download PDF for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async validateToken(tokenId: string): Promise<boolean> {
        return this.passportPdfRepository.validateTokenId(tokenId);
    }

    async refreshPdf(tokenId: string): Promise<PassportPdfResult> {
        return this.generateAndUploadPdf(tokenId);
    }

    // ---------- Wallet Pass Methods ----------
    async generateApplePass(tokenId: string): Promise<WalletPassResult> {
        try {
            this.logger.log(`Generating Apple Wallet pass for token ID: ${tokenId}`);

            const passData = await this.walletPassRepository.generateApplePass(tokenId);

            // Return the pass with buffer for direct download
            return {
                tokenId,
                platform: 'apple',
                redirectUrl: passData.passUrl,
                expiresAt: passData.expiresAt,
                passBuffer: passData.passBuffer,
            };
        } catch (error) {
            this.logger.error(`Failed to generate Apple pass for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async generateGooglePass(tokenId: string): Promise<WalletPassResult> {
        try {
            this.logger.log(`Generating Google Pay pass for token ID: ${tokenId}`);

            const passData = await this.walletPassRepository.generateGooglePass(tokenId);

            // Return the Google Pay save URL and pass buffer
            return {
                tokenId,
                platform: 'google',
                redirectUrl: passData.passUrl,
                expiresAt: passData.expiresAt,
                passBuffer: passData.passBuffer,
            };
        } catch (error) {
            this.logger.error(`Failed to generate Google pass for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async generateAutoPass(tokenId: string, userAgent: string): Promise<WalletPassResult> {
        try {
            this.logger.log(`Auto-generating wallet pass for token ID: ${tokenId}`);

            const deviceInfo = this.walletPassRepository.detectPlatform(userAgent);
            const passData = await this.walletPassRepository.generateAutoPass(tokenId, deviceInfo);

            // Upload Apple passes to R2 for download
            if (passData.platform === 'apple' && passData.passBuffer) {
                const uploadKey = `${tokenId}-apple-${Date.now()}.pkpass`;
                const downloadUrl = await this.r2StorageRepository.uploadWalletPass(
                    passData.passBuffer,
                    uploadKey,
                    'application/vnd.apple.pkpass',
                );

                return {
                    tokenId,
                    platform: 'apple',
                    downloadUrl,
                    redirectUrl: passData.passUrl,
                    expiresAt: passData.expiresAt,
                    passBuffer: passData.passBuffer,
                };
            }

            return {
                tokenId,
                platform: passData.platform as 'apple' | 'google',
                redirectUrl: passData.passUrl,
                expiresAt: passData.expiresAt,
            };
        } catch (error) {
            this.logger.error(`Failed to auto-generate pass for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async generateBothPasses(tokenId: string): Promise<BothWalletPassesResult> {
        try {
            this.logger.log(`Generating both wallet passes for token ID: ${tokenId}`);

            const [appleData, googleData] = await Promise.all([
                this.walletPassRepository.generateApplePass(tokenId),
                this.walletPassRepository.generateGooglePass(tokenId),
            ]);

            const apple: WalletPassResult = {
                tokenId,
                platform: 'apple',
                redirectUrl: appleData.passUrl,
                expiresAt: appleData.expiresAt,
                passBuffer: appleData.passBuffer,
            };

            const google: WalletPassResult = {
                tokenId,
                platform: 'google',
                redirectUrl: googleData.passUrl,
                expiresAt: googleData.expiresAt,
            };

            return { tokenId, apple, google };
        } catch (error) {
            this.logger.error(`Failed to generate both passes for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async updatePass(tokenId: string, platform: 'apple' | 'google'): Promise<WalletPassResult> {
        if (platform === 'apple') {
            return this.generateApplePass(tokenId);
        } else {
            return this.generateGooglePass(tokenId);
        }
    }

    async revokePass(tokenId: string, platform: 'apple' | 'google'): Promise<boolean> {
        try {
            this.logger.log(`Revoking ${platform} pass for token ID: ${tokenId}`);
            return await this.walletPassRepository.revokePass(tokenId, platform);
        } catch (error) {
            this.logger.error(`Failed to revoke ${platform} pass for token ID ${tokenId}:`, error);
            return false;
        }
    }

    detectPlatform(userAgent: string): DeviceInfo {
        return this.walletPassRepository.detectPlatform(userAgent);
    }

    async getPassStatus(tokenId: string): Promise<{ apple: boolean; google: boolean }> {
        try {
            // For now, return both as available - could be extended with actual status checking
            return { apple: true, google: true };
        } catch (error) {
            this.logger.error(`Failed to get pass status for token ID ${tokenId}:`, error);
            return { apple: false, google: false };
        }
    }

    // ---------- Passport Verification Methods ----------
    async verifyPassport(verificationCode: string): Promise<VerificationResult> {
        try {
            this.logger.log(
                `Verifying passport with code: ${verificationCode.substring(0, 10)}...`,
            );

            // Decode and verify JWT token
            const payload: QrCodePayload = this.jwtRepository.verifyQrToken(verificationCode);

            if (!payload || !payload.tokenId) {
                return {
                    valid: false,
                    tokenId: '',
                    verifiedAt: new Date(),
                    error: 'Invalid or expired verification code',
                };
            }

            // Get passport metadata
            const metadata = await this.passportMetadataRepository.generateMetadata(
                payload.tokenId,
            );

            // Extract passport data
            const passportData = {
                username:
                    (metadata.attributes.find((a) => a.trait_type === 'Username')
                        ?.value as string) || 'Unknown',
                level:
                    (metadata.attributes.find((a) => a.trait_type === 'Level')?.value as string) ||
                    'Unknown',
                passportType:
                    (metadata.attributes.find((a) => a.trait_type === 'Passport Type')
                        ?.value as string) || 'Standard',
                questsCompleted:
                    (metadata.attributes.find((a) => a.trait_type === 'Quests Completed')
                        ?.value as number) || 0,
                travelDistance:
                    (metadata.attributes.find((a) => a.trait_type === 'Travel Distance')
                        ?.value as number) || 0,
                magatamaPoints:
                    (metadata.attributes.find((a) => a.trait_type === 'Magatama Points')
                        ?.value as number) || 0,
                registeredAt: new Date(), // Would come from actual user data
            };

            // TODO: Update verification stats in database

            return {
                valid: true,
                tokenId: payload.tokenId,
                verifiedAt: new Date(),
                expiresAt: new Date((payload['exp'] as number) * 1000),
                passportData,
            };
        } catch (error) {
            this.logger.error('Failed to verify passport:', error);
            return {
                valid: false,
                tokenId: '',
                verifiedAt: new Date(),
                error: (error as Error).message || 'Verification failed',
            };
        }
    }

    async batchVerifyPassports(
        request: BatchVerificationRequest,
    ): Promise<BatchVerificationResult> {
        try {
            this.logger.log(`Batch verifying ${request.tokens.length} passports`);

            const results = await Promise.all(
                request.tokens.map((token) => this.verifyPassport(token)),
            );

            const summary = {
                total: results.length,
                valid: results.filter((r) => r.valid).length,
                invalid: results.filter((r) => !r.valid).length,
            };

            return { results, summary };
        } catch (error) {
            this.logger.error('Failed to batch verify passports:', error);
            throw error;
        }
    }

    async verifyQrCode(qrCode: string): Promise<VerificationResult> {
        return this.verifyPassport(qrCode);
    }

    async getVerificationStats(tokenId?: string): Promise<VerificationStats> {
        try {
            this.logger.log(`Getting verification stats${tokenId ? ` for token ${tokenId}` : ''}`);

            // TODO: Implement actual stats from database
            // For now, return mock data
            return {
                tokenId,
                totalVerifications: 0,
                todayVerifications: 0,
                lastVerified: undefined,
                popularPassports: [],
            };
        } catch (error) {
            this.logger.error('Failed to get verification stats:', error);
            throw error;
        }
    }
}

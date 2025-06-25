import { Test, TestingModule } from '@nestjs/testing';
import { TouriiBackendService } from './tourii-backend.service';
import { TouriiBackendConstants } from '../tourii-backend.constant';
import { CachingService } from '@app/core/provider/caching.service';
import { UserRepository } from '@app/core/domain/user/user.repository';
import { StoryRepository } from '@app/core/domain/game/story/story.repository';
import { ModelRouteRepository } from '@app/core/domain/game/model-route/model-route.repository';
import { GeoInfoRepository } from '@app/core/domain/geo/geo-info.repository';
import { WeatherInfoRepository } from '@app/core/domain/geo/weather-info.repository';
import { LocationInfoRepository } from '@app/core/domain/geo/location-info.repository';
import { QuestRepository } from '@app/core/domain/game/quest/quest.repository';
import { EncryptionRepository } from '@app/core/domain/auth/encryption.repository';
import { UserStoryLogRepository } from '@app/core/domain/game/story/user-story-log.repository';
import { DigitalPassportRepository } from '@app/core/domain/passport/digital-passport.repository';
import { GroupQuestRepository } from '@app/core/domain/game/quest/group-quest.repository';
import { MomentRepository } from '@app/core/domain/feed/moment.repository';
import { R2StorageRepository } from '@app/core/domain/storage/r2-storage.repository';
import { UserTaskLogRepository } from '@app/core/domain/game/quest/user-task-log.repository';
import { TaskRepository } from '@app/core/domain/game/quest/task.repository';
import { UserTravelLogRepository } from '@app/core/domain/user/user-travel-log.repository';
import { LocationTrackingService } from '@app/core/domain/location/location-tracking.service';
import { GroupQuestGateway } from '../group-quest/group-quest.gateway';
import { UserEntity } from '@app/core/domain/user/user.entity';
import { UserRoleType, StoryStatus, TaskStatus } from '@prisma/client';

describe('TouriiBackendService - Dashboard Statistics', () => {
    let service: TouriiBackendService;
    let cachingService: CachingService;
    let userRepository: UserRepository;
    let userStoryLogRepository: UserStoryLogRepository;
    let userTaskLogRepository: UserTaskLogRepository;
    let module: TestingModule;

    // Mock user data for testing
    const mockUserId = 'test-user-id';
    const createMockUser = () => new UserEntity(
        {
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashed-password',
            perksWalletAddress: '0x123456789',
            isPremium: false,
            totalQuestCompleted: 5,
            totalTravelDistance: 0,
            role: UserRoleType.USER,
            registeredAt: new Date(),
            discordJoinedAt: new Date(),
            isBanned: false,
            delFlag: false,
            insUserId: 'system',
            insDateTime: new Date(),
            updUserId: 'system',
            updDateTime: new Date(),
            userAchievements: [
                { id: '1', userId: mockUserId, achievementId: 'ach1', awardedAt: new Date() } as any,
                { id: '2', userId: mockUserId, achievementId: 'ach2', awardedAt: new Date() } as any
            ],
            userTaskLogs: [
                { 
                    id: 'task1', 
                    status: TaskStatus.COMPLETED, 
                    totalMagatamaPointAwarded: 100, 
                    questId: 'quest1',
                    userId: mockUserId,
                    taskId: 'task1'
                } as any,
                { 
                    id: 'task2', 
                    status: TaskStatus.COMPLETED, 
                    totalMagatamaPointAwarded: 50, 
                    questId: 'quest2',
                    userId: mockUserId,
                    taskId: 'task2'
                } as any,
                { 
                    id: 'task3', 
                    status: TaskStatus.ONGOING, 
                    questId: 'quest3',
                    userId: mockUserId,
                    taskId: 'task3'
                } as any
            ],
            userStoryLogs: [
                { 
                    id: 'story1', 
                    status: StoryStatus.COMPLETED,
                    userId: mockUserId,
                    storyChapterId: 'completed-chapter'
                } as any,
                { 
                    id: 'story2', 
                    status: StoryStatus.IN_PROGRESS, 
                    updDateTime: new Date(), 
                    storyChapterId: 'chapter1',
                    userId: mockUserId
                } as any
            ],
            userTravelLogs: [
                { id: '1', userId: mockUserId } as any, 
                { id: '2', userId: mockUserId } as any, 
                { id: '3', userId: mockUserId } as any
            ]
        },
        mockUserId
    );

    const createEmptyMockUser = () => new UserEntity(
        {
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashed-password',
            perksWalletAddress: '0x123456789',
            isPremium: false,
            totalQuestCompleted: 0,
            totalTravelDistance: 0,
            role: UserRoleType.USER,
            registeredAt: new Date(),
            discordJoinedAt: new Date(),
            isBanned: false,
            delFlag: false,
            insUserId: 'system',
            insDateTime: new Date(),
            updUserId: 'system',
            updDateTime: new Date(),
            userAchievements: [],
            userTaskLogs: [],
            userStoryLogs: [],
            userTravelLogs: []
        },
        mockUserId
    );

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                TouriiBackendService,
                {
                    provide: TouriiBackendConstants.USER_REPOSITORY_TOKEN,
                    useValue: {
                        getUserInfoByUserId: jest.fn(),
                    },
                },
                {
                    provide: TouriiBackendConstants.STORY_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.MODEL_ROUTE_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.GEO_INFO_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.WEATHER_INFO_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.LOCATION_INFO_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.QUEST_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.ENCRYPTION_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.USER_STORY_LOG_REPOSITORY_TOKEN,
                    useValue: {
                        completeStoryWithQuestUnlocking: jest.fn(),
                    },
                },
                {
                    provide: TouriiBackendConstants.DIGITAL_PASSPORT_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.GROUP_QUEST_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.MOMENT_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.R2_STORAGE_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.USER_TASK_LOG_REPOSITORY_TOKEN,
                    useValue: {
                        getUserTaskLog: jest.fn(),
                        verifySubmission: jest.fn(),
                        completeQrScanTask: jest.fn(),
                    },
                },
                {
                    provide: TouriiBackendConstants.TASK_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.USER_TRAVEL_LOG_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.LOCATION_TRACKING_SERVICE_TOKEN,
                    useValue: {},
                },
                {
                    provide: GroupQuestGateway,
                    useValue: {},
                },
                {
                    provide: CachingService,
                    useValue: {
                        getOrSet: jest.fn(),
                        invalidate: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<TouriiBackendService>(TouriiBackendService);
        cachingService = module.get<CachingService>(CachingService);
        userRepository = module.get<UserRepository>(TouriiBackendConstants.USER_REPOSITORY_TOKEN);
        userStoryLogRepository = module.get<UserStoryLogRepository>(TouriiBackendConstants.USER_STORY_LOG_REPOSITORY_TOKEN);
        userTaskLogRepository = module.get<UserTaskLogRepository>(TouriiBackendConstants.USER_TASK_LOG_REPOSITORY_TOKEN);
    });

    describe('getUserProfile with dashboard stats', () => {
        it('should calculate dashboard statistics correctly', async () => {
            // Arrange
            const mockUser = createMockUser();
            jest.spyOn(userRepository, 'getUserInfoByUserId').mockResolvedValue(mockUser);
            
            const expectedStats = {
                achievementCount: 2,
                completedQuestsCount: 5,
                completedStoriesCount: 1,
                totalCheckinsCount: 3,
                totalMagatamaPoints: 150,
                activeQuestsCount: 1, // unique quests with in-progress tasks
                readingProgress: {
                    currentChapterId: 'chapter1',
                    currentChapterTitle: undefined, // Not stored in user_story_log table
                    completionPercentage: undefined, // Not stored in user_story_log table
                },
            };

            jest.spyOn(cachingService, 'getOrSet').mockImplementation(async (key, fetchFn) => {
                return await fetchFn();
            });

            // Act
            const result = await service.getUserProfile(mockUserId, true);

            // Assert
            expect(result.dashboardStats).toEqual(expectedStats);
            expect(cachingService.getOrSet).toHaveBeenCalledWith(
                `user:${mockUserId}:dashboard-stats`,
                expect.any(Function),
                300
            );
        });

        it('should use cached dashboard statistics when available', async () => {
            // Arrange
            const mockUser = createMockUser();
            jest.spyOn(userRepository, 'getUserInfoByUserId').mockResolvedValue(mockUser);
            
            const cachedStats = {
                achievementCount: 10,
                completedQuestsCount: 20,
                completedStoriesCount: 5,
                totalCheckinsCount: 15,
                totalMagatamaPoints: 500,
                activeQuestsCount: 3,
            };

            jest.spyOn(cachingService, 'getOrSet').mockResolvedValue(cachedStats);

            // Act
            const result = await service.getUserProfile(mockUserId, true);

            // Assert
            expect(result.dashboardStats).toEqual(cachedStats);
            expect(cachingService.getOrSet).toHaveBeenCalledTimes(1);
        });

        it('should not include dashboard stats when not requested', async () => {
            // Arrange
            const mockUser = createMockUser();
            jest.spyOn(userRepository, 'getUserInfoByUserId').mockResolvedValue(mockUser);

            // Act
            const result = await service.getUserProfile(mockUserId, false);

            // Assert
            expect(result.dashboardStats).toBeUndefined();
            expect(cachingService.getOrSet).not.toHaveBeenCalled();
        });

        it('should handle users with no activity gracefully', async () => {
            // Arrange
            const emptyUser = createEmptyMockUser();

            jest.spyOn(userRepository, 'getUserInfoByUserId').mockResolvedValue(emptyUser);
            jest.spyOn(cachingService, 'getOrSet').mockImplementation(async (key, fetchFn) => {
                return await fetchFn();
            });

            // Act
            const result = await service.getUserProfile(mockUserId, true);

            // Assert
            expect(result.dashboardStats).toEqual({
                achievementCount: 0,
                completedQuestsCount: 0,
                completedStoriesCount: 0,
                totalCheckinsCount: 0,
                totalMagatamaPoints: 0,
                activeQuestsCount: 0,
                readingProgress: undefined,
            });
        });
    });

    describe('cache invalidation', () => {
        it('should invalidate dashboard cache after story completion', async () => {
            // Arrange
            const mockResult = { success: true };
            
            jest.spyOn(userStoryLogRepository, 'completeStoryWithQuestUnlocking').mockResolvedValue(mockResult as any);
            jest.spyOn(cachingService, 'invalidate').mockResolvedValue();

            // Act
            await service.completeStoryWithQuestUnlocking(mockUserId, 'chapter-id');

            // Assert
            expect(cachingService.invalidate).toHaveBeenCalledWith(`user:${mockUserId}:dashboard-stats`);
        });

        it('should invalidate dashboard cache after task approval', async () => {
            // Arrange
            const mockTaskLog = { userId: mockUserId };
            
            jest.spyOn(userTaskLogRepository, 'getUserTaskLog').mockResolvedValue(mockTaskLog as any);
            jest.spyOn(userTaskLogRepository, 'verifySubmission').mockResolvedValue();
            jest.spyOn(cachingService, 'invalidate').mockResolvedValue();

            // Act
            await service.verifyTaskSubmission('task-log-id', 'approve', 'admin-id');

            // Assert
            expect(cachingService.invalidate).toHaveBeenCalledWith(`user:${mockUserId}:dashboard-stats`);
        });

        it('should not invalidate cache when task is rejected', async () => {
            // Arrange
            const mockTaskLog = { userId: mockUserId };
            
            jest.spyOn(userTaskLogRepository, 'getUserTaskLog').mockResolvedValue(mockTaskLog as any);
            jest.spyOn(userTaskLogRepository, 'verifySubmission').mockResolvedValue();
            jest.spyOn(cachingService, 'invalidate').mockResolvedValue();

            // Act
            await service.verifyTaskSubmission('task-log-id', 'reject', 'admin-id', 'Reason');

            // Assert
            expect(cachingService.invalidate).not.toHaveBeenCalled();
        });

        it('should invalidate dashboard cache after QR scan completion', async () => {
            // Arrange
            const mockResult = { questId: 'quest-id', magatama_point_awarded: 100 };
            
            jest.spyOn(userTaskLogRepository, 'completeQrScanTask').mockResolvedValue(mockResult as any);
            jest.spyOn(cachingService, 'invalidate').mockResolvedValue();

            // Act
            await service.completeQrScanTask('task-id', mockUserId, 'scanned-code');

            // Assert
            expect(cachingService.invalidate).toHaveBeenCalledWith(`user:${mockUserId}:dashboard-stats`);
        });
    });
});
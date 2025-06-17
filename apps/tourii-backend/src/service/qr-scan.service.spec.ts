import { Test, TestingModule } from '@nestjs/testing';
import { TouriiBackendService } from './tourii-backend.service';
import { UserTaskLogRepository } from '@app/core/domain/game/quest/user-task-log.repository';
import { LocationTrackingService } from '@app/core/domain/location/location-tracking.service';
import { Logger } from '@nestjs/common';
import { TouriiBackendConstants } from '../tourii-backend.constant';

describe('TouriiBackendService - QR Scan', () => {
    let service: TouriiBackendService;
    let userTaskLogRepository: jest.Mocked<UserTaskLogRepository>;
    let locationTrackingService: jest.Mocked<LocationTrackingService>;

    const mockUserTaskLogRepository = {
        completeQrScanTask: jest.fn(),
        completePhotoTask: jest.fn(),
        completeSocialTask: jest.fn(),
    };

    const mockLocationTrackingService = {
        detectLocationFromAPI: jest.fn(),
        createAutoDetectedTravelLog: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TouriiBackendService,
                {
                    provide: TouriiBackendConstants.USER_TASK_LOG_REPOSITORY_TOKEN,
                    useValue: mockUserTaskLogRepository,
                },
                {
                    provide: TouriiBackendConstants.LOCATION_TRACKING_SERVICE_TOKEN,
                    useValue: mockLocationTrackingService,
                },
                // Add other required dependencies as mocks
                {
                    provide: TouriiBackendConstants.USER_REPOSITORY_TOKEN,
                    useValue: {},
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
                    provide: TouriiBackendConstants.QUEST_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.MOMENT_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.USER_STORY_LOG_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.USER_TRAVEL_LOG_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.GROUP_QUEST_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.LOCATION_TRACKING_SERVICE_TOKEN,
                    useValue: mockLocationTrackingService,
                },
                {
                    provide: TouriiBackendConstants.LOCATION_INFO_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.R2_STORAGE_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.ENCRYPTION_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: TouriiBackendConstants.DIGITAL_PASSPORT_REPOSITORY_TOKEN,
                    useValue: {},
                },
                {
                    provide: 'GroupQuestGateway',
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<TouriiBackendService>(TouriiBackendService);
        userTaskLogRepository = module.get(TouriiBackendConstants.USER_TASK_LOG_REPOSITORY_TOKEN);
        locationTrackingService = module.get(TouriiBackendConstants.LOCATION_TRACKING_SERVICE_TOKEN);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('completeQrScanTask', () => {
        const taskId = 'test-task-id';
        const userId = 'test-user-id';
        const scannedCode = 'VALID_QR_CODE_123';
        const questId = 'test-quest-id';
        const magatama_point_awarded = 100;

        const mockRepositoryResult = {
            questId,
            magatama_point_awarded,
        };

        it('should complete QR scan task successfully without location', async () => {
            userTaskLogRepository.completeQrScanTask.mockResolvedValue(mockRepositoryResult);

            const result = await service.completeQrScanTask(taskId, userId, scannedCode);

            expect(result).toEqual({
                success: true,
                message: 'QR code accepted and task completed successfully',
                taskId,
                questId,
                magatama_point_awarded,
                completed_at: expect.any(String),
            });

            expect(userTaskLogRepository.completeQrScanTask).toHaveBeenCalledWith(
                userId,
                taskId,
                scannedCode,
            );

            expect(locationTrackingService.detectLocationFromAPI).not.toHaveBeenCalled();
        });

        it('should complete QR scan task with location tracking', async () => {
            const latitude = 35.6762;
            const longitude = 139.6503;

            const mockLocationDetection = { confidence: 0.9 };
            locationTrackingService.detectLocationFromAPI.mockResolvedValue(mockLocationDetection);
            locationTrackingService.createAutoDetectedTravelLog.mockResolvedValue(undefined);
            userTaskLogRepository.completeQrScanTask.mockResolvedValue(mockRepositoryResult);

            const result = await service.completeQrScanTask(
                taskId,
                userId,
                scannedCode,
                latitude,
                longitude,
            );

            expect(result).toEqual({
                success: true,
                message: 'QR code accepted and task completed successfully',
                taskId,
                questId,
                magatama_point_awarded,
                completed_at: expect.any(String),
            });

            expect(locationTrackingService.detectLocationFromAPI).toHaveBeenCalledWith({
                userId,
                latitude,
                longitude,
                apiSource: 'qr_scan',
                confidence: 0.8,
                metadata: { taskId, scannedCode, action: 'qr_scan_completion' },
            });

            expect(userTaskLogRepository.completeQrScanTask).toHaveBeenCalledWith(
                userId,
                taskId,
                scannedCode,
            );
        });

        it('should continue with task completion even if location tracking fails', async () => {
            const latitude = 35.6762;
            const longitude = 139.6503;

            locationTrackingService.detectLocationFromAPI.mockRejectedValue(
                new Error('Location API error'),
            );
            userTaskLogRepository.completeQrScanTask.mockResolvedValue(mockRepositoryResult);

            const result = await service.completeQrScanTask(
                taskId,
                userId,
                scannedCode,
                latitude,
                longitude,
            );

            expect(result).toEqual({
                success: true,
                message: 'QR code accepted and task completed successfully',
                taskId,
                questId,
                magatama_point_awarded,
                completed_at: expect.any(String),
            });

            expect(userTaskLogRepository.completeQrScanTask).toHaveBeenCalledWith(
                userId,
                taskId,
                scannedCode,
            );
        });
    });
});
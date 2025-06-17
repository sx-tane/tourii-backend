import { Test, TestingModule } from '@nestjs/testing';
import { TouriiBackendController } from './tourii-backend.controller';
import { TouriiBackendService } from '../service/tourii-backend.service';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { QrScanRequestDto } from './model/tourii-request/create/qr-scan-request.model';
import { QrScanResponseDto } from './model/tourii-response/qr-scan-response.model';

describe('TouriiBackendController - QR Scan', () => {
    let controller: TouriiBackendController;
    let service: TouriiBackendService;

    const mockTouriiBackendService = {
        completeQrScanTask: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TouriiBackendController],
            providers: [
                {
                    provide: TouriiBackendService,
                    useValue: mockTouriiBackendService,
                },
            ],
        }).compile();

        controller = module.get<TouriiBackendController>(TouriiBackendController);
        service = module.get<TouriiBackendService>(TouriiBackendService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('completeQrScanTask', () => {
        const mockRequest = {
            headers: {
                'x-user-id': 'test-user-id',
            },
        } as any;

        const validQrScanRequest: QrScanRequestDto = {
            code: 'VALID_QR_CODE_123',
            latitude: 35.6762,
            longitude: 139.6503,
        };

        const expectedResponse: QrScanResponseDto = {
            success: true,
            message: 'QR code accepted and task completed successfully',
            taskId: 'test-task-id',
            questId: 'test-quest-id',
            magatama_point_awarded: 100,
            completed_at: '2023-01-01T00:00:00.000Z',
        };

        it('should complete QR scan task successfully', async () => {
            mockTouriiBackendService.completeQrScanTask.mockResolvedValue(expectedResponse);

            const result = await controller.completeQrScanTask(
                'test-task-id',
                validQrScanRequest,
                mockRequest,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockTouriiBackendService.completeQrScanTask).toHaveBeenCalledWith(
                'test-task-id',
                'test-user-id',
                'VALID_QR_CODE_123',
                35.6762,
                139.6503,
            );
        });

        it('should complete QR scan task without location', async () => {
            const requestWithoutLocation: QrScanRequestDto = {
                code: 'VALID_QR_CODE_123',
            };

            mockTouriiBackendService.completeQrScanTask.mockResolvedValue(expectedResponse);

            const result = await controller.completeQrScanTask(
                'test-task-id',
                requestWithoutLocation,
                mockRequest,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockTouriiBackendService.completeQrScanTask).toHaveBeenCalledWith(
                'test-task-id',
                'test-user-id',
                'VALID_QR_CODE_123',
                undefined,
                undefined,
            );
        });

        it('should throw exception when user ID is missing', async () => {
            const requestWithoutUserId = {
                headers: {},
            } as any;

            await expect(
                controller.completeQrScanTask(
                    'test-task-id',
                    validQrScanRequest,
                    requestWithoutUserId,
                ),
            ).rejects.toThrow(TouriiBackendAppException);

            expect(mockTouriiBackendService.completeQrScanTask).not.toHaveBeenCalled();
        });

        it('should handle service errors properly', async () => {
            const serviceError = new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_028);
            mockTouriiBackendService.completeQrScanTask.mockRejectedValue(serviceError);

            await expect(
                controller.completeQrScanTask(
                    'test-task-id',
                    validQrScanRequest,
                    mockRequest,
                ),
            ).rejects.toThrow(serviceError);
        });
    });
});
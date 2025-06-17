import { Test, TestingModule } from '@nestjs/testing';
import { UserTaskLogRepositoryDb } from './user-task-log.repository-db';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { UserMapper } from '../mapper/user.mapper';

describe('UserTaskLogRepositoryDb - QR Scan', () => {
    let repository: UserTaskLogRepositoryDb;
    let prismaService: jest.Mocked<PrismaService>;

    const mockPrismaService = {
        quest_task: {
            findUnique: jest.fn(),
        },
        user_task_log: {
            findUnique: jest.fn(),
            upsert: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserTaskLogRepositoryDb,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        repository = module.get<UserTaskLogRepositoryDb>(UserTaskLogRepositoryDb);
        prismaService = module.get(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('completeQrScanTask', () => {
        const userId = 'test-user-id';
        const taskId = 'test-task-id';
        const qrCodeValue = 'VALID_QR_CODE_123';
        const questId = 'test-quest-id';
        const magatama_point_awarded = 100;

        const mockTask = {
            quest_id: questId,
            task_type: 'CHECK_IN',
            required_action: JSON.stringify({ qr_code_value: 'VALID_QR_CODE_123' }),
            magatama_point_awarded,
        };

        it('should complete QR scan task successfully', async () => {
            prismaService.quest_task.findUnique.mockResolvedValue(mockTask);
            prismaService.user_task_log.findUnique.mockResolvedValue(null);
            prismaService.user_task_log.upsert.mockResolvedValue({} as any);

            const result = await repository.completeQrScanTask(userId, taskId, qrCodeValue);

            expect(result).toEqual({
                questId,
                magatama_point_awarded,
            });

            expect(prismaService.quest_task.findUnique).toHaveBeenCalledWith({
                where: { quest_task_id: taskId },
                select: {
                    quest_id: true,
                    task_type: true,
                    required_action: true,
                    magatama_point_awarded: true,
                },
            });

            expect(prismaService.user_task_log.findUnique).toHaveBeenCalledWith({
                where: {
                    user_id_quest_id_task_id: {
                        user_id: userId,
                        quest_id: questId,
                        task_id: taskId,
                    },
                },
            });

            expect(prismaService.user_task_log.upsert).toHaveBeenCalled();
        });

        it('should throw error if task not found', async () => {
            prismaService.quest_task.findUnique.mockResolvedValue(null);

            await expect(
                repository.completeQrScanTask(userId, taskId, qrCodeValue),
            ).rejects.toThrow(TouriiBackendAppException);

            expect(prismaService.user_task_log.findUnique).not.toHaveBeenCalled();
        });

        it('should throw error if task type is not CHECK_IN', async () => {
            const invalidTask = {
                ...mockTask,
                task_type: 'PHOTO_UPLOAD',
            };

            prismaService.quest_task.findUnique.mockResolvedValue(invalidTask);

            await expect(
                repository.completeQrScanTask(userId, taskId, qrCodeValue),
            ).rejects.toThrow(TouriiBackendAppException);
        });

        it('should throw error if QR code does not match', async () => {
            const taskWithDifferentQR = {
                ...mockTask,
                required_action: JSON.stringify({ qr_code_value: 'DIFFERENT_CODE' }),
            };

            prismaService.quest_task.findUnique.mockResolvedValue(taskWithDifferentQR);

            await expect(
                repository.completeQrScanTask(userId, taskId, qrCodeValue),
            ).rejects.toThrow(TouriiBackendAppException);
        });

        it('should throw error if task already completed', async () => {
            const existingLog = {
                user_id: userId,
                quest_id: questId,
                task_id: taskId,
            };

            prismaService.quest_task.findUnique.mockResolvedValue(mockTask);
            prismaService.user_task_log.findUnique.mockResolvedValue(existingLog);

            await expect(
                repository.completeQrScanTask(userId, taskId, qrCodeValue),
            ).rejects.toThrow(TouriiBackendAppException);

            expect(prismaService.user_task_log.upsert).not.toHaveBeenCalled();
        });

        it('should throw error if required_action is invalid JSON', async () => {
            const invalidTask = {
                ...mockTask,
                required_action: 'invalid json',
            };

            prismaService.quest_task.findUnique.mockResolvedValue(invalidTask);

            await expect(
                repository.completeQrScanTask(userId, taskId, qrCodeValue),
            ).rejects.toThrow(TouriiBackendAppException);
        });
    });
});
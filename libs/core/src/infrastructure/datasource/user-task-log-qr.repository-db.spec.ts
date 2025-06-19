import { Test, TestingModule } from '@nestjs/testing';
import { UserTaskLogRepositoryDb } from './user-task-log.repository-db';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { UserMapper } from '../mapper/user.mapper';

// Mock the security utils to avoid delays in tests
jest.mock('@app/core/utils/security-utils', () => ({
    constantTimeStringCompare: jest.fn((a: string, b: string) => a === b),
    randomDelay: jest.fn(() => Promise.resolve()),
}));

describe('UserTaskLogRepositoryDb - QR Scan', () => {
    let repository: UserTaskLogRepositoryDb;
    let prismaService: jest.Mocked<PrismaService>;

    const mockTransactionPrisma = {
        quest_task: {
            findUnique: jest.fn(),
        },
        user_task_log: {
            findUnique: jest.fn(),
            upsert: jest.fn(),
        },
    };

    const mockPrismaService = {
        quest_task: {
            findUnique: jest.fn(),
        },
        user_task_log: {
            findUnique: jest.fn(),
            upsert: jest.fn(),
        },
        $transaction: jest.fn(),
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
            // Mock the transaction
            prismaService.$transaction.mockImplementation(async (callback) => {
                mockTransactionPrisma.quest_task.findUnique.mockResolvedValue(mockTask);
                mockTransactionPrisma.user_task_log.findUnique.mockResolvedValue(null); // No existing log
                mockTransactionPrisma.user_task_log.upsert.mockResolvedValue({} as any);
                return callback(mockTransactionPrisma);
            });

            const result = await repository.completeQrScanTask(userId, taskId, qrCodeValue);

            expect(result).toEqual({
                questId,
                magatama_point_awarded,
            });

            expect(mockTransactionPrisma.quest_task.findUnique).toHaveBeenCalledWith({
                where: { quest_task_id: taskId },
                select: {
                    quest_id: true,
                    task_type: true,
                    required_action: true,
                    magatama_point_awarded: true,
                },
            });

            expect(mockTransactionPrisma.user_task_log.findUnique).toHaveBeenCalledWith({
                where: {
                    user_id_quest_id_task_id: {
                        user_id: userId,
                        quest_id: questId,
                        task_id: taskId,
                    },
                },
                select: {
                    user_id: true,
                },
            });

            expect(mockTransactionPrisma.user_task_log.upsert).toHaveBeenCalled();
        });

        it('should throw E_TB_028 error if task not found', async () => {
            prismaService.$transaction.mockImplementation(async (callback) => {
                mockTransactionPrisma.quest_task.findUnique.mockResolvedValue(null);
                return callback(mockTransactionPrisma);
            });

            await expect(
                repository.completeQrScanTask(userId, taskId, qrCodeValue),
            ).rejects.toThrow(
                new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_028)
            );
        });

        it('should throw E_TB_032 error if task already completed', async () => {
            prismaService.$transaction.mockImplementation(async (callback) => {
                mockTransactionPrisma.quest_task.findUnique.mockResolvedValue(mockTask);
                mockTransactionPrisma.user_task_log.findUnique.mockResolvedValue({ user_id: userId }); // Existing log
                return callback(mockTransactionPrisma);
            });

            await expect(
                repository.completeQrScanTask(userId, taskId, qrCodeValue),
            ).rejects.toThrow(
                new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_032)
            );

            expect(mockTransactionPrisma.user_task_log.upsert).not.toHaveBeenCalled();
        });

        it('should throw E_TB_030 error if task type is not CHECK_IN', async () => {
            const invalidTaskType = {
                ...mockTask,
                task_type: 'PHOTO_UPLOAD',
            };

            prismaService.$transaction.mockImplementation(async (callback) => {
                mockTransactionPrisma.quest_task.findUnique.mockResolvedValue(invalidTaskType);
                mockTransactionPrisma.user_task_log.findUnique.mockResolvedValue(null);
                return callback(mockTransactionPrisma);
            });

            await expect(
                repository.completeQrScanTask(userId, taskId, qrCodeValue),
            ).rejects.toThrow(
                new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_030)
            );
        });

        it('should throw E_TB_033 error if required_action is invalid JSON', async () => {
            const invalidTask = {
                ...mockTask,
                required_action: 'invalid json',
            };

            prismaService.$transaction.mockImplementation(async (callback) => {
                mockTransactionPrisma.quest_task.findUnique.mockResolvedValue(invalidTask);
                mockTransactionPrisma.user_task_log.findUnique.mockResolvedValue(null);
                return callback(mockTransactionPrisma);
            });

            await expect(
                repository.completeQrScanTask(userId, taskId, qrCodeValue),
            ).rejects.toThrow(
                new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_033)
            );
        });

        it('should throw E_TB_031 error if QR code does not match', async () => {
            const taskWithDifferentQR = {
                ...mockTask,
                required_action: JSON.stringify({ qr_code_value: 'DIFFERENT_CODE' }),
            };

            prismaService.$transaction.mockImplementation(async (callback) => {
                mockTransactionPrisma.quest_task.findUnique.mockResolvedValue(taskWithDifferentQR);
                mockTransactionPrisma.user_task_log.findUnique.mockResolvedValue(null);
                return callback(mockTransactionPrisma);
            });

            await expect(
                repository.completeQrScanTask(userId, taskId, qrCodeValue),
            ).rejects.toThrow(
                new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_031)
            );
        });
    });
});
import { UserTaskLogRepository } from '@app/core/domain/game/quest/user-task-log.repository';
import { UserMapper } from '@app/core/infrastructure/mapper/user.mapper';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { constantTimeStringCompare, randomDelay } from '@app/core/utils/security-utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserTaskLogRepositoryDb implements UserTaskLogRepository {
    constructor(private readonly prisma: PrismaService) {}

    async completePhotoTask(userId: string, taskId: string, proofUrl: string): Promise<void> {
        const task = await this.prisma.quest_task.findUnique({
            where: { quest_task_id: taskId },
            select: { quest_id: true },
        });
        if (!task) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_028);
        }

        const taskLogData = UserMapper.createUserTaskLogForPhotoUpload(
            userId,
            task.quest_id,
            taskId,
            proofUrl,
        );

        await this.prisma.user_task_log.upsert({
            where: {
                user_id_quest_id_task_id: {
                    user_id: userId,
                    quest_id: task.quest_id,
                    task_id: taskId,
                },
            },
            ...taskLogData,
        });
    }

    async completeSocialTask(userId: string, taskId: string, proofUrl: string): Promise<void> {
        const task = await this.prisma.quest_task.findUnique({
            where: { quest_task_id: taskId },
            select: { quest_id: true },
        });
        if (!task) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_028);
        }

        const taskLogData = UserMapper.createUserTaskLogForSocialShare(
            userId,
            task.quest_id,
            taskId,
            proofUrl,
        );

        await this.prisma.user_task_log.upsert({
            where: {
                user_id_quest_id_task_id: {
                    user_id: userId,
                    quest_id: task.quest_id,
                    task_id: taskId,
                },
            },
            ...taskLogData,
        });
    }

    async completeQrScanTask(userId: string, taskId: string, qrCodeValue: string): Promise<{ questId: string; magatama_point_awarded: number }> {
        // Use transaction for atomic operations and better performance
        return await this.prisma.$transaction(async (tx) => {
            // Get task info and check if already completed in a single query using JOIN
            const taskWithLog = await tx.quest_task.findUnique({
                where: { quest_task_id: taskId },
                select: { 
                    quest_id: true, 
                    task_type: true,
                    required_action: true,
                    magatama_point_awarded: true,
                    user_task_log: {
                        where: {
                            user_id: userId,
                            task_id: taskId,
                        },
                        select: {
                            user_id: true,
                        },
                    },
                },
            });
            
            if (!taskWithLog) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_028);
            }

            // Check if already completed (optimized - checked in single query above)
            if (taskWithLog.user_task_log.length > 0) {
                await randomDelay(15, 45); // Add delay to prevent timing analysis
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_032);
            }

            // Validate task type supports QR scanning
            if (taskWithLog.task_type !== 'CHECK_IN') {
                await randomDelay(15, 45); // Add delay to prevent timing analysis
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_030);
            }

            // Validate QR code against expected value with security considerations
            let expectedQrCode: string;
            try {
                const requiredAction = JSON.parse(taskWithLog.required_action);
                expectedQrCode = requiredAction.qr_code_value;
            } catch (error) {
                await randomDelay(15, 45); // Add delay to prevent timing analysis
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_033);
            }

            // Use constant-time comparison to prevent timing attacks
            if (!expectedQrCode || !constantTimeStringCompare(qrCodeValue.trim(), expectedQrCode.trim())) {
                await randomDelay(15, 45); // Add delay to prevent timing analysis
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_031);
            }

            const taskLogData = UserMapper.createUserTaskLogForQrScan(
                userId,
                taskWithLog.quest_id,
                taskId,
                qrCodeValue,
            );

            await tx.user_task_log.upsert({
                where: {
                    user_id_quest_id_task_id: {
                        user_id: userId,
                        quest_id: taskWithLog.quest_id,
                        task_id: taskId,
                    },
                },
                ...taskLogData,
            });

            return {
                questId: taskWithLog.quest_id,
                magatama_point_awarded: taskWithLog.magatama_point_awarded,
            };
        });
    }
}

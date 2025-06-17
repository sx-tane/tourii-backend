import { UserTaskLogRepository } from '@app/core/domain/game/quest/user-task-log.repository';
import { UserMapper } from '@app/core/infrastructure/mapper/user.mapper';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
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
        // Get task info with validation requirements
        const task = await this.prisma.quest_task.findUnique({
            where: { quest_task_id: taskId },
            select: { 
                quest_id: true, 
                task_type: true,
                required_action: true,
                magatama_point_awarded: true,
            },
        });
        
        if (!task) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_028);
        }

        // Validate task type supports QR scanning
        if (task.task_type !== 'CHECK_IN') {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        // Validate QR code against expected value
        let expectedQrCode: string;
        try {
            const requiredAction = JSON.parse(task.required_action);
            expectedQrCode = requiredAction.qr_code_value;
        } catch (error) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        if (!expectedQrCode || qrCodeValue.trim() !== expectedQrCode.trim()) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        // Check if task is already completed
        const existingLog = await this.prisma.user_task_log.findUnique({
            where: {
                user_id_quest_id_task_id: {
                    user_id: userId,
                    quest_id: task.quest_id,
                    task_id: taskId,
                },
            },
        });

        if (existingLog) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        const taskLogData = UserMapper.createUserTaskLogForQrScan(
            userId,
            task.quest_id,
            taskId,
            qrCodeValue,
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

        return {
            questId: task.quest_id,
            magatama_point_awarded: task.magatama_point_awarded,
        };
    }
}

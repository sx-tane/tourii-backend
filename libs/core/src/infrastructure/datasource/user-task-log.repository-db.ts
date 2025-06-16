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

    async completeSocialShareTask(userId: string, taskId: string, proofUrl: string): Promise<void> {
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
}

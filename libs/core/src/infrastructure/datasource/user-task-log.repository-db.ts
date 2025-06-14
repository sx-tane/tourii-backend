import { UserTaskLogRepository } from '@app/core/domain/game/quest/user-task-log.repository';
import { PrismaService } from '@app/core/provider/prisma.service';
import { ContextStorage } from '@app/core/support/context/context-storage';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable } from '@nestjs/common';
import { TaskStatus, TaskType } from '@prisma/client';

@Injectable()
export class UserTaskLogRepositoryDb implements UserTaskLogRepository {
    constructor(private readonly prisma: PrismaService) {}

    async completePhotoTask(userId: string, taskId: string, proofUrl: string): Promise<void> {
        const now = ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date();

        const task = await this.prisma.quest_task.findUnique({
            where: { quest_task_id: taskId },
            select: { quest_id: true },
        });
        if (!task) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023);
        }

        await this.prisma.user_task_log.upsert({
            where: {
                user_id_quest_id_task_id: {
                    user_id: userId,
                    quest_id: task.quest_id,
                    task_id: taskId,
                },
            },
            create: {
                user_id: userId,
                quest_id: task.quest_id,
                task_id: taskId,
                status: TaskStatus.COMPLETED,
                action: TaskType.PHOTO_UPLOAD,
                group_activity_members: [],
                submission_data: { image_url: proofUrl },
                completed_at: now,
                claimed_at: now,
                total_magatama_point_awarded: 0,
                ins_user_id: userId,
                ins_date_time: now,
                upd_user_id: userId,
                upd_date_time: now,
                request_id: ContextStorage.getStore()?.getRequestId()?.value,
            },
            update: {
                status: TaskStatus.COMPLETED,
                submission_data: { image_url: proofUrl },
                completed_at: now,
                upd_user_id: userId,
                upd_date_time: now,
            },
        });
    }
}

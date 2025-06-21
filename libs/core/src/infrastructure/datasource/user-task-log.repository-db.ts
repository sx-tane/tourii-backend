import { UserTaskLogRepository } from '@app/core/domain/game/quest/user-task-log.repository';
import { UserMapper } from '@app/core/infrastructure/mapper/user.mapper';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { constantTimeStringCompare, randomDelay } from '@app/core/utils/security-utils';
import { Injectable } from '@nestjs/common';
import { TaskStatus, TaskType } from '@prisma/client';

@Injectable()
export class UserTaskLogRepositoryDb implements UserTaskLogRepository {
    constructor(private readonly prisma: PrismaService) {}

    // REDACTED - Legacy auto-complete method (preserved for potential future use)
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

    // REDACTED - Legacy auto-complete method (preserved for potential future use)
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

    async completeQrScanTask(
        userId: string,
        taskId: string,
        qrCodeValue: string,
    ): Promise<{ questId: string; magatama_point_awarded: number }> {
        // Use transaction for atomic operations and better performance
        return await this.prisma.$transaction(async (tx) => {
            // Get task info
            const task = await tx.quest_task.findUnique({
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

            // Check if already completed with separate query
            const existingLog = await tx.user_task_log.findUnique({
                where: {
                    user_id_quest_id_task_id: {
                        user_id: userId,
                        quest_id: task.quest_id,
                        task_id: taskId,
                    },
                },
                select: {
                    user_id: true,
                },
            });

            if (existingLog) {
                await randomDelay(15, 45); // Add delay to prevent timing analysis
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_032);
            }

            // Validate task type supports QR scanning
            if (task.task_type !== 'CHECK_IN') {
                await randomDelay(15, 45); // Add delay to prevent timing analysis
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_030);
            }

            // Validate QR code against expected value with security considerations
            let expectedQrCode: string;
            try {
                const requiredAction = JSON.parse(task.required_action);
                expectedQrCode = requiredAction.qr_code_value;
            } catch (_error) {
                await randomDelay(15, 45); // Add delay to prevent timing analysis
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_033);
            }

            // Use constant-time comparison to prevent timing attacks
            if (
                !expectedQrCode ||
                !constantTimeStringCompare(qrCodeValue.trim(), expectedQrCode.trim())
            ) {
                await randomDelay(15, 45); // Add delay to prevent timing analysis
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_031);
            }

            const taskLogData = UserMapper.createUserTaskLogForQrScan(
                userId,
                task.quest_id,
                taskId,
                qrCodeValue,
            );

            await tx.user_task_log.upsert({
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
        });
    }

    // Manual verification methods (current implementation)
    async submitPhotoTaskForVerification(
        userId: string,
        taskId: string,
        proofUrl: string,
    ): Promise<void> {
        const task = await this.prisma.quest_task.findUnique({
            where: { quest_task_id: taskId },
            select: { quest_id: true },
        });
        if (!task) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_028);
        }

        const taskLogData = UserMapper.createUserTaskLogForPhotoUploadPending(
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

    async submitSocialTaskForVerification(
        userId: string,
        taskId: string,
        proofUrl: string,
    ): Promise<void> {
        const task = await this.prisma.quest_task.findUnique({
            where: { quest_task_id: taskId },
            select: { quest_id: true },
        });
        if (!task) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_028);
        }

        const taskLogData = UserMapper.createUserTaskLogForSocialSharePending(
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

    async submitTextTaskForVerification(
        userId: string,
        taskId: string,
        textAnswer: string,
    ): Promise<void> {
        const task = await this.prisma.quest_task.findUnique({
            where: { quest_task_id: taskId },
            select: { quest_id: true },
        });
        if (!task) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_028);
        }

        const taskLogData = UserMapper.createUserTaskLogForAnswerTextPending(
            userId,
            task.quest_id,
            taskId,
            textAnswer,
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

    async submitLocalInteractionTaskForVerification(
        userId: string,
        taskId: string,
        interactionType: 'text' | 'photo' | 'audio',
        content: string,
    ): Promise<void> {
        const task = await this.prisma.quest_task.findUnique({
            where: { quest_task_id: taskId },
            select: { quest_id: true },
        });
        if (!task) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_028);
        }

        const taskLogData = UserMapper.createUserTaskLogForLocalInteractionPending(
            userId,
            task.quest_id,
            taskId,
            interactionType,
            content,
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

    async getPendingSubmissions(options: {
        page: number;
        limit: number;
        taskType?: 'PHOTO_UPLOAD' | 'SHARE_SOCIAL' | 'ANSWER_TEXT';
    }) {
        const offset = (options.page - 1) * options.limit;

        const whereClause = {
            status: TaskStatus.ONGOING,
            action: options.taskType
                ? { equals: options.taskType as TaskType }
                : { in: [TaskType.PHOTO_UPLOAD, TaskType.SHARE_SOCIAL, TaskType.ANSWER_TEXT] },
        };

        const [submissions, totalCount] = await Promise.all([
            this.prisma.user_task_log.findMany({
                where: whereClause,
                include: {
                    user: { select: { username: true } },
                },
                orderBy: { completed_at: 'desc' },
                skip: offset,
                take: options.limit,
            }),
            this.prisma.user_task_log.count({ where: whereClause }),
        ]);

        return {
            submissions: submissions.map((submission) => ({
                userTaskLogId: submission.user_task_log_id,
                userId: submission.user_id,
                username: (submission.user as any)?.username || 'Unknown',
                taskId: submission.task_id,
                questId: submission.quest_id,
                questName: 'Quest', // Will need to fetch separately if needed
                action: submission.action,
                submissionData: submission.submission_data,
                userResponse: submission.user_response,
                completedAt: submission.completed_at,
            })),
            totalCount,
        };
    }

    async verifySubmission(
        userTaskLogId: string,
        action: 'approve' | 'reject',
        _adminUserId: string,
        rejectionReason?: string,
    ): Promise<void> {
        const updateData = {
            status: action === 'approve' ? TaskStatus.COMPLETED : TaskStatus.FAILED,
            ...(action === 'reject' && rejectionReason && { failed_reason: rejectionReason }),
            claimed_at: new Date(),
        };

        await this.prisma.user_task_log.update({
            where: { user_task_log_id: userTaskLogId },
            data: updateData,
        });
    }
}

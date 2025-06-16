import { SubmitTaskResponse, TaskRepository } from '@app/core/domain/game/quest/task.repository';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { TaskStatus, TaskType, quest_task } from '@prisma/client';

@Injectable()
export class TaskRepositoryDb implements TaskRepository {
    private readonly logger = new Logger(TaskRepositoryDb.name);

    constructor(private prisma: PrismaService) {}

    async submitAnswerTextTask(
        taskId: string,
        answer: string,
        userId: string,
    ): Promise<SubmitTaskResponse> {
        const task = await this.findTask(taskId);
        if (!task || task.task_type !== TaskType.ANSWER_TEXT) {
            return { success: false, message: 'Task not found' };
        }

        const normalizedAnswer = answer.trim().toLowerCase();
        const correctAnswer = task.accepted_answer?.trim().toLowerCase();
        this.logger.log(`Normalized user answer: ${normalizedAnswer}`);

        if (normalizedAnswer === correctAnswer) {
            await this.prisma.user_task_log.create({
                data: {
                    user_id: userId,
                    quest_id: task.quest_id,
                    task_id: taskId,
                    status: TaskStatus.COMPLETED,
                    action: TaskType.ANSWER_TEXT,
                    user_response: answer,
                    completed_at: new Date(),
                },
            });
            return { success: true, message: 'Correct answer' };
        }

        await this.prisma.user_task_log.create({
            data: {
                user_id: userId,
                quest_id: task.quest_id,
                task_id: taskId,
                status: TaskStatus.FAILED,
                action: TaskType.ANSWER_TEXT,
                user_response: answer,
                completed_at: new Date(),
            },
        });
        return { success: false, message: 'Incorrect answer' };
    }

    async submitSelectOptionsTask(
        taskId: string,
        selectedOptionIds: number[],
        userId: string,
    ): Promise<SubmitTaskResponse> {
        const task = await this.findTask(taskId);
        if (!task || task.task_type !== TaskType.SELECT_OPTION) {
            return { success: false, message: 'Task not found' };
        }

        const correctOptionIds = task.accepted_answer?.split(',').map(Number);
        const isCorrect =
            JSON.stringify(selectedOptionIds.sort()) === JSON.stringify(correctOptionIds?.sort());

        if (isCorrect) {
            await this.prisma.user_task_log.create({
                data: {
                    user_id: userId,
                    quest_id: task.quest_id,
                    task_id: taskId,
                    status: TaskStatus.COMPLETED,
                    action: TaskType.SELECT_OPTION,
                    user_response: selectedOptionIds.join(','),
                    completed_at: new Date(),
                },
            });
            this.logger.log('User task log created');
            return { success: true, message: 'Correct answer' };
        }
        await this.prisma.user_task_log.create({
            data: {
                user_id: userId,
                quest_id: task.quest_id,
                task_id: taskId,
                status: TaskStatus.FAILED,
                action: TaskType.SELECT_OPTION,
                user_response: selectedOptionIds.join(','),
                completed_at: new Date(),
            },
        });
        return { success: false, message: 'Incorrect answer' };
    }

    async submitCheckInTask(
        taskId: string,
        longitude: number,
        latitude: number,
        userId: string,
    ): Promise<SubmitTaskResponse> {
        const task = await this.findTask(taskId);
        if (!task || task.task_type !== TaskType.CHECK_IN) {
            return { success: false, message: 'Task not found' };
        }

        const touristSpot = await this.prisma.quest
            .findUnique({
                where: { quest_id: task.quest_id },
                include: {
                    tourist_spot: true,
                },
            })
            .then((quest) => quest?.tourist_spot);
        const { spotLongitude, spotLatitude } = {
            spotLongitude: touristSpot?.longitude ?? 0,
            spotLatitude: touristSpot?.latitude ?? 0,
        };

        const distance = this.calculateHaversineDistance(
            latitude,
            longitude,
            spotLatitude,
            spotLongitude,
        );
        const acceptedRadius = Number(task.accepted_answer?.split(',')[0]);

        if (distance <= acceptedRadius) {
            await this.prisma.user_task_log.create({
                data: {
                    user_id: userId,
                    quest_id: task.quest_id,
                    task_id: taskId,
                    status: TaskStatus.COMPLETED,
                    action: TaskType.CHECK_IN,
                    user_response: `${longitude},${latitude}`,
                    completed_at: new Date(),
                },
            });
            return { success: true, message: 'Check-in successful' };
        }
        await this.prisma.user_task_log.create({
            data: {
                user_id: userId,
                quest_id: task.quest_id,
                task_id: taskId,
                status: TaskStatus.FAILED,
                action: TaskType.CHECK_IN,
                user_response: `${longitude},${latitude}`,
                completed_at: new Date(),
            },
        });
        return { success: false, message: 'Check-in failed' };
    }

    private findTask(taskId: string): Promise<quest_task | null> {
        return this.prisma.quest_task.findUnique({
            where: { quest_task_id: taskId },
        });
    }

    private calculateHaversineDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
    ): number {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }
}

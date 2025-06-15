import { TaskRepository } from '@app/core/domain/game/quest/task.repository';
import { PrismaService } from '@app/core/provider/prisma.service';
import { SubmitTaskResponseDto } from '@app/tourii-backend/controller/model/tourii-response/submit-tasks-response.model';
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
    ): Promise<SubmitTaskResponseDto> {
        const task = await this.findTask(taskId);
        if (!task || task.task_type !== TaskType.ANSWER_TEXT) {
            return { success: false, message: 'Task not found' };
        }

        const normalizedAnswer = answer.trim().toLowerCase();
        const correctAnswer = 'Answer'.trim().toLowerCase(); // Temp
        this.logger.log(`Normalized answer: ${normalizedAnswer}`);

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
            this.logger.log('User task log created');
            return { success: true, message: 'Correct answer' };
        }
        return { success: false, message: 'Incorrect answer' };
    }

    async submitSelectOptionsTask(
        taskId: string,
        selectedOptionIds: number[],
        userId: string,
    ): Promise<SubmitTaskResponseDto> {
        const task = await this.findTask(taskId);
        if (!task || task.task_type !== TaskType.SELECT_OPTION) {
            return { success: false, message: 'Task not found' };
        }

        const correctOptionIds = [1, 2]; // Temp
        const isCorrect =
            JSON.stringify(correctOptionIds.sort()) === JSON.stringify(selectedOptionIds.sort());

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
        return { success: false, message: 'Incorrect answer' };
    }

    async submitCheckInTask(
        taskId: string,
        longitude: number,
        latitude: number,
        userId: string,
    ): Promise<SubmitTaskResponseDto> {
        const task = await this.findTask(taskId);
        if (!task || task.task_type !== TaskType.CHECK_IN) {
            return { success: false, message: 'Task not found' };
        }

        const distance =
            Math.abs(longitude - 0 /*task.longitude*/) + Math.abs(latitude - 0 /*task.latitude*/);
        if (distance <= 100) {
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
        return { success: false, message: 'Check-in failed' };
    }

    private findTask(taskId: string): Promise<quest_task | null> {
        return this.prisma.quest_task.findUnique({
            where: { quest_task_id: taskId },
        });
    }
}

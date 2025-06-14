import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { QuestTaskCreateRequestSchema } from '../create/quest-task-create-request.model';

export const QuestTaskUpdateRequestSchema = QuestTaskCreateRequestSchema.extend({
    taskId: z.string().describe('Unique identifier for the task'),
    delFlag: z.boolean().describe('Flag to indicate if the task is deleted'),
    updUserId: z.string().describe('Unique identifier for the user who updated the task'),
});

export class QuestTaskUpdateRequestDto extends createZodDto(QuestTaskUpdateRequestSchema) {}

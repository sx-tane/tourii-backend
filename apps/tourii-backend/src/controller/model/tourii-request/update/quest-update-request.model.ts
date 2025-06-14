import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { QuestCreateRequestSchema } from '../create/quest-create-request.model';
import { QuestTaskUpdateRequestSchema } from './quest-task-update-request.model';

export const QuestUpdateRequestSchema = QuestCreateRequestSchema.extend({
    questId: z.string().describe('Unique identifier for the quest'),
    delFlag: z.boolean().describe('Flag to indicate if the quest is deleted'),
    updUserId: z.string().describe('Unique identifier for the user who updated the quest'),
    taskList: z
        .array(QuestTaskUpdateRequestSchema)
        .optional()
        .describe('List of tasks for the quest'),
});

export class QuestUpdateRequestDto extends createZodDto(QuestUpdateRequestSchema) {}

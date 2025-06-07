import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { QuestResponseSchema } from './quest-response.model';

export const QuestListResponseSchema = z.object({
    quests: z.array(QuestResponseSchema),
    pagination: z.object({
        currentPage: z.number(),
        totalPages: z.number(),
        totalQuests: z.number(),
    }),
});

export class QuestListResponseDto extends createZodDto(QuestListResponseSchema) {}

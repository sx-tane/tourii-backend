import { QuestType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QuestFetchRequestSchema = z.object({
    questType: z.nativeEnum(QuestType).optional().describe('Quest type filter'),
    page: z
        .string()
        .transform((val) => Number.parseInt(val, 10))
        .default('1')
        .describe('Page number'),
    limit: z
        .string()
        .transform((val) => Number.parseInt(val, 10))
        .refine((val) => val <= 100, { message: 'Limit must be less than or equal to 100' })
        .default('20')
        .describe('Number of quests per page'),
    isPremium: z.boolean().optional().describe('Whether the quest is premium'),
    isUnlocked: z.boolean().optional().describe('Whether the quest is unlocked'),
});

export class QuestListQueryDto extends createZodDto(QuestFetchRequestSchema) {}

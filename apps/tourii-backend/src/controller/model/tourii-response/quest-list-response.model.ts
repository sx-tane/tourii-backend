import { QuestType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QuestListResponseSchema = z.object({
    quests: z.array(
        z.object({
            questId: z.string().describe('Unique identifier for the quest'),
            questName: z.string().describe('Name of the quest'),
            questDesc: z.string().describe('Description of the quest'),
            questImage: z.string().optional().describe('URL to the quest image'),
            questType: z.nativeEnum(QuestType).describe('Quest type'),
            isUnlocked: z.boolean().describe('Whether quest is unlocked'),
            isPremium: z.boolean().describe('Whether quest is premium'),
            totalMagatamaPointAwarded: z.number().describe('Total Magatama points awarded'),
        }),
    ),
    pagination: z.object({
        currentPage: z.number(),
        totalPages: z.number(),
        totalQuests: z.number(),
    }),
});

export class QuestListResponseDto extends createZodDto(QuestListResponseSchema) {}

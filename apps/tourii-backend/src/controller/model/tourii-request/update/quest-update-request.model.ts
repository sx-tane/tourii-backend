import { QuestType, RewardType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { QuestTaskUpdateRequestSchema } from './quest-task-update-request.model';

export const QuestUpdateRequestSchema = z.object({
    questId: z.string().describe('Unique identifier for the quest'),
    touristSpotId: z.string().describe('Unique identifier for the tourist spot'),
    questName: z.string().describe('Name of the quest'),
    questDesc: z.string().describe('Description of the quest'),
    questImage: z.string().optional().describe('URL to the quest image'),
    questType: z.nativeEnum(QuestType).describe('Quest type'),
    isUnlocked: z.boolean().describe('Whether quest is unlocked'),
    isPremium: z.boolean().describe('Whether quest is premium'),
    totalMagatamaPointAwarded: z.number().describe('Total Magatama points awarded'),
    rewardType: z.nativeEnum(RewardType).describe('Reward type'),
    delFlag: z.boolean().describe('Flag to indicate if the quest is deleted'),
    updUserId: z.string().describe('Unique identifier for the user who updated the quest'),
    taskList: z
        .array(QuestTaskUpdateRequestSchema)
        .optional()
        .describe('List of tasks for the quest'),
});

export class QuestUpdateRequestDto extends createZodDto(QuestUpdateRequestSchema) {}

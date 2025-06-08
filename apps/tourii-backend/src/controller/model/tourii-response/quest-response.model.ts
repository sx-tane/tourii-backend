import { QuestType, TaskTheme, TaskType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { TouristSpotResponseSchema } from './tourist-spot-response.model';

export const TaskResponseSchema = z.object({
    taskId: z.string().describe('Unique identifier for the task'),
    questId: z.string().describe('ID of the parent quest'),
    taskTheme: z.nativeEnum(TaskTheme).describe('Theme of the task'),
    taskType: z.nativeEnum(TaskType).describe('Type of the task'),
    taskName: z.string().describe('Name of the task'),
    taskDesc: z.string().describe('Description of the task'),
    isUnlocked: z.boolean().describe('Whether task is unlocked'),
    requiredAction: z.string().describe('Action required to complete the task'),
    groupActivityMembers: z.array(z.any()).optional().describe('Members for group activities'),
    selectOptions: z.array(z.any()).optional().describe('Options for selection tasks'),
    antiCheatRules: z.any().describe('Rules to prevent cheating'),
    magatamaPointAwarded: z.number().describe('Magatama points awarded for this task'),
    totalMagatamaPointAwarded: z.number().describe('Total Magatama points awarded'),
    isCompleted: z.boolean().describe('Whether task is completed'),
});

export const QuestResponseSchema = z.object({
    questId: z.string().describe('Unique identifier for the quest'),
    questName: z.string().describe('Name of the quest'),
    questDesc: z.string().describe('Description of the quest'),
    questImage: z.string().optional().describe('URL to the quest image'),
    questType: z.nativeEnum(QuestType).describe('Quest type'),
    isUnlocked: z.boolean().describe('Whether quest is unlocked'),
    isPremium: z.boolean().describe('Whether quest is premium'),
    totalMagatamaPointAwarded: z.number().describe('Total Magatama points awarded'),
    tasks: z.array(TaskResponseSchema).optional().describe('Tasks associated with this quest'),
    touristSpot: TouristSpotResponseSchema.optional().describe(
        'Tourist spot associated with this quest',
    ),
});

export class TaskResponseDto extends createZodDto(TaskResponseSchema) {}
export class QuestResponseDto extends createZodDto(QuestResponseSchema) {}

import { TaskTheme, TaskType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QuestTaskCreateRequestSchema = z.object({
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
});

export class QuestTaskCreateRequestDto extends createZodDto(QuestTaskCreateRequestSchema) {}

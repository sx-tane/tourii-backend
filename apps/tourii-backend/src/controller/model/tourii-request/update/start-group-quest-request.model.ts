import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const StartGroupQuestRequestSchema = z.object({
    userId: z.string().describe('User ID of the quest leader starting the quest'),
    latitude: z.number().optional().describe('Optional latitude for location tracking'),
    longitude: z.number().optional().describe('Optional longitude for location tracking'),
});

export class StartGroupQuestRequestDto extends createZodDto(StartGroupQuestRequestSchema) {}

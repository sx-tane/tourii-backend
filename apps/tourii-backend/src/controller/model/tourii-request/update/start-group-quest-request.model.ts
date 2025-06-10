import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const StartGroupQuestRequestSchema = z.object({
    userId: z.string().describe('User ID of the quest leader starting the quest'),
});

export class StartGroupQuestRequestDto extends createZodDto(StartGroupQuestRequestSchema) {}

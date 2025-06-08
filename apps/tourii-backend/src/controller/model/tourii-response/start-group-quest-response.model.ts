import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const StartGroupQuestResponseSchema = z.object({
    message: z.string().describe('Result message for starting the quest'),
});

export class StartGroupQuestResponseDto extends createZodDto(StartGroupQuestResponseSchema) {}

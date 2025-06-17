import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QuestTaskSocialShareResponseSchema = z.object({
    message: z.string().describe('Result message for social share completion'),
});

export class QuestTaskSocialShareResponseDto extends createZodDto(
    QuestTaskSocialShareResponseSchema,
) {}

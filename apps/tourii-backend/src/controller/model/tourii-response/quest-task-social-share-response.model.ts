import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QuestTaskSocialShareResponseSchema = z.object({
    message: z.string().describe('Result message for social share completion'),
    estimatedReviewTime: z.string().describe('Estimated time for admin review of the submission'),
});

export class QuestTaskSocialShareResponseDto extends createZodDto(
    QuestTaskSocialShareResponseSchema,
) {}

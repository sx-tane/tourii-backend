import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SubmitTaskResponseSchema = z.object({
    success: z.boolean().describe('Whether the answer is correct'),
    message: z.string().describe('Message to the user'),
    estimatedReviewTime: z.string().optional().describe('Estimated time for admin review (only for manual verification tasks)'),
});

export class SubmitTaskResponseDto extends createZodDto(SubmitTaskResponseSchema) {}

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { TaskStatus } from '@prisma/client';

export const LocalInteractionResponseSchema = z.object({
    message: z.string().describe('Status message'),
    status: z.nativeEnum(TaskStatus).describe('Task status after submission'),
    estimatedReviewTime: z.string().describe('Expected review timeframe'),
});

export class LocalInteractionResponseDto extends createZodDto(LocalInteractionResponseSchema) {}
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SubmitTaskResponseSchema = z.object({
    success: z.boolean().describe('Whether the answer is correct'),
    message: z.string().describe('Message to the user'),
});

export class SubmitTaskResponseDto extends createZodDto(SubmitTaskResponseSchema) {}

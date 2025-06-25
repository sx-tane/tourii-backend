import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const BatchVerificationRequestSchema = z.object({
    tokens: z
        .array(z.string())
        .min(1)
        .max(100)
        .describe('Array of verification tokens (JWT) to verify in batch'),
});

export class BatchVerificationRequestDto extends createZodDto(BatchVerificationRequestSchema) {}

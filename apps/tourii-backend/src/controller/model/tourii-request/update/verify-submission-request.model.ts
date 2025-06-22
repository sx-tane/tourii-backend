import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const VerifySubmissionRequestSchema = z.object({
    action: z.enum(['approve', 'reject']).describe('Action to take on the submission'),
    rejectionReason: z.string().optional().describe('Reason for rejection (required when action is reject)'),
});

export class VerifySubmissionRequestDto extends createZodDto(VerifySubmissionRequestSchema) {}
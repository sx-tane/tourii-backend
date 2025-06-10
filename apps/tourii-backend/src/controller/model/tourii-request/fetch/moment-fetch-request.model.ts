import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const MomentFetchRequestSchema = z.object({
    page: z.number().default(1).describe('Page number'),
    limit: z.number().max(100).default(10).describe('Items per page'),
});

export class MomentListQueryDto extends createZodDto(MomentFetchRequestSchema) {}

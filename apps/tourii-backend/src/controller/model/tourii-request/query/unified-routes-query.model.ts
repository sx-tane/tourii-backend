import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UnifiedRoutesQuerySchema = z.object({
    source: z
        .enum(['ai', 'manual', 'all'])
        .optional()
        .default('all')
        .describe('Filter routes by source: ai (AI-generated), manual (user-created), or all'),
    region: z
        .string()
        .optional()
        .describe('Filter routes by region name (case-insensitive partial match)'),
    userId: z.string().optional().describe('Filter routes created by specific user ID'),
    limit: z
        .string()
        .min(1)
        .max(100)
        .optional()
        .default('20')
        .describe('Maximum number of routes to return (1-100, default: 20)'),
    offset: z
        .string()
        .min(0)
        .optional()
        .default('0')
        .describe('Number of routes to skip for pagination (default: 0)'),
});

export class UnifiedRoutesQueryDto extends createZodDto(UnifiedRoutesQuerySchema) {}

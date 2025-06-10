import { MomentType } from '@app/core/domain/feed/moment-type';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const MomentFetchRequestSchema = z.object({
    page: z
        .string()
        .transform((val) => Number.parseInt(val, 10))
        .default('1')
        .describe('Page number'),
    limit: z
        .string()
        .transform((val) => Number.parseInt(val, 10))
        .refine((val) => val <= 100, { message: 'Limit must be less than or equal to 100' })
        .default('10')
        .describe('Items per page'),
    momentType: z.nativeEnum(MomentType).optional().describe('Moment type'),
});

export class MomentListQueryDto extends createZodDto(MomentFetchRequestSchema) {}

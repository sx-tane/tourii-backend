import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const TouristSpotPaginationQuerySchema = z.object({
    limit: z
        .string()
        .min(1)
        .max(100)
        .optional()
        .default('20')
        .describe('Maximum number of tourist spots to return (1-100, default: 20)'),
    offset: z
        .string()
        .min(0)
        .optional()
        .default('0')
        .describe('Number of tourist spots to skip for pagination (default: 0)'),
});

export class TouristSpotPaginationQueryDto extends createZodDto(TouristSpotPaginationQuerySchema) {}
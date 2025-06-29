import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const TouristSpotSearchQuerySchema = z.object({
    query: z
        .string()
        .optional()
        .describe('Search in tourist spot name and description (case-insensitive partial match)'),
    location: z
        .string()
        .optional()
        .describe('Search in address and location data (case-insensitive partial match)'),
    hashtags: z
        .string()
        .optional()
        .describe('Comma-separated hashtags to filter by (e.g., "food,shrine,nature")'),
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

export class TouristSpotSearchQueryDto extends createZodDto(TouristSpotSearchQuerySchema) {}
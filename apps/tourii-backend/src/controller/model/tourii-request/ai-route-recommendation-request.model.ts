import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AiRouteRecommendationRequestSchema = z.object({
    keywords: z
        .array(z.string().min(1).max(50))
        .min(1, 'At least one keyword is required')
        .max(10, 'Maximum 10 keywords allowed')
        .describe('Keywords to search for in tourist spot hashtags'),

    mode: z
        .enum(['all', 'any'])
        .default('any')
        .describe('Matching mode: "all" requires all keywords, "any" requires any keyword'),

    region: z.string().optional().describe('Optional region filter'),

    proximityRadiusKm: z
        .number()
        .min(1)
        .max(200)
        .default(50)
        .optional()
        .describe('Proximity radius in kilometers for clustering spots'),

    minSpotsPerCluster: z
        .number()
        .min(1)
        .max(10)
        .default(2)
        .optional()
        .describe('Minimum number of spots required to form a cluster'),

    maxSpotsPerCluster: z
        .number()
        .min(2)
        .max(15)
        .default(8)
        .optional()
        .describe('Maximum number of spots allowed in a cluster'),

    maxRoutes: z
        .number()
        .min(1)
        .max(20)
        .default(5)
        .optional()
        .describe('Maximum number of routes to generate'),
});

export class AiRouteRecommendationRequestDto extends createZodDto(
    AiRouteRecommendationRequestSchema,
) {}

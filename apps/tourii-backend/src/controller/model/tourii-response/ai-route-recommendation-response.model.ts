import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const TouristSpotInClusterResponseSchema = z.object({
    touristSpotId: z.string().describe('Tourist spot ID'),
    touristSpotName: z.string().describe('Tourist spot name'),
    touristSpotDesc: z.string().optional().describe('Tourist spot description'),
    latitude: z.number().describe('Latitude coordinate'),
    longitude: z.number().describe('Longitude coordinate'),
    touristSpotHashtag: z.array(z.string()).describe('Hashtags for this tourist spot'),
    matchedKeywords: z.array(z.string()).describe('Keywords that matched for this spot'),
});

export const AiGeneratedRouteResponseSchema = z.object({
    modelRouteId: z.string().describe('Generated model route ID'),
    routeName: z.string().describe('AI-generated route name'),
    regionDesc: z.string().describe('AI-generated region description'),
    recommendations: z.array(z.string()).describe('AI-generated recommendation hashtags'),
    region: z.string().describe('Route region'),
    regionLatitude: z.number().describe('Center latitude of the route'),
    regionLongitude: z.number().describe('Center longitude of the route'),
    estimatedDuration: z.string().describe('AI-estimated duration for the route'),
    confidenceScore: z.number().min(0).max(1).describe('AI confidence score (0-1)'),
    spotCount: z.number().describe('Number of tourist spots in this route'),
    averageDistance: z.number().describe('Average distance from center in kilometers'),
    touristSpots: z
        .array(TouristSpotInClusterResponseSchema)
        .describe('Tourist spots included in this route'),
    metadata: z
        .object({
            sourceKeywords: z.array(z.string()).describe('Original search keywords'),
            generatedAt: z.string().describe('When the route was generated'),
            algorithm: z.string().describe('Algorithm version used'),
            aiGenerated: z.boolean().default(true).describe('Indicates this was AI-generated'),
        })
        .describe('Route generation metadata'),
});

export const AiRouteRecommendationResponseSchema = z.object({
    generatedRoutes: z
        .array(AiGeneratedRouteResponseSchema)
        .describe('AI-generated routes based on keyword search'),

    summary: z
        .object({
            totalSpotsFound: z.number().describe('Total tourist spots found matching keywords'),
            clustersFormed: z.number().describe('Number of geographic clusters formed'),
            routesGenerated: z.number().describe('Number of AI routes successfully generated'),
            processingTimeMs: z.number().describe('Total processing time in milliseconds'),
            aiAvailable: z.boolean().describe('Whether AI content generation was available'),
        })
        .describe('Processing summary and statistics'),

    message: z
        .string()
        .default('AI route recommendations generated successfully')
        .describe('Success message'),
});

export class TouristSpotInClusterResponseDto extends createZodDto(
    TouristSpotInClusterResponseSchema,
) {}
export class AiGeneratedRouteResponseDto extends createZodDto(AiGeneratedRouteResponseSchema) {}
export class AiRouteRecommendationResponseDto extends createZodDto(
    AiRouteRecommendationResponseSchema,
) {}

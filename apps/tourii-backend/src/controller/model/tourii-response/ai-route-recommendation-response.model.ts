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
    region: z
        .string()
        .transform((val) => val.toLowerCase().trim())
        .describe('Route region'),
    regionBackgroundMedia: z.string().optional().describe('Background image URL'),
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

export const ExistingRouteResponseSchema = z.object({
    modelRouteId: z.string().describe('Existing model route ID'),
    routeName: z.string().describe('Route name'),
    regionDesc: z.string().optional().describe('Region description'),
    recommendations: z.array(z.string()).describe('Route recommendation hashtags'),
    region: z
        .string()
        .transform((val) => val.toLowerCase().trim())
        .describe('Route region'),
    regionLatitude: z.number().optional().describe('Center latitude of the route'),
    regionLongitude: z.number().optional().describe('Center longitude of the route'),
    spotCount: z.number().describe('Number of tourist spots in this route'),
    isAiGenerated: z.boolean().describe('Whether this route was AI-generated'),
    matchedKeywords: z.array(z.string()).describe('Keywords that matched this route'),
    touristSpots: z
        .array(TouristSpotInClusterResponseSchema)
        .describe('Tourist spots included in this route'),
});

export const KeywordExpansionResponseSchema = z.object({
    original: z.array(z.string()).describe('Original search keywords'),
    expanded: z.array(z.string()).describe('All expanded keywords used in search'),
    related: z.array(z.string()).describe('Related terms found by AI'),
    translations: z.record(z.array(z.string())).describe('Keyword translations'),
    reasoning: z.string().describe('AI reasoning for keyword expansion'),
    confidence: z.number().min(0).max(1).describe('AI confidence in keyword expansion'),
});

export const EnhancedAiRouteRecommendationResponseSchema = z.object({
    generatedRoutes: z
        .array(AiGeneratedRouteResponseSchema)
        .describe('AI-generated routes based on keyword search'),

    existingRoutes: z
        .array(ExistingRouteResponseSchema)
        .describe('Existing routes that match the expanded keywords'),

    expandedKeywords: z
        .array(z.string())
        .describe('All keywords used in search (original + AI-expanded)'),

    summary: z
        .object({
            keywordExpansion: KeywordExpansionResponseSchema.describe(
                'AI keyword expansion details',
            ),
            totalSpotsFound: z.number().describe('Total tourist spots found matching keywords'),
            clustersFormed: z.number().describe('Number of geographic clusters formed'),
            routesGenerated: z.number().describe('Number of AI routes successfully generated'),
            existingRoutesFound: z.number().describe('Number of existing routes found'),
            processingTimeMs: z.number().describe('Total processing time in milliseconds'),
            aiAvailable: z.boolean().describe('Whether AI services were available'),
            defaultClusteringOptions: z
                .object({
                    proximityRadiusKm: z.number(),
                    minSpotsPerCluster: z.number(),
                    maxSpotsPerCluster: z.number(),
                })
                .describe('Default clustering configuration used'),
        })
        .describe('Processing summary and statistics'),

    message: z
        .string()
        .default('Enhanced AI route recommendations with existing routes generated successfully')
        .describe('Success message'),
});

export const AiRouteRecommendationResponseSchema = z.object({
    generatedRoutes: z
        .array(AiGeneratedRouteResponseSchema)
        .describe('AI-generated routes based on keyword search'),

    existingRoutes: z
        .array(ExistingRouteResponseSchema)
        .optional()
        .describe('Existing routes that match the search keywords'),

    summary: z
        .object({
            totalSpotsFound: z.number().describe('Total tourist spots found matching keywords'),
            clustersFormed: z.number().describe('Number of geographic clusters formed'),
            routesGenerated: z.number().describe('Number of AI routes successfully generated'),
            existingRoutesFound: z.number().optional().describe('Number of existing routes found'),
            totalRoutesReturned: z
                .number()
                .optional()
                .describe('Total routes returned (existing + AI)'),
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
export class ExistingRouteResponseDto extends createZodDto(ExistingRouteResponseSchema) {}
export class KeywordExpansionResponseDto extends createZodDto(KeywordExpansionResponseSchema) {}
export class EnhancedAiRouteRecommendationResponseDto extends createZodDto(
    EnhancedAiRouteRecommendationResponseSchema,
) {}
export class AiRouteRecommendationResponseDto extends createZodDto(
    AiRouteRecommendationResponseSchema,
) {}

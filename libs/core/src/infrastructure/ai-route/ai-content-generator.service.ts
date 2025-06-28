import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TouristSpotCluster } from './ai-route-clustering.service';
import { LocationInfoRepository } from '../../domain/geo/location-info.repository';

export interface AiGeneratedRouteContent {
    routeName: string;
    regionDesc: string;
    recommendations: string[];
    estimatedDuration: string;
    confidenceScore: number;
}

export interface ContentGenerationRequest {
    cluster: TouristSpotCluster;
    userKeywords: string[];
    additionalContext?: {
        season?: string;
        travelStyle?: string;
        groupSize?: number;
    };
}

export class AiContentGeneratorService {
    private readonly logger = new Logger(AiContentGeneratorService.name);
    private readonly isOpenAiConfigured: boolean;

    constructor(
        private readonly configService: ConfigService,
        private readonly locationInfoRepository: LocationInfoRepository,
    ) {
        this.isOpenAiConfigured = !!this.configService?.get('OPENAI_API_KEY');
        if (!this.isOpenAiConfigured) {
            this.logger.warn(
                'OpenAI API key not configured - AI content generation will use fallback method',
            );
        }
    }

    /**
     * Generates AI-powered content for a route based on tourist spot cluster
     */
    async generateRouteContent(
        request: ContentGenerationRequest,
    ): Promise<AiGeneratedRouteContent> {
        try {
            if (this.isOpenAiConfigured) {
                return await this.generateWithOpenAi(request);
            } else {
                return this.generateFallbackContent(request);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error('AI content generation failed, using fallback', {
                error: errorMessage,
                clusterId: request.cluster.id,
            });
            return this.generateFallbackContent(request);
        }
    }

    /**
     * Generates content using OpenAI GPT
     */
    private async generateWithOpenAi(
        request: ContentGenerationRequest,
    ): Promise<AiGeneratedRouteContent> {
        const OpenAI = await import('openai').then((m) => m.default);

        const openai = new OpenAI({
            apiKey: this.configService?.get('OPENAI_API_KEY'),
        });

        const prompt = this.buildGptPrompt(request);

        this.logger.debug('Calling OpenAI for route content generation', {
            clusterId: request.cluster.id,
            spotCount: request.cluster.spots.length,
            userKeywords: request.userKeywords,
        });

        const completion = await openai.chat.completions.create({
            model: this.configService?.get('OPENAI_MODEL', 'gpt-4o-mini'),
            messages: [
                {
                    role: 'system',
                    content: this.getSystemPrompt(),
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 1000,
            response_format: { type: 'json_object' },
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error('No response from OpenAI');
        }

        const parsedContent = this.parseGptResponse(response, request);

        this.logger.debug('OpenAI content generation successful', {
            clusterId: request.cluster.id,
            routeName: parsedContent.routeName,
        });

        return parsedContent;
    }

    /**
     * Builds the GPT prompt for route content generation
     */
    private buildGptPrompt(request: ContentGenerationRequest): string {
        const { cluster, userKeywords, additionalContext } = request;

        const spotNames = cluster.spots.map((spot) => spot.touristSpotName).filter(Boolean);
        const allHashtags = cluster.spots
            .flatMap((spot) => spot.touristSpotHashtag || [])
            .filter((tag, index, array) => array.indexOf(tag) === index); // unique tags

        const commonHashtags = this.findCommonHashtags(cluster.spots);

        let prompt = `Create a travel route for the following tourist spots in ${cluster.region}, Japan:

Tourist Spots:
${spotNames.map((name, i) => `${i + 1}. ${name}`).join('\n')}

User's Interests: ${userKeywords.join(', ')}
Common Themes: ${commonHashtags.join(', ')}
All Available Hashtags: ${allHashtags.join(', ')}
Number of Spots: ${cluster.spots.length}
Geographic Area: ${cluster.averageDistance.toFixed(1)} km average from center`;

        if (additionalContext?.season) {
            prompt += `\nSeason: ${additionalContext.season}`;
        }
        if (additionalContext?.travelStyle) {
            prompt += `\nTravel Style: ${additionalContext.travelStyle}`;
        }

        prompt += `\n\nGenerate engaging travel route content that connects these spots thematically.
Focus on what makes this route special and appealing to travelers interested in ${userKeywords.join(' and ')}.`;

        return prompt;
    }

    /**
     * System prompt for GPT
     */
    private getSystemPrompt(): string {
        return `You are a professional travel route curator specializing in Japanese tourism. 
Your expertise includes creating compelling, culturally authentic travel experiences.

Create a JSON response with these exact fields:
{
  "routeName": "Short, catchy route name (max 30 characters)",
  "regionDesc": "Compelling description explaining the route's appeal (max 200 characters)",
  "recommendations": ["3-5 human-readable travel categories"],
  "estimatedDuration": "Duration based on spot count (e.g., '2-3 days', '1 day', '4-5 days')"
}

Guidelines:
- Route names should be short and catchy (e.g., "Tokyo Food Tour", "Shibuya Culture Walk", "Historic Kyoto")
- Avoid long descriptive phrases - keep it simple and memorable
- Descriptions should highlight unique experiences and connections between spots
- Recommendations should be human-readable travel categories like 'Ideal for First Time Visitors', 'A good mix of nature and culture', 'Local Food', 'Historical Sites', 'Modern Architecture'
- Duration should be realistic for the number of spots (1-3 spots = 1 day, 4-6 spots = 2-3 days, etc.)
- Maintain authentic Japanese cultural context
- Make it appealing to international travelers`;
    }

    /**
     * Parses and validates GPT response
     */
    private parseGptResponse(
        response: string,
        request: ContentGenerationRequest,
    ): AiGeneratedRouteContent {
        try {
            const parsed = JSON.parse(response);

            // Validate required fields
            const routeName = this.validateAndCleanString(parsed.routeName, 30, 'Tokyo Discovery');
            const regionDesc = this.validateAndCleanString(
                parsed.regionDesc,
                200,
                'Explore unique attractions in this region.',
            );
            const recommendations = Array.isArray(parsed.recommendations)
                ? parsed.recommendations.slice(0, 5).map((r: any) => String(r).trim())
                : this.generateDefaultRecommendations(request.userKeywords);
            const estimatedDuration = this.validateAndCleanString(
                parsed.estimatedDuration,
                20,
                this.calculateDurationFallback(request.cluster.spots.length),
            );

            return {
                routeName,
                regionDesc,
                recommendations,
                estimatedDuration,
                confidenceScore: 0.9, // High confidence for successful AI generation
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.warn('Failed to parse GPT response, using fallback', {
                error: errorMessage,
                response: response.substring(0, 200),
            });
            return this.generateFallbackContent(request);
        }
    }

    /**
     * Generates fallback content when AI is unavailable
     */
    private generateFallbackContent(request: ContentGenerationRequest): AiGeneratedRouteContent {
        const { cluster, userKeywords } = request;

        const commonHashtags = this.findCommonHashtags(cluster.spots);
        const keywordString =
            userKeywords.length > 0
                ? userKeywords
                      .slice(0, 2)
                      .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
                      .join(' & ')
                : 'Discovery';

        const routeName = `${keywordString} ${cluster.region}`.substring(0, 30);
        const regionDesc = `Explore ${cluster.spots.length} locations in ${cluster.region} featuring ${userKeywords.slice(0, 2).join(', ')}.`.substring(0, 200);

        return {
            routeName,
            regionDesc,
            recommendations: this.generateDefaultRecommendations([...userKeywords, ...commonHashtags]),
            estimatedDuration: this.calculateDurationFallback(cluster.spots.length),
            confidenceScore: 0.6, // Lower confidence for fallback content
        };
    }

    /**
     * Finds hashtags that appear in multiple spots within a cluster
     */
    private findCommonHashtags(spots: Array<{ touristSpotHashtag?: string[] }>): string[] {
        const hashtagCounts = new Map<string, number>();

        spots.forEach((spot) => {
            const hashtags = spot.touristSpotHashtag || [];
            hashtags.forEach((tag) => {
                const normalized = tag.toLowerCase();
                hashtagCounts.set(normalized, (hashtagCounts.get(normalized) || 0) + 1);
            });
        });

        // Return hashtags that appear in at least 2 spots or 30% of spots
        const threshold = Math.max(2, Math.ceil(spots.length * 0.3));
        return Array.from(hashtagCounts.entries())
            .filter(([, count]) => count >= threshold)
            .sort(([, a], [, b]) => b - a)
            .map(([tag]) => tag)
            .slice(0, 5);
    }

    /**
     * Validates and cleans string content
     */
    private validateAndCleanString(value: any, maxLength: number, fallback: string): string {
        if (typeof value !== 'string' || !value.trim()) {
            return fallback;
        }

        const cleaned = value.trim();
        return cleaned.length > maxLength ? cleaned.substring(0, maxLength - 3) + '...' : cleaned;
    }

    /**
     * Calculates fallback duration based on spot count
     */
    private calculateDurationFallback(spotCount: number): string {
        if (spotCount <= 2) return '1 day';
        if (spotCount <= 4) return '2 days';
        if (spotCount <= 6) return '2-3 days';
        if (spotCount <= 8) return '3-4 days';
        return '4-5 days';
    }

    /**
     * Checks if AI content generation is available
     */
    public isAiAvailable(): boolean {
        return this.isOpenAiConfigured;
    }

    /**
     * Generates default human-readable recommendations from keywords
     */
    private generateDefaultRecommendations(keywords: string[]): string[] {
        const recommendationMap: Record<string, string> = {
            // Food and dining
            food: 'Local Food',
            dining: 'Local Food',
            restaurant: 'Local Food',
            culinary: 'Local Food',
            sushi: 'Local Food',
            ramen: 'Local Food',
            
            // Culture and tradition
            culture: 'A good mix of nature and culture',
            cultural: 'A good mix of nature and culture',
            traditional: 'Historical Sites',
            historic: 'Historical Sites',
            history: 'Historical Sites',
            temple: 'Historical Sites',
            shrine: 'Historical Sites',
            
            // Nature and scenery
            nature: 'A good mix of nature and culture',
            natural: 'A good mix of nature and culture',
            scenery: 'Great for Photography',
            scenic: 'Great for Photography',
            mountain: 'A good mix of nature and culture',
            garden: 'A good mix of nature and culture',
            park: 'A good mix of nature and culture',
            
            // Modern and urban
            modern: 'Modern Architecture',
            urban: 'Urban Experience',
            city: 'Urban Experience',
            shopping: 'Shopping District',
            nightlife: 'Nightlife & Entertainment',
            
            // Experience types
            animation: 'Pop Culture & Anime',
            anime: 'Pop Culture & Anime',
            manga: 'Pop Culture & Anime',
            tokyo: 'Ideal for First Time Visitors',
            kyoto: 'Historical Sites',
            osaka: 'Local Food',
            
            // Activity types
            walking: 'Walking Tour',
            cycling: 'Active Experience',
            photography: 'Great for Photography',
            family: 'Family Friendly'
        };

        const recommendations = new Set<string>();
        
        // Map keywords to recommendations
        keywords.forEach(keyword => {
            const normalized = keyword.toLowerCase().trim();
            if (recommendationMap[normalized]) {
                recommendations.add(recommendationMap[normalized]);
            }
        });
        
        // Add defaults if not enough recommendations
        if (recommendations.size === 0) {
            recommendations.add('Ideal for First Time Visitors');
        }
        if (recommendations.size < 3) {
            recommendations.add('A good mix of nature and culture');
            recommendations.add('Local Food');
        }
        
        return Array.from(recommendations).slice(0, 5);
    }

    /**
     * Gets real image from LocationInfo API for a location
     */
    async getLocationImage(locationName: string, latitude?: number, longitude?: number, address?: string): Promise<string | null> {
        try {
            this.logger.debug(`Fetching real image for location: ${locationName}`);
            
            const locationInfo = await this.locationInfoRepository.getLocationInfo(
                locationName,
                latitude,
                longitude,
                address
            );
            
            if (locationInfo.images && locationInfo.images.length > 0) {
                // Return the first (usually best quality) image
                const bestImage = locationInfo.images[0];
                this.logger.debug(`Found real image for ${locationName}: ${bestImage.url}`);
                return bestImage.url;
            }
            
            this.logger.debug(`No images found for ${locationName}`);
            return null;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.warn(`Failed to get location image for ${locationName}: ${errorMessage}`);
            return null;
        }
    }

    /**
     * Validates generation request
     */
    public validateRequest(request: ContentGenerationRequest): void {
        if (!request.cluster || !request.cluster.spots || request.cluster.spots.length === 0) {
            throw new Error('Cluster must contain at least one tourist spot');
        }

        if (!request.userKeywords || request.userKeywords.length === 0) {
            throw new Error('User keywords are required for content generation');
        }

        if (request.userKeywords.some((keyword) => keyword.length > 50)) {
            throw new Error('Keywords must be 50 characters or less');
        }
    }
}

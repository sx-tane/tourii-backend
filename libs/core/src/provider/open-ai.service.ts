import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { AiGeneratedRouteContent, ContentGenerationRequest } from '../domain/ai-route/ai-route';
import { RouteRecommendation } from '../domain/ai-route/route-recommendation';
import { TouristSpot } from '../domain/game/model-route/tourist-spot';
import { TouriiBackendAppErrorType } from '../support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '../support/exception/tourii-backend-app-exception';
import { ValidateUtil } from '../utils/validate.util';

@Injectable()
export class OpenAiService {
    private readonly openai: OpenAI;

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService?.get('OPENAI_API_KEY');
        this.openai = new OpenAI({
            apiKey: apiKey || 'dummy-key', // Fallback to prevent initialization errors
        });
    }

    /**
     * Checks if OpenAI is configured
     * @returns True if OpenAI is configured, false otherwise
     */
    isOpenAiConfigured(): boolean {
        return !!this.configService?.get('OPENAI_API_KEY');
    }

    /**
     * Generates route content using OpenAI
     * @param request - The request object containing the content generation request
     * @returns The generated route content
     */
    async generateAiRouteContentWithOpenAi(
        request: ContentGenerationRequest,
    ): Promise<AiGeneratedRouteContent> {
        // Build the prompt for the generated route
        const prompt = this.buildAiRouteGPTPrompt(request);
        Logger.debug('Calling OpenAI for route content generation', {
            clusterId: request.cluster.id,
            spotCount: request.cluster.spots.length,
            userKeywords: request.userKeywords,
        });

        // Call the OpenAI API
        const response = await this.openai.chat.completions.create({
            model: this.configService?.get('OPENAI_MODEL', 'gpt-4o-mini') || 'gpt-4o-mini',
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

        const responseContent = response.choices[0].message.content;
        if (!responseContent) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_OPENAI_004);
        }

        const parsedContent = this.parseAiGeneratedRouteContentResponse(responseContent, request);

        Logger.debug('OpenAI content generation successful', {
            clusterId: request.cluster.id,
            routeName: parsedContent.routeName,
        });

        return parsedContent;
    }

    /**
     * Builds the prompt for the generated route
     * @param request - The request object containing the content generation request
     * @returns The prompt for the generated route
     */
    buildAiRouteGPTPrompt(request: ContentGenerationRequest): string {
        const { cluster, userKeywords, additionalContext } = request;

        const spotNames = cluster.spots.map((spot) => spot.touristSpotName).filter(Boolean);
        const allHashtags = cluster.spots
            .flatMap((spot) => spot.touristSpotHashtag || [])
            .filter((tag, index, array) => array.indexOf(tag) === index); // unique tags

        const commonHashtags = TouristSpot.findCommonHashtags(cluster.spots);

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
     * @param response - The response from the GPT model
     * @param request - The request object containing the content generation request
     * @returns The parsed and validated content for the generated route
     */
    private parseAiGeneratedRouteContentResponse(
        response: string,
        request: ContentGenerationRequest,
    ): AiGeneratedRouteContent {
        try {
            const parsed = JSON.parse(response);

            // Validate required fields
            const routeName = ValidateUtil.validateAndCleanString(
                parsed.routeName,
                30,
                'Tokyo Discovery',
            );
            const regionDesc = ValidateUtil.validateAndCleanString(
                parsed.regionDesc,
                200,
                'Explore unique attractions in this region.',
            );
            const recommendations = Array.isArray(parsed.recommendations)
                ? parsed.recommendations.slice(0, 5).map((r: unknown) => String(r).trim())
                : RouteRecommendation.generateFallbackRecommendations(
                      request.userKeywords,
                      request.cluster.spots,
                  );
            const estimatedDuration = ValidateUtil.validateAndCleanString(
                parsed.estimatedDuration,
                20,
                TouristSpot.calculateDurationFallback(request.cluster.spots.length),
            );

            return {
                routeName,
                regionDesc,
                recommendations,
                estimatedDuration,
                confidenceScore: 0.9,
            };
        } catch (error) {
            Logger.error(TouriiBackendAppErrorType.E_OPENAI_003, {
                error: error instanceof Error ? error.message : String(error),
                response: response.substring(0, 200),
            });
            return this.generateAiRouteFallbackContent(request);
        }
    }

    /**
     * Generates fallback content for the generated route
     * @param request - The request object containing the content generation request
     * @returns The fallback content for the generated route
     */
    generateAiRouteFallbackContent(request: ContentGenerationRequest): AiGeneratedRouteContent {
        const { cluster, userKeywords } = request;

        const keywordString =
            userKeywords.length > 0
                ? userKeywords
                      .slice(0, 2)
                      .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
                      .join(' & ')
                : 'Discovery';

        const routeName = `${keywordString} ${cluster.region}`.substring(0, 30);
        const regionDesc =
            `Explore ${cluster.spots.length} locations in ${cluster.region} featuring ${userKeywords.slice(0, 2).join(', ')}.`.substring(
                0,
                200,
            );

        return {
            routeName,
            regionDesc,
            recommendations: RouteRecommendation.generateFallbackRecommendations(
                userKeywords,
                cluster.spots,
            ),
            estimatedDuration: TouristSpot.calculateDurationFallback(cluster.spots.length),
            confidenceScore: 0.6, // Lower confidence for fallback content
        };
    }
}

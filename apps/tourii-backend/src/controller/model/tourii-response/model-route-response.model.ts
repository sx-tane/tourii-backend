import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MetadataFieldsSchema } from './common/metadata-fields-response.model';
import { TouristSpotResponseSchema, WeatherInfoSchema } from './tourist-spot-response.model';

export const ModelRouteResponseSchema = z.object({
    modelRouteId: z.string().describe('Unique identifier for the model route'),
    storyId: z.string().optional().describe('Unique identifier for the story (optional for standalone routes)'),
    routeName: z.string().describe('Name of the model route'),
    region: z.string().describe('Region of the model route'),
    regionDesc: z.string().describe('Description of the region'),
    recommendation: z.array(z.string()).describe('Recommendation of the model route'),
    regionLatitude: z.number().describe('Latitude of the region'),
    regionLongitude: z.number().describe('Longitude of the region'),
    regionBackgroundMedia: z.string().describe("URL to the region's cover media"),
    touristSpotList: z
        .array(TouristSpotResponseSchema)
        .describe('List of tourist spots in the model route'),
    regionWeatherInfo: WeatherInfoSchema.describe('Current weather info for the region').extend({
        regionName: z.string().describe('Name of the region'),
    }),
    ...MetadataFieldsSchema,
});

export class ModelRouteResponseDto extends createZodDto(ModelRouteResponseSchema) {}

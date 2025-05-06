import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
    TouristSpotResponseSchema,
    WeatherInfoSchema,
} from './tourist-spot-response.model';

export const ModelRouteResponseSchema = z.object({
    modelRouteId: z.string().describe('Unique identifier for the model route'),
    storyId: z.string().describe('Unique identifier for the story'),
    routeName: z.string().describe('Name of the model route'),
    region: z.string().describe('Region of the model route'),
    recommendation: z
        .array(z.string())
        .describe('Recommendation of the model route'),
    regionLatitude: z.number().describe('Latitude of the region'),
    regionLongitude: z.number().describe('Longitude of the region'),
    regionBackgroundMedia: z
        .string()
        .describe("URL to the region's cover media"),
    touristSpotList: z
        .array(TouristSpotResponseSchema)
        .describe('List of tourist spots in the model route'),
    regionWeatherInfo: WeatherInfoSchema.describe(
        'Current weather info for the region',
    ),
    delFlag: z
        .boolean()
        .describe('Flag to indicate if the model route is deleted'),
    insUserId: z.string().describe('ID of user who created this record'),
    insDateTime: z.string().describe('Timestamp of record creation'),
    updUserId: z.string().describe('ID of user who last updated this record'),
    updDateTime: z.string().describe('Timestamp of last record update'),
});

export class ModelRouteResponseDto extends createZodDto(
    ModelRouteResponseSchema,
) {}

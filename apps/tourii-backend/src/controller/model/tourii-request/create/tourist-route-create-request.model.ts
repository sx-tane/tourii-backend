import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const TouristRouteCreateRequestSchema = z.object({
    routeName: z
        .string()
        .min(1)
        .max(100)
        .describe('Name of the tourist route (1-100 characters)'),
    regionDesc: z
        .string()
        .min(1)
        .max(500)
        .describe('Description of the route (1-500 characters)'),
    recommendations: z
        .array(z.string())
        .min(1)
        .max(10)
        .describe('List of recommendations for this route (1-10 items)'),
    touristSpotIds: z
        .array(z.string())
        .min(1)
        .max(20)
        .describe('Array of existing tourist spot IDs to include (1-20 spots)'),
});

export class TouristRouteCreateRequestDto extends createZodDto(TouristRouteCreateRequestSchema) {}
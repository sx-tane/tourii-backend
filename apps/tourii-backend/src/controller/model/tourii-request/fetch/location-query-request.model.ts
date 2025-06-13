import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LocationQueryRequestSchema = z.object({
    query: z.string().min(1).describe('Place name or search query'),
    latitude: z.number().optional().describe('Latitude for location bias'),
    longitude: z.number().optional().describe('Longitude for location bias'),
});

export class LocationQueryDto extends createZodDto(LocationQueryRequestSchema) {}

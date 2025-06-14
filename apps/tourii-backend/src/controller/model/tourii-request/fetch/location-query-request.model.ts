import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LocationQueryRequestSchema = z.object({
    query: z.string().describe('Place name or search query'),
    latitude: z.string().optional().describe('Latitude for location bias'),
    longitude: z.string().optional().describe('Longitude for location bias'),
    address: z.string().optional().describe('Address for enhanced search accuracy'),
});

export class LocationQueryDto extends createZodDto(LocationQueryRequestSchema) {}

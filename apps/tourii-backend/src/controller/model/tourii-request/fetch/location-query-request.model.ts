import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LocationQueryRequestSchema = z.object({
    query: z.string().min(1).describe('Place name or search query'),
});

export class LocationQueryDto extends createZodDto(LocationQueryRequestSchema) {}

import { StoryStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ChapterProgressRequestSchema = z.object({
    userId: z.string().describe('ID of the user reading the chapter'),
    status: z.nativeEnum(StoryStatus).describe('Current story status'),
    latitude: z.number().optional().describe('Optional latitude for location tracking'),
    longitude: z.number().optional().describe('Optional longitude for location tracking'),
});

export class ChapterProgressRequestDto extends createZodDto(ChapterProgressRequestSchema) {}

import { StoryStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ChapterProgressRequestSchema = z.object({
    userId: z.string().describe('ID of the user reading the chapter'),
    status: z.nativeEnum(StoryStatus).describe('Current story status'),
});

export class ChapterProgressRequestDto extends createZodDto(ChapterProgressRequestSchema) {}

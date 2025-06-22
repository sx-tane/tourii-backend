import { StoryStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const StoryProgressResponseSchema = z.object({
    storyChapterId: z.string().describe('ID of the story chapter'),
    status: z.nativeEnum(StoryStatus).describe('Current reading status'),
    unlockedAt: z.date().nullable().describe('Timestamp when the user started reading'),
    finishedAt: z.date().nullable().describe('Timestamp when the user finished reading'),
    canStart: z.boolean().describe('Whether the user can start reading this chapter'),
    canComplete: z.boolean().describe('Whether the user can complete this chapter'),
});

export class StoryProgressResponseDto extends createZodDto(StoryProgressResponseSchema) {}

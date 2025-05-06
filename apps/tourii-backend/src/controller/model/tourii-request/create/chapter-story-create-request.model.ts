import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const StoryChapterCreateRequestSchema = z.object({
    touristSpotId: z
        .string()
        .describe('Unique identifier for the tourist spot'),
    chapterNumber: z
        .string()
        .describe("Chapter number or position (e.g., 'Prologue', 'Chapter 1')"),
    chapterTitle: z.string().describe('Title of the story chapter'),
    chapterDesc: z
        .string()
        .describe('Detailed description or content of the story'),
    chapterImage: z.string().describe('URL to the fictional chapter image'),
    characterNameList: z
        .array(z.string())
        .describe('List of character names involved in the chapter'),
    realWorldImage: z.string().describe('URL to the real-world location image'),
    chapterVideoUrl: z
        .string()
        .describe('URL to the chapter video for desktop viewing'),
    chapterVideoMobileUrl: z
        .string()
        .describe('URL to the chapter video optimized for mobile'),
    chapterPdfUrl: z.string().describe('URL to the downloadable PDF version'),
    isUnlocked: z
        .boolean()
        .describe(
            'Whether the chapter is available to users without prerequisites',
        ),
});

export class StoryChapterCreateRequestDto extends createZodDto(
    StoryChapterCreateRequestSchema,
) {}

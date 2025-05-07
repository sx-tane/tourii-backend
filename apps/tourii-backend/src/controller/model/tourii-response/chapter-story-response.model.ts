import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const StoryChapterResponseSchema = z.object({
    storyId: z.string().describe('Unique identifier for the story'),
    touristSpotId: z.string().describe('Unique identifier for the tourist spot'),
    storyChapterId: z.string().describe('Unique identifier for the story chapter'),
    sagaName: z.string().describe('Name of the saga'),
    chapterNumber: z.string().describe('Chapter number or position'),
    chapterTitle: z.string().describe('Title of the chapter'),
    chapterDesc: z.string().describe('Detailed description of the chapter'),
    chapterImage: z.string().describe('URL to the fictional chapter image'),
    characterNameList: z
        .array(z.string())
        .describe('List of character names involved in the chapter'),
    realWorldImage: z.string().describe('URL to the real-world location image'),
    chapterVideoUrl: z.string().describe('URL to the chapter video for desktop viewing'),
    chapterVideoMobileUrl: z.string().describe('URL to the chapter video optimized for mobile'),
    chapterPdfUrl: z.string().describe('URL to the downloadable PDF version'),
    isUnlocked: z
        .boolean()
        .describe('Whether the chapter is available to users without prerequisites'),
    delFlag: z.boolean().describe('Flag to indicate if the story chapter is deleted'),
    insUserId: z.string().describe('ID of user who created this record'),
    insDateTime: z.string().describe('Timestamp of record creation'),
    updUserId: z.string().describe('ID of user who last updated this record'),
    updDateTime: z.string().describe('Timestamp of last record update'),
});

export class StoryChapterResponseDto extends createZodDto(StoryChapterResponseSchema) {}

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ChapterHighlightSchema = z.object({
    storyId: z.string().describe('Story ID'),
    chapterId: z.string().describe('Chapter ID'),
    chapterNumber: z.string().describe('Chapter number (e.g., "Chapter 1", "Prologue")'),
    title: z.string().describe('Chapter title'),
    imageUrl: z.string().optional().nullable().describe('Cover image URL'),
    region: z
        .string()
        .optional()
        .transform((val) => val?.toLowerCase().trim())
        .nullable()
        .describe('Region of the story'),
    link: z.string().nullable().describe('Deep link to chapter'),
});

export const QuestHighlightSchema = z.object({
    questId: z.string().describe('Quest ID'),
    title: z.string().describe('Quest title'),
    imageUrl: z.string().optional().nullable().describe('Quest image URL'),
    link: z.string().nullable().describe('Deep link to quest'),
});

export const HomepageHighlightsResponseSchema = z.object({
    latestChapter: ChapterHighlightSchema.nullable(),
    popularQuests: z.array(QuestHighlightSchema).describe('Top 3 popular quests'),
});

export class ChapterHighlightDto extends createZodDto(ChapterHighlightSchema) {}
export class QuestHighlightDto extends createZodDto(QuestHighlightSchema) {}
export class HomepageHighlightsResponseDto extends createZodDto(HomepageHighlightsResponseSchema) {}

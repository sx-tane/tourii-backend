import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ChapterHighlightSchema = z.object({
    storyId: z.string().describe('Story ID'),
    chapterId: z.string().describe('Chapter ID'),
    title: z.string().describe('Chapter title'),
    imageUrl: z.string().optional().nullable().describe('Cover image URL'),
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
    popularQuest: QuestHighlightSchema.nullable(),
});

export class ChapterHighlightDto extends createZodDto(ChapterHighlightSchema) {}
export class QuestHighlightDto extends createZodDto(QuestHighlightSchema) {}
export class HomepageHighlightsResponseDto extends createZodDto(HomepageHighlightsResponseSchema) {}

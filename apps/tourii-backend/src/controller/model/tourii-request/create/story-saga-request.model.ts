import { z } from 'zod';
import { StoryChapterCreateRequestSchema } from './chapter-story-request.model';
import { createZodDto } from 'nestjs-zod';

export const StorySagaCreateRequestSchema = z.object({
  sagaName: z
    .string()
    .describe("Name of the story saga (e.g., 'Prologue', 'Bungo Ono')"),
  sagaDesc: z.string().describe("Detailed description of the saga's narrative"),
  backgroundMedia: z
    .string()
    .describe("URL to the saga's cover media (image or video)"),
  mapImage: z.string().optional().describe('URL to the map image for the saga'),
  location: z
    .string()
    .optional()
    .describe("Real-world location of the saga (e.g., 'Tokyo')"),
  order: z.number().describe('Display order in the saga list'),
  isPrologue: z.boolean().describe('Whether the saga is a prologue'),
  isSelected: z.boolean().describe('Whether the saga is selected by default'),
  chapterList: z
    .array(StoryChapterCreateRequestSchema)
    .optional()
    .describe('List of chapters in the saga'),
});

export const StorySagaCreateOnlyRequestSchema = z.object({
  sagaName: z
    .string()
    .describe("Name of the story saga (e.g., 'Prologue', 'Bungo Ono')"),
  sagaDesc: z.string().describe("Detailed description of the saga's narrative"),
  backgroundMedia: z
    .string()
    .describe("URL to the saga's cover media (image or video)"),
  mapImage: z.string().optional().describe('URL to the map image for the saga'),
  location: z
    .string()
    .optional()
    .describe("Real-world location of the saga (e.g., 'Tokyo')"),
  order: z.number().describe('Display order in the saga list'),
  isPrologue: z.boolean().describe('Whether the saga is a prologue'),
  isSelected: z.boolean().describe('Whether the saga is selected by default'),
  insUserId: z.string().describe('User ID of the creator'),
});

export class StorySagaCreateRequestDto extends createZodDto(
  StorySagaCreateRequestSchema,
) {}

export class StorySagaCreateOnlyRequestDto extends createZodDto(
  StorySagaCreateOnlyRequestSchema,
) {}

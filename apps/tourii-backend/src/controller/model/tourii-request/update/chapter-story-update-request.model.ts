import { z } from "zod";
import { StoryChapterCreateRequestSchema } from "../create/chapter-story-create-request.model";
import { createZodDto } from "nestjs-zod";

export const StoryChapterUpdateRequestSchema =
	StoryChapterCreateRequestSchema.extend({
		storyChapterId: z
			.string()
			.describe("Unique identifier for the story chapter"),
		delFlag: z
			.boolean()
			.describe("Flag to indicate if the story chapter is deleted"),
		updUserId: z
			.string()
			.describe("Unique identifier for the user who updated the story chapter"),
	});

export const StoryChapterUpdateOnlyRequestSchema =
	StoryChapterCreateRequestSchema.extend({
		storyChapterId: z
			.string()
			.describe("Unique identifier for the story chapter"),
	});

export class StoryChapterUpdateRequestDto extends createZodDto(
	StoryChapterUpdateRequestSchema,
) {}

export class StoryChapterUpdateOnlyRequestDto extends createZodDto(
	StoryChapterUpdateOnlyRequestSchema,
) {}

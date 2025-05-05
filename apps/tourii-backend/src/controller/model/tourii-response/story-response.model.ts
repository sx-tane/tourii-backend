import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { StoryChapterResponseSchema } from "./chapter-story-response.model";

export const StoryResponseSchema = z.object({
	storyId: z.string().describe("Unique identifier for the story saga"),
	sagaName: z.string().describe("Name of the story saga"),
	sagaDesc: z.string().describe("Detailed description of the saga's narrative"),
	backgroundMedia: z
		.string()
		.describe("URL to the saga's cover media (image or video)"),
	mapImage: z.string().describe("URL to the map image for the saga"),
	location: z.string().describe("Real-world location of the saga"),
	order: z.number().describe("Display order in the saga list"),
	isPrologue: z.boolean().describe("Whether the saga is a prologue"),
	isSelected: z.boolean().describe("Whether the saga is selected by default"),
	chapterList: z
		.array(StoryChapterResponseSchema)
		.optional()
		.describe("List of stories in the saga"),
	delFlag: z.boolean().describe("Flag to indicate if the story is deleted"),
	insUserId: z.string().describe("ID of user who created this record"),
	insDateTime: z.string().describe("Timestamp of record creation"),
	updUserId: z.string().describe("ID of user who last updated this record"),
	updDateTime: z.string().describe("Timestamp of last record update"),
});

export class StoryResponseDto extends createZodDto(StoryResponseSchema) {}

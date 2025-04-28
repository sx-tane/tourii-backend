import { z } from "zod";
import {
	StoryCreateOnlyRequestSchema,
	StoryCreateRequestSchema,
} from "../create/story-create-request.model";
import { createZodDto } from "nestjs-zod";

export const StoryUpdateRequestSchema = StoryCreateRequestSchema.extend({
	sagaId: z.string().describe("Unique identifier for the story saga"),
	delFlag: z
		.boolean()
		.describe("Flag to indicate if the story saga is deleted"),
	updUserId: z
		.string()
		.describe("Unique identifier for the user who updated the story saga"),
});

export const StoryUpdateOnlyRequestSchema = StoryCreateOnlyRequestSchema.extend(
	{
		sagaId: z.string().describe("Unique identifier for the story saga"),
	},
);

export class StoryUpdateRequestDto extends createZodDto(
	StoryUpdateRequestSchema,
) {}

export class StoryUpdateOnlyRequestDto extends createZodDto(
	StoryUpdateOnlyRequestSchema,
) {}

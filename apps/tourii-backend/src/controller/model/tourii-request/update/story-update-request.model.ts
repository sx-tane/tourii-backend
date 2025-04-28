import { z } from "zod";
import {
	StoryCreateOnlyRequestSchema,
	StoryCreateRequestSchema,
} from "../create/story-create-request.model";
import { createZodDto } from "nestjs-zod";

export const StoryUpdateRequestSchema = StoryCreateRequestSchema.extend({
	sagaId: z
		.string()
		.describe("Unique identifier for the story saga")
		.openapi({ example: "saga-123e4567-e89b-12d3-a456-426614174000" }),
	delFlag: z
		.boolean()
		.describe("Flag to indicate if the story saga is deleted")
		.openapi({ example: false }),
	updUserId: z
		.string()
		.describe("Unique identifier for the user who updated the story saga")
		.openapi({ example: "user-987e6543-e21b-54f7-b890-123456789012" }),
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

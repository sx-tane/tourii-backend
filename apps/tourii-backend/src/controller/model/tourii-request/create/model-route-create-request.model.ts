import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { TouristSpotCreateRequestSchema } from "./tourist-spot-create-request.model";
export const ModelRouteCreateRequestSchema = z.object({
	storyId: z.string().describe("Unique identifier for the story"),
	routeName: z.string().describe("Name of the model route"),
	region: z.string().describe("Region of the model route"),
	recommendation: z
		.array(z.string())
		.describe("Recommendation of the model route"),
	touristSpotList: z
		.array(TouristSpotCreateRequestSchema)
		.describe("List of tourist spots in the model route"),
});

export const ModelRouteCreateOnlyRequestSchema = z.object({
	storyId: z.string().describe("Unique identifier for the story"),
	routeName: z.string().describe("Name of the model route"),
	region: z.string().describe("Region of the model route"),
	recommendation: z
		.array(z.string())
		.describe("Recommendation of the model route"),
});

export class ModelRouteCreateRequestDto extends createZodDto(
	ModelRouteCreateRequestSchema,
) {}

export class ModelRouteCreateOnlyRequestDto extends createZodDto(
	ModelRouteCreateOnlyRequestSchema,
) {}

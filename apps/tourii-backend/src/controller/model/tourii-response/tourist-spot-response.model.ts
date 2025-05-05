import { z } from "zod";
import { ImageSetSchema } from "../tourii-request/create/tourist-spot-create-request.model";
import { createZodDto } from "nestjs-zod";

export const TouristSpotResponseSchema = z.object({
	touristSpotId: z.string().describe("Unique identifier for the tourist spot"),
	touristSpotName: z.string().describe("Name of the tourist spot"),
	touristSpotDesc: z.string().describe("Description of the tourist spot"),
	bestVisitTime: z.string().describe("Best visit time of the tourist spot"),
	address: z.string().describe("Address of the tourist spot"),
	touristSpotLatitude: z.number().describe("Latitude of the tourist spot"),
	touristSpotLongitude: z.number().describe("Longitude of the tourist spot"),
	storyChapterLink: z
		.string()
		.optional()
		.describe("Link to the related story chapter"),
	imageSet: ImageSetSchema.optional().describe(
		"Image set for the tourist spot",
	),
	delFlag: z
		.boolean()
		.describe("Flag to indicate if the tourist spot is deleted"),
	insUserId: z.string().describe("ID of user who created this record"),
	insDateTime: z.string().describe("Timestamp of record creation"),
	updUserId: z.string().describe("ID of user who last updated this record"),
	updDateTime: z.string().describe("Timestamp of last record update"),
});

export class TouristSpotResponseDto extends createZodDto(
	TouristSpotResponseSchema,
) {}

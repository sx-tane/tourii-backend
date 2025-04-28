import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

extendZodWithOpenApi(z);

export const StoryChapterCreateRequestSchema = z.object({
	touristSpotId: z
		.string()
		.describe("Unique identifier for the tourist spot")
		.openapi({ example: "TST20250417-123456-123456-123456-123456" }),
	chapterNumber: z
		.string()
		.describe("Chapter number or position (e.g., 'Prologue', 'Chapter 1')")
		.openapi({ example: "1" }),
	chapterTitle: z.string().describe("Title of the story chapter"),
	chapterDesc: z
		.string()
		.describe("Detailed description or content of the story")
		.openapi({ example: "This is a story about a tourist spot" }),
	chapterImage: z.string().describe("URL to the fictional chapter image"),
	characterNameList: z
		.array(z.string())
		.describe("List of character names involved in the chapter")
		.openapi({ example: ["Ningi", "Amaterasu"] }),
	realWorldImage: z.string().describe("URL to the real-world location image")
		.openapi({ example: "https://example.com/real-world-image.jpg" }),
	chapterVideoUrl: z
		.string()
		.describe("URL to the chapter video for desktop viewing")
		.openapi({ example: "https://example.com/chapter-video.mp4" }),
	chapterVideoMobileUrl: z
		.string()
		.describe("URL to the chapter video optimized for mobile")
		.openapi({ example: "https://example.com/chapter-video-mobile.mp4" }),
	chapterPdfUrl: z
		.string()
		.describe("URL to the downloadable PDF version")
		.openapi({ example: "https://example.com/chapter-pdf.pdf" }),
	isUnlocked: z
		.boolean()
		.describe(
			"Whether the chapter is available to users without prerequisites",
		)
		.openapi({ example: true }),
});

export class StoryChapterCreateRequestDto extends createZodDto(
	StoryChapterCreateRequestSchema,
) {}

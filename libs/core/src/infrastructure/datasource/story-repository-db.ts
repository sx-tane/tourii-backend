// biome-ignore lint/style/useImportType: <explanation>
import type { StoryEntity } from "@app/core/domain/game/story/story.entity";
import type { StoryRepository } from "@app/core/domain/game/story/story.repository";
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from "@app/core/provider/prisma.service";
import type { story_chapter } from "@prisma/client";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { StoryMapper } from "../mapper/story.mapper";
import type { StoryRelationModel } from "prisma/relation-model/story-relation-model";
// biome-ignore lint/style/useImportType: <explanation>
import { CachingService } from "@app/core/provider/caching.service";
import type { StoryChapter } from "@app/core/domain/game/story/chapter-story";

// Define constants for cache keys and TTL for maintainability
const ALL_STORIES_CACHE_KEY = "stories:all";
// Define a specific cache key prefix for the RAW story_chapter Prisma models
const STORY_CHAPTER_RAW_CACHE_KEY_PREFIX = "story_chapter_raw";
// TTL (Time-To-Live) in seconds
const CACHE_TTL_SECONDS = 3600;

@Injectable()
export class StoryRepositoryDb implements StoryRepository {
	constructor(
		private prisma: PrismaService,
		private cachingService: CachingService,
	) {}

	async createStory(story: StoryEntity): Promise<StoryEntity> {
		const createdStoryDb = await this.prisma.story.create({
			data: StoryMapper.storyEntityToPrismaInput(story),
			include: {
				story_chapter: true,
			},
		});

		// Invalidate the cache using the CachingService
		await this.cachingService.invalidate(ALL_STORIES_CACHE_KEY);

		return StoryMapper.prismaModelToStoryEntity(createdStoryDb);
	}

	async getStories(): Promise<StoryEntity[]> {
		// Define the function to fetch data from the database
		const fetchDataFn = async (): Promise<StoryRelationModel[]> => {
			return this.prisma.story.findMany({
				include: {
					story_chapter: true,
				},
			});
		};

		// Use the CachingService to get/set the raw data
		const storiesDb = await this.cachingService.getOrSet<StoryRelationModel[]>(
			ALL_STORIES_CACHE_KEY,
			fetchDataFn,
			CACHE_TTL_SECONDS,
		);

		// If fetching/caching failed, storiesDb might be null, return empty array
		if (!storiesDb) {
			return [];
		}

		// Map the raw data (from cache or DB via service) to entities
		const storiesEntities = storiesDb.map((story) =>
			StoryMapper.prismaModelToStoryEntity(story),
		);

		// Return mapped entities
		return storiesEntities;
	}

	async getStoryChapters(storyId: string): Promise<StoryChapter[]> {
		// Define the unique cache key for this story's raw chapter data
		const cacheKey = `${STORY_CHAPTER_RAW_CACHE_KEY_PREFIX}:${storyId}`;

		// Define the function to fetch ONLY the raw chapter data from Prisma
		const fetchRawChaptersFn = async (): Promise<story_chapter[] | null> => {
			const chapters = await this.prisma.story_chapter.findMany({
				where: {
					story_id: storyId,
				},
				orderBy: {
					chapter_number: "asc",
				},
			});
			// Return chapters array, or null if empty to potentially cache 'not found'
			// Or return [] if you don't want to cache empty results
			return chapters.length > 0 ? chapters : []; // Return empty array if none found
		};

		// Use the CachingService to get/set the raw Prisma chapter models
		const storyChaptersDb = await this.cachingService.getOrSet<
			story_chapter[] | null
		>(cacheKey, fetchRawChaptersFn, CACHE_TTL_SECONDS);

		// If no raw chapters found (from cache or fresh fetch), return empty array
		if (!storyChaptersDb || storyChaptersDb.length === 0) {
			return [];
		}

		// --- Fetch sagaName separately (not cached with chapters in this approach) ---
		const story = await this.prisma.story.findUnique({
			where: { story_id: storyId },
			select: { saga_name: true },
		});

		if (!story) {
			return []; // Or potentially throw an error for inconsistent state
		}
		const sagaName = story.saga_name;
		// --- End fetching sagaName ---

		// --- Map raw data (from cache/DB) to domain entities ---
		const storyChapterInstances = StoryMapper.storyChapterToEntity(
			storyChaptersDb,
			sagaName,
		);

		// Return the array of proper StoryChapter instances
		return storyChapterInstances;
	}
}

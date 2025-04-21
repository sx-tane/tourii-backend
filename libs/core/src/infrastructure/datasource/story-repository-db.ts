import { CACHE_MANAGER } from "@nestjs/cache-manager";
// biome-ignore lint/style/useImportType: <explanation>
import type { StoryEntity } from "@app/core/domain/game/story/story.entity";
import type { StoryRepository } from "@app/core/domain/game/story/story.repository";
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from "@app/core/provider/prisma.service";
import type { Prisma } from "@prisma/client";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { StoryMapper } from "../mapper/story.mapper";
import type { StoryRelationModel } from "prisma/relation-model/story-relation-model";
// biome-ignore lint/style/useImportType: <explanation>
import { CachingService } from "@app/core/provider/caching.service";

// Define constants for cache keys and TTL for maintainability
const ALL_STORIES_CACHE_KEY = "stories:all";
// TTL (Time-To-Live) in seconds - sync with module config or use a separate env var if needed
// Using a default here, but ideally, this could come from config too.
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
}

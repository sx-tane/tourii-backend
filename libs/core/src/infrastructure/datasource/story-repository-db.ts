import type { StoryChapter } from '@app/core/domain/game/story/chapter-story';
import type { StoryEntity } from '@app/core/domain/game/story/story.entity';
import type { StoryRepository } from '@app/core/domain/game/story/story.repository';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { ContextStorage } from '@app/core/support/context/context-storage';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable, Logger } from '@nestjs/common';
import type { story_chapter } from '@prisma/client';
import type { StoryRelationModel } from 'prisma/relation-model/story-relation-model';
import { StoryMapper } from '../mapper/story.mapper';

// Define constants for cache keys and TTL for maintainability
const ALL_STORIES_CACHE_KEY = 'stories:all';
// Define a specific cache key prefix for the RAW story_chapter Prisma models
const STORY_CHAPTER_RAW_CACHE_KEY_PREFIX = 'story_chapter_raw';
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

        // Clear all cache to ensure updates are reflected
        await this.cachingService.clearAll();

        return StoryMapper.prismaModelToStoryEntity(createdStoryDb);
    }

    async createStoryChapter(storyId: string, chapter: StoryChapter): Promise<StoryChapter> {
        const createdChapterDb = await this.prisma.story_chapter.create({
            data: StoryMapper.storyChapterOnlyEntityToPrismaInput(storyId, chapter),
            include: {
                story: {
                    select: {
                        saga_name: true,
                    },
                },
            },
        });

        return StoryMapper.storyChapterToEntity(
            [createdChapterDb],
            createdChapterDb.story.saga_name,
        )[0];
    }

    async updateStory(story: StoryEntity): Promise<StoryEntity> {
        if (!story.storyId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023);
        }
        const updated = await this.prisma.story.update({
            where: { story_id: story.storyId },
            data: StoryMapper.storyEntityToPrismaUpdateInput(story),
            include: { story_chapter: true },
        });
        // Clear all cache to ensure updates are reflected
        await this.cachingService.clearAll();
        return StoryMapper.prismaModelToStoryEntity(updated);
    }

    async updateStoryChapter(chapter: StoryChapter): Promise<StoryChapter> {
        if (!chapter.storyChapterId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023);
        }
        const updated = await this.prisma.story_chapter.update({
            where: { story_chapter_id: chapter.storyChapterId },
            data: StoryMapper.storyChapterEntityToPrismaUpdateInput(chapter),
            include: {
                story: { select: { saga_name: true, story_id: true } },
            },
        });
        const cacheKey = `${STORY_CHAPTER_RAW_CACHE_KEY_PREFIX}:${updated.story.story_id}`;
        await this.cachingService.invalidate(cacheKey);
        return StoryMapper.storyChapterToEntity([updated], updated.story.saga_name)[0];
    }

    async getStories(): Promise<StoryEntity[] | undefined> {
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
            return undefined;
        }

        // Map the raw data (from cache or DB via service) to entities
        const storiesEntities = storiesDb.map((story) =>
            StoryMapper.prismaModelToStoryEntity(story),
        );

        // Return mapped entities
        return storiesEntities;
    }

    async getStoryById(storyId: string): Promise<StoryEntity> {
        const storyDb = await this.prisma.story.findUnique({
            where: {
                story_id: storyId,
            },
            include: {
                story_chapter: true,
            },
        });
        if (!storyDb) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023);
        }
        return StoryMapper.prismaModelToStoryEntity(storyDb);
    }

    async updateTouristSpotIdListInStoryChapter(
        pairs: {
            storyChapterId: string;
            touristSpotId: string;
        }[],
    ): Promise<boolean> {
        try {
            // Use a transaction to perform all updates together
            await this.prisma.$transaction(
                // Map each pair to an update promise
                pairs.map((pair) =>
                    this.prisma.story_chapter.update({
                        where: {
                            story_chapter_id: pair.storyChapterId,
                        },
                        data: {
                            tourist_spot_id: pair.touristSpotId,
                            upd_date_time: ContextStorage.getStore()?.getSystemDateTimeJST(),
                        },
                    }),
                ),
            );
            return true;
        } catch (error) {
            Logger.error(
                `Failed to update tourist spots for chapters: ${error instanceof Error ? error.message : String(error)}`,
                error instanceof Error ? error.stack : undefined,
            );
            return false;
        }
    }

    async getStoryChaptersByStoryId(storyId: string): Promise<StoryChapter[]> {
        // Define the unique cache key for this story's raw chapter data
        const cacheKey = `${STORY_CHAPTER_RAW_CACHE_KEY_PREFIX}:${storyId}`;

        // Define the function to fetch ONLY the raw chapter data from Prisma
        const fetchRawChaptersFn = async (): Promise<story_chapter[] | null> => {
            const chapters = await this.prisma.story_chapter.findMany({
                where: {
                    story_id: storyId,
                },
                orderBy: {
                    chapter_number: 'asc',
                },
            });
            // Return chapters array, or null if empty to potentially cache 'not found'
            // Or return [] if you don't want to cache empty results
            return chapters.length > 0 ? chapters : []; // Return empty array if none found
        };

        // Use the CachingService to get/set the raw Prisma chapter models
        const storyChaptersDb = await this.cachingService.getOrSet<story_chapter[] | null>(
            cacheKey,
            fetchRawChaptersFn,
            CACHE_TTL_SECONDS,
        );

        // If no raw chapters found (from cache or fresh fetch), return empty array
        if (!storyChaptersDb || storyChaptersDb.length === 0) {
            return [];
        }

        // --- Fetch sagaName separately (not cached with chapters in this approach) ---
        const story = await this.prisma.story.findUnique({
            where: {
                story_id: storyId,
            },
            select: {
                saga_name: true,
            },
        });

        if (!story) {
            return []; // Or potentially throw an error for inconsistent state
        }
        const sagaName = story.saga_name;
        // --- End fetching sagaName ---

        // --- Map raw data (from cache/DB) to domain entities ---
        const storyChapterInstances = StoryMapper.storyChapterToEntity(storyChaptersDb, sagaName);

        // Return the array of proper StoryChapter instances
        return storyChapterInstances;
    }

    async deleteStory(storyId: string): Promise<boolean> {
        await this.prisma.$transaction([
            this.prisma.story_chapter.deleteMany({ where: { story_id: storyId } }),
            this.prisma.story.delete({ where: { story_id: storyId } }),
        ]);
        // Clear all cache to ensure consistency
        await this.cachingService.clearAll();
        return true;
    }

    async deleteStoryChapter(chapterId: string): Promise<boolean> {
        await this.prisma.story_chapter.delete({
            where: { story_chapter_id: chapterId },
        });
        // Clear all cache to ensure consistency
        await this.cachingService.clearAll();
        return true;
    }
}

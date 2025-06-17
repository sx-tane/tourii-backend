import { cleanDb } from '@app/core-test/prisma/clean-db';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Test, type TestingModule } from '@nestjs/testing';
import { StoryStatus, LevelType } from '@prisma/client';
import { UserStoryLogRepositoryDb } from './user-story-log.repository-db';

describe('UserStoryLogRepositoryDb', () => {
    let repository: UserStoryLogRepositoryDb;
    let prisma: PrismaService;

    const userId = 'test-user-id';
    const storyId = 'test-story-id';
    const chapterId = 'test-chapter-id';

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserStoryLogRepositoryDb, PrismaService],
        }).compile();

        repository = module.get(UserStoryLogRepositoryDb);
        prisma = module.get(PrismaService);
        await prisma.$connect();
    });

    afterAll(async () => {
        await cleanDb();
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await cleanDb();
        // Create prerequisite data
        await prisma.user.create({
            data: {
                user_id: userId,
                username: 'test-user',
                password: 'password',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.story.create({
            data: {
                story_id: storyId,
                saga_name: 'Test Saga',
                saga_desc: 'A saga for testing',
                order: 1,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.model_route.create({
            data: {
                model_route_id: 'route1',
                story_id: storyId,
                route_name: 'Test Route',
                region: 'Test Region',
                region_latitude: 0,
                region_longitude: 0,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.tourist_spot.create({
            data: {
                tourist_spot_id: 'spot1',
                model_route_id: 'route1',
                story_chapter_id: chapterId,
                tourist_spot_name: 'Test Spot',
                tourist_spot_desc: 'A spot for testing',
                latitude: 0,
                longitude: 0,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.story_chapter.create({
            data: {
                story_chapter_id: chapterId,
                tourist_spot_id: 'spot1',
                story_id: storyId,
                chapter_title: 'Test Chapter',
                chapter_number: '1',
                chapter_desc: 'A chapter for testing',
                chapter_image: 'image.png',
                character_name_list: [],
                real_world_image: 'image.png',
                chapter_pdf_url: 'http://example.com/a.pdf',
                chapter_video_url: 'http://example.com/a.mp4',
                chapter_video_mobile_url: 'http://example.com/a_mobile.mp4',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
    });

    it('should create a new log when tracking progress for the first time', async () => {
        await repository.trackProgress(userId, chapterId, StoryStatus.IN_PROGRESS);

        const log = await prisma.user_story_log.findFirst({
            where: { user_id: userId, story_chapter_id: chapterId },
        });

        expect(log).not.toBeNull();
        expect(log?.status).toEqual(StoryStatus.IN_PROGRESS);
        expect(log?.unlocked_at).not.toBeNull();
        expect(log?.finished_at).toBeNull();
    });

    it('should update an existing log when tracking progress again', async () => {
        // First, create the log
        await repository.trackProgress(userId, chapterId, StoryStatus.IN_PROGRESS);
        const initialLog = await prisma.user_story_log.findFirst({
            where: { user_id: userId, story_chapter_id: chapterId },
        });
        expect(initialLog?.finished_at).toBeNull();

        // Then, update it to COMPLETED
        await repository.trackProgress(userId, chapterId, StoryStatus.COMPLETED);
        const updatedLog = await prisma.user_story_log.findFirst({
            where: { user_id: userId, story_chapter_id: chapterId },
        });

        expect(updatedLog).not.toBeNull();
        expect(updatedLog?.user_story_log_id).toEqual(initialLog?.user_story_log_id);
        expect(updatedLog?.status).toEqual(StoryStatus.COMPLETED);
        expect(updatedLog?.finished_at).not.toBeNull();
    });

    it('should throw an error if the chapter does not exist', async () => {
        await expect(
            repository.trackProgress(userId, 'non-existent-chapter', StoryStatus.IN_PROGRESS),
        ).rejects.toThrow(new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023));
    });

    describe('startStoryReading', () => {
        it('should create a new log with IN_PROGRESS status', async () => {
            await repository.startStoryReading(userId, chapterId);

            const log = await prisma.user_story_log.findFirst({
                where: { user_id: userId, story_chapter_id: chapterId },
            });

            expect(log).not.toBeNull();
            expect(log?.status).toEqual(StoryStatus.IN_PROGRESS);
            expect(log?.unlocked_at).not.toBeNull();
            expect(log?.finished_at).toBeNull();
        });

        it('should update existing UNREAD log to IN_PROGRESS', async () => {
            // Create an UNREAD log first
            await prisma.user_story_log.create({
                data: {
                    user_id: userId,
                    story_chapter_id: chapterId,
                    status: StoryStatus.UNREAD,
                    ins_user_id: userId,
                    upd_user_id: userId,
                },
            });

            await repository.startStoryReading(userId, chapterId);

            const log = await prisma.user_story_log.findFirst({
                where: { user_id: userId, story_chapter_id: chapterId },
            });

            expect(log?.status).toEqual(StoryStatus.IN_PROGRESS);
            expect(log?.unlocked_at).not.toBeNull();
        });

        it('should not update if already IN_PROGRESS or COMPLETED', async () => {
            // Create an IN_PROGRESS log first
            const originalUnlockedAt = new Date('2023-01-01');
            await prisma.user_story_log.create({
                data: {
                    user_id: userId,
                    story_chapter_id: chapterId,
                    status: StoryStatus.IN_PROGRESS,
                    unlocked_at: originalUnlockedAt,
                    ins_user_id: userId,
                    upd_user_id: userId,
                },
            });

            await repository.startStoryReading(userId, chapterId);

            const log = await prisma.user_story_log.findFirst({
                where: { user_id: userId, story_chapter_id: chapterId },
            });

            expect(log?.status).toEqual(StoryStatus.IN_PROGRESS);
            expect(log?.unlocked_at).toEqual(originalUnlockedAt);
        });

        it('should throw an error if chapter does not exist', async () => {
            await expect(
                repository.startStoryReading(userId, 'non-existent-chapter'),
            ).rejects.toThrow(new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023));
        });
    });

    describe('completeStoryWithQuestUnlocking', () => {
        beforeEach(async () => {
            // Create user_info for rewards
            await prisma.user_info.create({
                data: {
                    user_id: userId,
                    level: LevelType.BONJIN,
                    magatama_points: 100,
                    ins_user_id: 'system',
                    upd_user_id: 'system',
                },
            });

            // Create quest data for unlocking
            await prisma.quest.create({
                data: {
                    quest_id: 'quest1',
                    tourist_spot_id: 'spot1',
                    quest_name: 'Test Quest',
                    quest_desc: 'A quest for testing',
                    total_magatama_point_awarded: 50,
                    is_premium: false,
                    is_unlocked: false,
                    del_flag: false,
                    ins_user_id: 'system',
                    upd_user_id: 'system',
                },
            });
        });

        it('should complete story and unlock related quests', async () => {
            const result = await repository.completeStoryWithQuestUnlocking(userId, chapterId);

            // Verify story completion
            expect(result.chapter.storyChapterId).toBe(chapterId);
            expect(result.chapter.status).toBe(StoryStatus.COMPLETED);
            expect(result.chapter.completedAt).not.toBeNull();

            // Verify quest unlocking
            expect(result.unlockedQuests).toHaveLength(1);
            expect(result.unlockedQuests[0].questId).toBe('quest1');
            expect(result.unlockedQuests[0].questName).toBe('Test Quest');

            // Verify rewards
            expect(result.rewards.magatamaPointsEarned).toBe(35); // 10 base + 25 first story achievement
            expect(result.rewards.achievementsUnlocked).toContain('First Story Completed');

            // Verify database updates
            const userInfo = await prisma.user_info.findUnique({
                where: { user_id: userId },
            });
            expect(userInfo?.magatama_points).toBe(135); // 100 + 35

            const quest = await prisma.quest.findUnique({
                where: { quest_id: 'quest1' },
            });
            expect(quest?.is_unlocked).toBe(true);

            const storyLog = await prisma.user_story_log.findFirst({
                where: { user_id: userId, story_chapter_id: chapterId },
            });
            expect(storyLog?.status).toBe(StoryStatus.COMPLETED);
            expect(storyLog?.finished_at).not.toBeNull();
        });

        it('should throw error if story already completed', async () => {
            // Complete the story first
            await repository.completeStoryWithQuestUnlocking(userId, chapterId);

            // Try to complete again
            await expect(
                repository.completeStoryWithQuestUnlocking(userId, chapterId),
            ).rejects.toThrow(new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_029));
        });

        it('should handle chapter with no tourist spot', async () => {
            // Create a chapter without tourist spot
            const chapterIdNoSpot = 'chapter-no-spot';
            await prisma.story_chapter.create({
                data: {
                    story_chapter_id: chapterIdNoSpot,
                    story_id: storyId,
                    tourist_spot_id: null,
                    chapter_title: 'Chapter Without Spot',
                    chapter_number: '2',
                    chapter_desc: 'A chapter for testing',
                    chapter_image: 'image.png',
                    character_name_list: [],
                    real_world_image: 'image.png',
                    chapter_pdf_url: 'http://example.com/a.pdf',
                    chapter_video_url: 'http://example.com/a.mp4',
                    chapter_video_mobile_url: 'http://example.com/a_mobile.mp4',
                    ins_user_id: 'system',
                    upd_user_id: 'system',
                },
            });

            const result = await repository.completeStoryWithQuestUnlocking(userId, chapterIdNoSpot);

            expect(result.unlockedQuests).toHaveLength(0);
            expect(result.rewards.magatamaPointsEarned).toBe(10); // Only base reward
        });

        it('should not unlock premium quests for regular users', async () => {
            // Create a premium quest
            await prisma.quest.create({
                data: {
                    quest_id: 'premium-quest',
                    tourist_spot_id: 'spot1',
                    quest_name: 'Premium Quest',
                    quest_desc: 'A premium quest',
                    total_magatama_point_awarded: 100,
                    is_premium: true,
                    is_unlocked: false,
                    del_flag: false,
                    ins_user_id: 'system',
                    upd_user_id: 'system',
                },
            });

            const result = await repository.completeStoryWithQuestUnlocking(userId, chapterId);

            // Should unlock the regular quest but not the premium one
            expect(result.unlockedQuests).toHaveLength(1);
            expect(result.unlockedQuests[0].questId).toBe('quest1');
            expect(result.unlockedQuests[0].isPremium).toBe(false);

            // Verify premium quest remains locked
            const premiumQuest = await prisma.quest.findUnique({
                where: { quest_id: 'premium-quest' },
            });
            expect(premiumQuest?.is_unlocked).toBe(false);
        });

        it('should handle multiple quests at same tourist spot', async () => {
            // Create additional quest
            await prisma.quest.create({
                data: {
                    quest_id: 'quest2',
                    tourist_spot_id: 'spot1',
                    quest_name: 'Second Test Quest',
                    quest_desc: 'Another quest for testing',
                    total_magatama_point_awarded: 30,
                    is_premium: false,
                    is_unlocked: false,
                    del_flag: false,
                    ins_user_id: 'system',
                    upd_user_id: 'system',
                },
            });

            const result = await repository.completeStoryWithQuestUnlocking(userId, chapterId);

            expect(result.unlockedQuests).toHaveLength(2);
            expect(result.unlockedQuests.map(q => q.questId)).toContain('quest1');
            expect(result.unlockedQuests.map(q => q.questId)).toContain('quest2');
        });

        it('should award 5 stories achievement correctly', async () => {
            // Complete 4 other stories first
            for (let i = 1; i <= 4; i++) {
                const otherId = `other-chapter-${i}`;
                await prisma.story_chapter.create({
                    data: {
                        story_chapter_id: otherId,
                        story_id: storyId,
                        tourist_spot_id: null,
                        chapter_title: `Other Chapter ${i}`,
                        chapter_number: `${i + 1}`,
                        chapter_desc: 'A chapter for testing',
                        chapter_image: 'image.png',
                        character_name_list: [],
                        real_world_image: 'image.png',
                        chapter_pdf_url: 'http://example.com/a.pdf',
                        chapter_video_url: 'http://example.com/a.mp4',
                        chapter_video_mobile_url: 'http://example.com/a_mobile.mp4',
                        ins_user_id: 'system',
                        upd_user_id: 'system',
                    },
                });

                await prisma.user_story_log.create({
                    data: {
                        user_id: userId,
                        story_chapter_id: otherId,
                        status: StoryStatus.COMPLETED,
                        finished_at: new Date(),
                        ins_user_id: userId,
                        upd_user_id: userId,
                    },
                });
            }

            // This should be the 5th completed story
            const result = await repository.completeStoryWithQuestUnlocking(userId, chapterId);

            expect(result.rewards.achievementsUnlocked).toContain('Story Explorer');
            expect(result.rewards.magatamaPointsEarned).toBe(60); // 10 base + 50 explorer achievement
        });

        it('should throw error if chapter does not exist', async () => {
            await expect(
                repository.completeStoryWithQuestUnlocking(userId, 'non-existent-chapter'),
            ).rejects.toThrow(new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023));
        });
    });

    describe('getStoryProgress', () => {
        it('should return null if no progress exists', async () => {
            const progress = await repository.getStoryProgress(userId, chapterId);
            expect(progress).toBeNull();
        });

        it('should return progress information if exists', async () => {
            const unlockedAt = new Date();
            await prisma.user_story_log.create({
                data: {
                    user_id: userId,
                    story_chapter_id: chapterId,
                    status: StoryStatus.IN_PROGRESS,
                    unlocked_at: unlockedAt,
                    finished_at: null,
                    ins_user_id: userId,
                    upd_user_id: userId,
                },
            });

            const progress = await repository.getStoryProgress(userId, chapterId);

            expect(progress).not.toBeNull();
            expect(progress?.status).toBe(StoryStatus.IN_PROGRESS);
            expect(progress?.unlockedAt).toEqual(unlockedAt);
            expect(progress?.finishedAt).toBeNull();
        });

        it('should return completed progress with finished timestamp', async () => {
            const unlockedAt = new Date('2023-01-01');
            const finishedAt = new Date('2023-01-02');
            await prisma.user_story_log.create({
                data: {
                    user_id: userId,
                    story_chapter_id: chapterId,
                    status: StoryStatus.COMPLETED,
                    unlocked_at: unlockedAt,
                    finished_at: finishedAt,
                    ins_user_id: userId,
                    upd_user_id: userId,
                },
            });

            const progress = await repository.getStoryProgress(userId, chapterId);

            expect(progress?.status).toBe(StoryStatus.COMPLETED);
            expect(progress?.unlockedAt).toEqual(unlockedAt);
            expect(progress?.finishedAt).toEqual(finishedAt);
        });
    });
});

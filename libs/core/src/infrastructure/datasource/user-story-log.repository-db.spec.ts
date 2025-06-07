import { cleanDb } from '@app/core-test/prisma/clean-db';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Test, type TestingModule } from '@nestjs/testing';
import { StoryStatus } from '@prisma/client';
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
            where: { user_id: userId, story_id: storyId },
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
            where: { user_id: userId, story_id: storyId },
        });
        expect(initialLog?.finished_at).toBeNull();

        // Then, update it to COMPLETED
        await repository.trackProgress(userId, chapterId, StoryStatus.COMPLETED);
        const updatedLog = await prisma.user_story_log.findFirst({
            where: { user_id: userId, story_id: storyId },
        });

        expect(updatedLog).not.toBeNull();
        expect(updatedLog?.user_story_log_id).toEqual(initialLog?.user_story_log_id);
        expect(updatedLog?.status).toEqual(StoryStatus.COMPLETED);
        expect(updatedLog?.finished_at).not.toBeNull();
    });

    it('should throw an error if the chapter does not exist', async () => {
        await expect(
            repository.trackProgress(userId, 'non-existent-chapter', StoryStatus.IN_PROGRESS),
        ).rejects.toThrow('Story chapter not found');
    });
});

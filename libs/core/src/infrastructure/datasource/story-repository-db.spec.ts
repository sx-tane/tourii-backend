import { StoryEntity } from '@app/core/domain/game/story/story.entity';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { cleanDb } from '@app/core-test/prisma/clean-db';
import { Test, type TestingModule } from '@nestjs/testing';
import { StoryRepositoryDb } from './story-repository-db';

describe('StoryRepositoryDb', () => {
    let repository: StoryRepositoryDb;
    let prisma: PrismaService;
    let caching: CachingService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StoryRepositoryDb,
                PrismaService,
                {
                    provide: CachingService,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                        invalidate: jest.fn(),
                        clearAll: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = module.get(StoryRepositoryDb);
        prisma = module.get(PrismaService);
        caching = module.get(CachingService);
        await prisma.$connect();
    });

    afterAll(async () => {
        await cleanDb();
    });

    it('creates a story in the database and invalidates cache', async () => {
        const baseDate = new Date('2024-01-01T00:00:00.000Z');
        const story = new StoryEntity(
            {
                sagaName: 'Saga',
                sagaDesc: 'desc',
                order: 1,
                isPrologue: true,
                isSelected: false,
                insUserId: 'system',
                insDateTime: baseDate,
                updUserId: 'system',
                updDateTime: baseDate,
            },
            undefined,
        );
        const created = await repository.createStory(story);
        expect(created.storyId).toBeDefined();

        // Verify the data was stored in the database.
        const found = await prisma.story.findUnique({
            where: { story_id: created.storyId },
        });
        expect(found).not.toBeNull();
        expect(found?.saga_name).toEqual('Saga');

        // Verify the cache was cleared.
        expect(caching.clearAll).toHaveBeenCalled();
    });

    it('deletes a story and its chapters', async () => {
        const story = await prisma.story.create({
            data: {
                saga_name: 'DelSaga',
                saga_desc: 'd',
                order: 1,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.story_chapter.create({
            data: {
                story_chapter_id: 'cDel',
                tourist_spot_id: 'spDel',
                story_id: story.story_id,
                chapter_title: 't',
                chapter_number: '1',
                chapter_desc: 'd',
                chapter_image: 'i',
                real_world_image: 'i',
                chapter_pdf_url: 'p',
                chapter_video_url: 'v',
                chapter_video_mobile_url: 'vm',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        await repository.deleteStory(story.story_id);

        const foundStory = await prisma.story.findUnique({ where: { story_id: story.story_id } });
        const chapters = await prisma.story_chapter.findMany({
            where: { story_id: story.story_id },
        });
        expect(foundStory).toBeNull();
        expect(chapters.length).toBe(0);
    });

    it('deletes a single story chapter', async () => {
        const story = await prisma.story.create({
            data: {
                saga_name: 'Saga2',
                saga_desc: 'd',
                order: 1,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        const chapter = await prisma.story_chapter.create({
            data: {
                story_chapter_id: 'cDel2',
                tourist_spot_id: 'sp2',
                story_id: story.story_id,
                chapter_title: 't',
                chapter_number: '1',
                chapter_desc: 'd',
                chapter_image: 'i',
                real_world_image: 'i',
                chapter_pdf_url: 'p',
                chapter_video_url: 'v',
                chapter_video_mobile_url: 'vm',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        await repository.deleteStoryChapter(chapter.story_chapter_id);

        const found = await prisma.story_chapter.findUnique({
            where: { story_chapter_id: chapter.story_chapter_id },
        });
        expect(found).toBeNull();
    });
});

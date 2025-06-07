import { cleanDb } from '@app/core-test/prisma/clean-db';
import { StoryEntity } from '@app/core/domain/game/story/story.entity';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
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

        // Verify the cache was invalidated.
        expect(caching.invalidate).toHaveBeenCalledWith('stories:all');
    });
});

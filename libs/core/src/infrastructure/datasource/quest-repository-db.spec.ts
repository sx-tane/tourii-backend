import { cleanDb } from '@app/core-test/prisma/clean-db';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Test, type TestingModule } from '@nestjs/testing';
import { QuestRepositoryDb } from './quest-repository-db';

describe('QuestRepositoryDb', () => {
    let repository: QuestRepositoryDb;
    let prisma: PrismaService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuestRepositoryDb,
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

        repository = module.get(QuestRepositoryDb);
        prisma = module.get(PrismaService);
        await prisma.$connect();
    });

    afterAll(async () => {
        await cleanDb();
    });

    it('fetches a created quest by its ID from the database', async () => {
        // Create dependencies for the quest: story -> model_route -> tourist_spot
        await prisma.story.create({
            data: {
                story_id: 'story1',
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
                story_id: 'story1',
                route_name: 'Test Route',
                region: 'Test Region',
                region_latitude: 0,
                region_longitude: 0,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.story_chapter.create({
            data: {
                story_chapter_id: 'chapter1',
                tourist_spot_id: 'spot1',
                story_id: 'story1',
                chapter_title: 'Test Chapter',
                chapter_number: '1',
                chapter_desc: 'A chapter for testing',
                chapter_image: 'image.png',
                real_world_image: 'image.png',
                chapter_pdf_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                chapter_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                chapter_video_mobile_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.tourist_spot.create({
            data: {
                tourist_spot_id: 'spot1',
                model_route_id: 'route1',
                story_chapter_id: 'chapter1',
                tourist_spot_name: 'Test Spot',
                tourist_spot_desc: 'A spot for testing',
                latitude: 0,
                longitude: 0,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.quest.create({
            data: {
                quest_id: 'quest1',
                tourist_spot_id: 'spot1',
                quest_name: 'Test Quest',
                quest_desc: 'A quest for testing',
                quest_type: 'TRAVEL_TO_EARN',
                reward_type: 'LOCAL_EXPERIENCES',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        const quest = await repository.fetchQuestById('quest1');
        expect(quest).not.toBeNull();
        expect(quest.questId).toEqual('quest1');
        expect(quest.questName).toEqual('Test Quest');
    });
});

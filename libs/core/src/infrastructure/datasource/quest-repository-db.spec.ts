import { cleanDb } from '@app/core-test/prisma/clean-db';
import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { QuestEntity } from '@app/core/domain/game/quest/quest.entity';
import { Task } from '@app/core/domain/game/quest/task';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Test, type TestingModule } from '@nestjs/testing';
import { QuestRepositoryDb } from './quest-repository-db';

describe('QuestRepositoryDb', () => {
    let repository: QuestRepositoryDb;
    let prisma: PrismaService;
    let caching: CachingService;

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
                        clearAll: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = module.get(QuestRepositoryDb);
        prisma = module.get(PrismaService);
        caching = module.get(CachingService);
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

    it('creates a quest in the database and invalidates cache', async () => {
        await prisma.story.create({
            data: {
                story_id: 's2',
                saga_name: 'Saga',
                saga_desc: 'desc',
                order: 1,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.model_route.create({
            data: {
                model_route_id: 'r2',
                story_id: 's2',
                route_name: 'Route',
                region: 'Region',
                region_latitude: 0,
                region_longitude: 0,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.story_chapter.create({
            data: {
                story_chapter_id: 'c2',
                tourist_spot_id: 'sp2',
                story_id: 's2',
                chapter_title: 'Chap',
                chapter_number: '1',
                chapter_desc: 'desc',
                chapter_image: 'img',
                real_world_image: 'img',
                chapter_pdf_url: 'a',
                chapter_video_url: 'a',
                chapter_video_mobile_url: 'a',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.tourist_spot.create({
            data: {
                tourist_spot_id: 'sp2',
                model_route_id: 'r2',
                story_chapter_id: 'c2',
                tourist_spot_name: 'Spot',
                tourist_spot_desc: 'desc',
                latitude: 0,
                longitude: 0,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        const questEntity = new QuestEntity(
            {
                questName: 'New Quest',
                questDesc: 'desc',
                questType: 'TRAVEL_TO_EARN',
                isUnlocked: true,
                isPremium: false,
                totalMagatamaPointAwarded: 0,
                rewardType: 'LOCAL_EXPERIENCES',
                delFlag: false,
                insUserId: 'system',
                insDateTime: new Date('2024-01-01T00:00:00.000Z'),
                updUserId: 'system',
                updDateTime: new Date('2024-01-01T00:00:00.000Z'),
                touristSpot: new TouristSpot({
                    touristSpotId: 'sp2',
                    updUserId: 'system',
                    updDateTime: new Date('2024-01-01T00:00:00.000Z'),
                }),
            },
            undefined,
        );

        const created = await repository.createQuest(questEntity);
        expect(created.questId).toBeDefined();
        expect(caching.clearAll).toHaveBeenCalled();

        const found = await prisma.quest.findUnique({
            where: { quest_id: created.questId ?? '' },
        });
        expect(found?.quest_name).toEqual('New Quest');
    });

    it('creates a quest task in the database', async () => {
        await prisma.quest.create({
            data: {
                quest_id: 'qtask',
                tourist_spot_id: 'sp2',
                quest_name: 'Has Task',
                quest_desc: 'd',
                quest_type: 'TRAVEL_TO_EARN',
                reward_type: 'LOCAL_EXPERIENCES',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        const task = new Task({
            taskId: '',
            questId: 'qtask',
            taskTheme: 'LOCAL_CULTURE',
            taskType: 'CHECK_IN',
            taskName: 'T',
            taskDesc: 'D',
            isUnlocked: true,
            requiredAction: 'A',
            antiCheatRules: {
                claim_once: true,
                cooldown_hours: 24,
            },
            magatamaPointAwarded: 1,
            totalMagatamaPointAwarded: 1,
            delFlag: false,
            insUserId: 'system',
            insDateTime: new Date('2024-01-01T00:00:00.000Z'),
            updUserId: 'system',
            updDateTime: new Date('2024-01-01T00:00:00.000Z'),
        });

        const created = await repository.createQuestTask(task);
        expect(created.taskId).toBeDefined();

        const found = await prisma.quest_task.findUnique({
            where: { quest_task_id: created.taskId ?? '' },
        });
        expect(found?.task_name).toEqual('T');
    });

    it('deleteQuest removes quest and tasks', async () => {
        await prisma.quest_task.deleteMany();
        const story = await prisma.story.create({
            data: {
                story_id: 'sDel',
                saga_name: 's',
                saga_desc: 'd',
                order: 1,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        const route = await prisma.model_route.create({
            data: {
                model_route_id: 'rDel',
                story_id: story.story_id,
                route_name: 'R',
                region: 'reg',
                region_latitude: 0,
                region_longitude: 0,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        const chapter = await prisma.story_chapter.create({
            data: {
                story_chapter_id: 'cDelQ',
                tourist_spot_id: 'spDelQ',
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
        const spot = await prisma.tourist_spot.create({
            data: {
                tourist_spot_id: 'spDelQ',
                model_route_id: route.model_route_id,
                story_chapter_id: chapter.story_chapter_id,
                tourist_spot_name: 'n',
                tourist_spot_desc: 'd',
                latitude: 0,
                longitude: 0,
                tourist_spot_hashtag: [],
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        const quest = await prisma.quest.create({
            data: {
                quest_id: 'qDel',
                tourist_spot_id: spot.tourist_spot_id,
                quest_name: 'Q',
                quest_desc: 'd',
                quest_type: 'TRAVEL_TO_EARN',
                reward_type: 'LOCAL_EXPERIENCES',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.quest_task.create({
            data: {
                quest_task_id: 'tDel',
                quest_id: quest.quest_id,
                task_theme: 'STORY',
                task_type: 'CHECK_IN',
                task_name: 'T',
                task_desc: 'd',
                is_unlocked: true,
                required_action: 'A',
                group_activity_members: [],
                select_options: [],
                anti_cheat_rules: {},
                magatama_point_awarded: 1,
                total_magatama_point_awarded: 1,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        await repository.deleteQuest(quest.quest_id);

        const foundQuest = await prisma.quest.findUnique({ where: { quest_id: quest.quest_id } });
        const tasks = await prisma.quest_task.findMany({ where: { quest_id: quest.quest_id } });
        expect(foundQuest).toBeNull();
        expect(tasks.length).toBe(0);
    });

    it('deleteQuestTask removes task', async () => {
        const quest = await prisma.quest.create({
            data: {
                quest_id: 'qDel2',
                tourist_spot_id: 'spDelQ',
                quest_name: 'Q',
                quest_desc: 'd',
                quest_type: 'TRAVEL_TO_EARN',
                reward_type: 'LOCAL_EXPERIENCES',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        const task = await prisma.quest_task.create({
            data: {
                quest_task_id: 'tDel2',
                quest_id: quest.quest_id,
                task_theme: 'STORY',
                task_type: 'CHECK_IN',
                task_name: 'T',
                task_desc: 'd',
                is_unlocked: true,
                required_action: 'A',
                group_activity_members: [],
                select_options: [],
                anti_cheat_rules: {},
                magatama_point_awarded: 1,
                total_magatama_point_awarded: 1,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        await repository.deleteQuestTask(task.quest_task_id);

        const found = await prisma.quest_task.findUnique({
            where: { quest_task_id: task.quest_task_id },
        });
        expect(found).toBeNull();
    });
});

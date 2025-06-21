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
                        getOrSet: jest
                            .fn()
                            .mockImplementation(
                                async (_key: string, fetchFn: () => Promise<any>, _ttl: number) => {
                                    // For testing, just call the fetch function directly
                                    return await fetchFn();
                                },
                            ),
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

    it('fetches quests by tourist spot id', async () => {
        await prisma.quest.create({
            data: {
                quest_id: 'quest2',
                tourist_spot_id: 'spot1',
                quest_name: 'Second Quest',
                quest_desc: 'Another quest',
                quest_type: 'TRAVEL_TO_EARN',
                reward_type: 'LOCAL_EXPERIENCES',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        const quests = await repository.fetchQuestsByTouristSpotId('spot1');
        expect(quests.length).toBe(2);
        const names = quests.map((q) => q.questName);
        expect(names).toContain('Test Quest');
        expect(names).toContain('Second Quest');
    });

    it('includes completed tasks when userId is provided', async () => {
        // Create a user first to satisfy foreign key constraint
        await prisma.user.create({
            data: {
                user_id: 'user1',
                username: 'testuser1',
                password: 'hashedpassword',
                perks_wallet_address: 'test-wallet-address',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        await prisma.quest_task.create({
            data: {
                quest_task_id: 'task1',
                quest_id: 'quest1',
                task_theme: 'STORY',
                task_type: 'CHECK_IN',
                task_name: 'Task 1',
                task_desc: 'desc',
                is_unlocked: true,
                required_action: 'A',
                group_activity_members: [],
                select_options: [],
                anti_cheat_rules: {},
                magatama_point_awarded: 1,
                reward_earned: '1',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.user_task_log.create({
            data: {
                user_id: 'user1',
                quest_id: 'quest1',
                task_id: 'task1',
                status: 'COMPLETED',
                action: 'CHECK_IN',
                group_activity_members: [],
                reward_earned: '1',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        const quests = await repository.fetchQuestsByTouristSpotId('spot1', 'user1');
        const quest1 = quests.find((q) => q.questId === 'quest1');
        expect(quest1?.tasks?.every((t) => t.isCompleted)).toBe(true);
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
            taskId: 't1',
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
            rewardEarned: '1',
            delFlag: false,
            insUserId: 'system',
            insDateTime: new Date('2024-01-01T00:00:00.000Z'),
            updUserId: 'system',
            updDateTime: new Date('2024-01-01T00:00:00.000Z'),
        });

        const created = await repository.createQuestTask(task, 'qtask');
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
                reward_earned: '1',
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
                reward_earned: '1',
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

    it('checks quest completion status', async () => {
        await prisma.user_task_log.createMany({
            data: [
                {
                    user_id: 'user1',
                    quest_id: 'qtask',
                    task_id: 'tDel2',
                    status: 'COMPLETED',
                    action: 'CHECK_IN',
                    group_activity_members: [],
                },
            ],
        });
        const completed = await repository.isQuestCompleted('qtask', 'user1');
        expect(completed).toBe(true);
    });

    it('returns top 3 most popular quests based on completed tasks', async () => {
        // Clean existing user_task_log entries to avoid unique constraint violations
        await prisma.user_task_log.deleteMany({});

        // Create additional test users for more realistic data
        await prisma.user.createMany({
            data: [
                {
                    user_id: 'user2',
                    username: 'testuser2',
                    password: 'hashedpassword',
                    perks_wallet_address: 'test-wallet-address-2',
                    ins_user_id: 'system',
                    upd_user_id: 'system',
                },
                {
                    user_id: 'user3',
                    username: 'testuser3',
                    password: 'hashedpassword',
                    perks_wallet_address: 'test-wallet-address-3',
                    ins_user_id: 'system',
                    upd_user_id: 'system',
                },
            ],
        });

        // Create more quest tasks to generate meaningful completion data
        await prisma.quest_task.createMany({
            data: [
                {
                    quest_task_id: 'task2',
                    quest_id: 'quest1',
                    task_theme: 'STORY',
                    task_type: 'CHECK_IN',
                    task_name: 'Task 2',
                    task_desc: 'desc',
                    is_unlocked: true,
                    required_action: 'A',
                    group_activity_members: [],
                    select_options: [],
                    anti_cheat_rules: {},
                    magatama_point_awarded: 1,
                    reward_earned: '1',
                    ins_user_id: 'system',
                    upd_user_id: 'system',
                },
                {
                    quest_task_id: 'task3',
                    quest_id: 'quest2',
                    task_theme: 'STORY',
                    task_type: 'CHECK_IN',
                    task_name: 'Task 3',
                    task_desc: 'desc',
                    is_unlocked: true,
                    required_action: 'A',
                    group_activity_members: [],
                    select_options: [],
                    anti_cheat_rules: {},
                    magatama_point_awarded: 1,
                    reward_earned: '1',
                    ins_user_id: 'system',
                    upd_user_id: 'system',
                },
                {
                    quest_task_id: 'task4_popular',
                    quest_id: 'qtask',
                    task_theme: 'STORY',
                    task_type: 'CHECK_IN',
                    task_name: 'Task 4 for popularity test',
                    task_desc: 'desc',
                    is_unlocked: true,
                    required_action: 'A',
                    group_activity_members: [],
                    select_options: [],
                    anti_cheat_rules: {},
                    magatama_point_awarded: 1,
                    reward_earned: '1',
                    ins_user_id: 'system',
                    upd_user_id: 'system',
                },
            ],
        });

        // Create task completion logs to make quest1 most popular, quest2 second most popular
        await prisma.user_task_log.createMany({
            data: [
                // quest1 completions (6 total - making it most popular)
                {
                    user_id: 'user1',
                    quest_id: 'quest1',
                    task_id: 'task1',
                    status: 'COMPLETED',
                    action: 'CHECK_IN',
                    group_activity_members: [],
                },
                {
                    user_id: 'user1',
                    quest_id: 'quest1',
                    task_id: 'task2',
                    status: 'COMPLETED',
                    action: 'CHECK_IN',
                    group_activity_members: [],
                },
                {
                    user_id: 'user2',
                    quest_id: 'quest1',
                    task_id: 'task1',
                    status: 'COMPLETED',
                    action: 'CHECK_IN',
                    group_activity_members: [],
                },
                {
                    user_id: 'user2',
                    quest_id: 'quest1',
                    task_id: 'task2',
                    status: 'COMPLETED',
                    action: 'CHECK_IN',
                    group_activity_members: [],
                },
                {
                    user_id: 'user3',
                    quest_id: 'quest1',
                    task_id: 'task1',
                    status: 'COMPLETED',
                    action: 'CHECK_IN',
                    group_activity_members: [],
                },
                {
                    user_id: 'user3',
                    quest_id: 'quest1',
                    task_id: 'task2',
                    status: 'COMPLETED',
                    action: 'CHECK_IN',
                    group_activity_members: [],
                },

                // quest2 completions (3 total - making it second most popular)
                {
                    user_id: 'user1',
                    quest_id: 'quest2',
                    task_id: 'task3',
                    status: 'COMPLETED',
                    action: 'CHECK_IN',
                    group_activity_members: [],
                },
                {
                    user_id: 'user2',
                    quest_id: 'quest2',
                    task_id: 'task3',
                    status: 'COMPLETED',
                    action: 'CHECK_IN',
                    group_activity_members: [],
                },
                {
                    user_id: 'user3',
                    quest_id: 'quest2',
                    task_id: 'task3',
                    status: 'COMPLETED',
                    action: 'CHECK_IN',
                    group_activity_members: [],
                },

                // qtask completions (1 total - making it third most popular)
                {
                    user_id: 'user1',
                    quest_id: 'qtask',
                    task_id: 'task4_popular',
                    status: 'COMPLETED',
                    action: 'CHECK_IN',
                    group_activity_members: [],
                },
            ],
        });

        const topQuests = await repository.getMostPopularQuest();

        // Should return an array of quests
        expect(Array.isArray(topQuests)).toBe(true);
        expect(topQuests.length).toBeGreaterThan(0);
        expect(topQuests.length).toBeLessThanOrEqual(3);

        // Should be ordered by popularity (most popular first)
        if (topQuests.length >= 2) {
            expect(topQuests[0].questId).toBe('quest1'); // Most popular
            expect(topQuests[1].questId).toBe('quest2'); // Second most popular
        }

        if (topQuests.length >= 3) {
            expect(topQuests[2].questId).toBe('qtask'); // Third most popular
        }
    });

    it('returns empty array when no completed tasks exist', async () => {
        // Clean task logs to simulate no completions
        await prisma.user_task_log.deleteMany({
            where: { status: 'COMPLETED' },
        });

        const topQuests = await repository.getMostPopularQuest();

        expect(Array.isArray(topQuests)).toBe(true);
        expect(topQuests.length).toBe(0);
    });

    it('finds nearby tourist spots within specified radius', async () => {
        // Create additional tourist spots at different locations for proximity testing
        await prisma.story.create({
            data: {
                story_id: 'story2',
                saga_name: 'Test Saga 2',
                saga_desc: 'A saga for testing proximity',
                order: 2,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.model_route.create({
            data: {
                model_route_id: 'route2',
                story_id: 'story2',
                route_name: 'Test Route 2',
                region: 'Test Region 2',
                region_latitude: 47.4651666,
                region_longitude: 10.201276,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.story_chapter.create({
            data: {
                story_chapter_id: 'chapter2',
                tourist_spot_id: 'spot2',
                story_id: 'story2',
                chapter_title: 'Test Chapter 2',
                chapter_number: '1',
                chapter_desc: 'A chapter for proximity testing',
                chapter_image: 'image2.png',
                real_world_image: 'image2.png',
                chapter_pdf_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                chapter_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                chapter_video_mobile_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        
        // Create tourist spot at known coordinates
        await prisma.tourist_spot.create({
            data: {
                tourist_spot_id: 'spot2',
                model_route_id: 'route2',
                story_chapter_id: 'chapter2',
                tourist_spot_name: 'Nearby Test Spot',
                tourist_spot_desc: 'A spot for proximity testing',
                latitude: 47.4651666, // About 280m from search point
                longitude: 10.201276,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        // Create a quest and task for this tourist spot
        await prisma.quest.create({
            data: {
                quest_id: 'quest3',
                tourist_spot_id: 'spot2',
                quest_name: 'Proximity Quest',
                quest_desc: 'A quest for proximity testing',
                quest_type: 'TRAVEL_TO_EARN',
                reward_type: 'LOCAL_EXPERIENCES',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        await prisma.quest_task.create({
            data: {
                quest_task_id: 'task_proximity',
                quest_id: 'quest3',
                task_theme: 'STORY',
                task_type: 'CHECK_IN',
                task_name: 'Proximity Task',
                task_desc: 'A task for proximity testing',
                is_unlocked: true,
                required_action: 'CHECK_IN',
                group_activity_members: [],
                select_options: [],
                anti_cheat_rules: {},
                magatama_point_awarded: 1,
                reward_earned: '1',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        // Search from photo coordinates: 47.466905555555556, 10.20375
        const searchLat = 47.466905555555556;
        const searchLng = 10.20375;
        const radiusKm = 1.0;

        const nearbySpots = await repository.findNearbyTouristSpots(searchLat, searchLng, radiusKm);

        // Should find the tourist spot we created (about 280m away)
        expect(nearbySpots.length).toBeGreaterThan(0);
        
        const foundSpot = nearbySpots.find(spot => spot.touristSpotId === 'spot2');
        expect(foundSpot).toBeDefined();
        expect(foundSpot?.distance).toBeLessThan(1.0); // Within 1km
        expect(foundSpot?.distance).toBeGreaterThan(0.2); // About 280m = 0.28km
        expect(foundSpot?.questId).toBe('quest3');
        expect(foundSpot?.taskId).toBe('task_proximity');

        // Test that spots outside radius are not returned
        const nearbySpotsTight = await repository.findNearbyTouristSpots(searchLat, searchLng, 0.1); // 100m radius
        expect(nearbySpotsTight.length).toBe(0); // Should not find any spots within 100m
    });

    it('returns empty array when no tourist spots are within radius', async () => {
        // Search in a remote location where no tourist spots exist
        const nearbySpots = await repository.findNearbyTouristSpots(90, 180, 1.0);
        expect(nearbySpots.length).toBe(0);
    });

    it('handles database errors gracefully in findNearbyTouristSpots', async () => {
        // Simulate database error by using invalid coordinates
        const nearbySpots = await repository.findNearbyTouristSpots(NaN, NaN, 1.0);
        expect(nearbySpots.length).toBe(0);
    });
});

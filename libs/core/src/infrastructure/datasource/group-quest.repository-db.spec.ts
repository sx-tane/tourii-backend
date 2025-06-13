import { cleanDb } from '@app/core-test/prisma/clean-db';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Test, type TestingModule } from '@nestjs/testing';
import { TaskStatus } from '@prisma/client';
import { GroupQuestRepositoryDb } from './group-quest.repository-db';

describe('GroupQuestRepositoryDb', () => {
    let repository: GroupQuestRepositoryDb;
    let prisma: PrismaService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GroupQuestRepositoryDb, PrismaService],
        }).compile();

        repository = module.get(GroupQuestRepositoryDb);
        prisma = module.get(PrismaService);
        await prisma.$connect();
    });

    afterAll(async () => {
        await cleanDb();
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await cleanDb();
        await prisma.user.create({
            data: {
                user_id: 'user1',
                username: 'Alice',
                password: 'secret',
                perks_wallet_address: 'wallet1',
                passport_wallet_address: 'passport1',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.user.create({
            data: {
                user_id: 'user2',
                username: 'Bob',
                password: 'secret',
                perks_wallet_address: 'wallet2',
                passport_wallet_address: 'passport2',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.story.create({
            data: {
                story_id: 'story1',
                saga_name: 'Saga',
                saga_desc: 'desc',
                order: 1,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.model_route.create({
            data: {
                model_route_id: 'route1',
                story_id: 'story1',
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
                story_chapter_id: 'chapter1',
                tourist_spot_id: 'spot1',
                story_id: 'story1',
                chapter_title: 'Title',
                chapter_number: '1',
                chapter_desc: 'Desc',
                chapter_image: 'img',
                real_world_image: 'img',
                chapter_pdf_url: 'http://example.com',
                chapter_video_url: 'http://example.com',
                chapter_video_mobile_url: 'http://example.com',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        await prisma.tourist_spot.create({
            data: {
                tourist_spot_id: 'spot1',
                model_route_id: 'route1',
                story_chapter_id: 'chapter1',
                tourist_spot_name: 'Spot',
                tourist_spot_desc: 'Desc',
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
                quest_name: 'Quest',
                quest_desc: 'Quest Desc',
                quest_type: 'TRAVEL_TO_EARN',
                reward_type: 'LOCAL_EXPERIENCES',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        const members = [
            { user_id: 'user1', discord_id: 'd1', group_name: 'G', role: 'leader' },
            { user_id: 'user2', discord_id: 'd2', group_name: 'G', role: 'member' },
        ];
        await prisma.user_task_log.create({
            data: {
                user_id: 'user1',
                quest_id: 'quest1',
                task_id: 'task1',
                group_activity_members: members as unknown as any[],
            },
        });
        await prisma.user_task_log.create({
            data: {
                user_id: 'user2',
                quest_id: 'quest1',
                task_id: 'task1',
                group_activity_members: members as unknown as any[],
            },
        });
    });

    it('returns group members in camelCase', async () => {
        const result = await repository.getGroupMembers('quest1');
        expect(result.groupId).toEqual('quest1');
        expect(result.leaderUserId).toEqual('user1');
        expect(result.members).toEqual([
            { userId: 'user1', username: 'Alice', role: 'leader' },
            { userId: 'user2', username: 'Bob', role: 'member' },
        ]);
    });

    it("updates only AVAILABLE tasks' status to preserve individual progress", async () => {
        // Create multiple tasks with different statuses to test selective updating
        await prisma.user_task_log.create({
            data: {
                user_id: 'user1',
                quest_id: 'quest1',
                task_id: 'task2',
                status: TaskStatus.COMPLETED, // This should NOT be updated
            },
        });
        await prisma.user_task_log.create({
            data: {
                user_id: 'user1',
                quest_id: 'quest1',
                task_id: 'task3',
                status: TaskStatus.FAILED, // This should NOT be updated
            },
        });
        await prisma.user_task_log.create({
            data: {
                user_id: 'user2',
                quest_id: 'quest1',
                task_id: 'task2',
                status: TaskStatus.AVAILABLE, // This SHOULD be updated
            },
        });

        // Update status - should only affect AVAILABLE tasks
        await repository.updateMembersStatus('quest1', ['user1', 'user2'], TaskStatus.ONGOING);

        const logs = await prisma.user_task_log.findMany({
            where: { quest_id: 'quest1' },
            orderBy: [{ user_id: 'asc' }, { task_id: 'asc' }],
        });

        // Should have 5 total logs: 2 original + 3 new ones
        expect(logs).toHaveLength(5);

        // Check that only AVAILABLE tasks were updated to ONGOING
        const user1Task1 = logs.find((l) => l.user_id === 'user1' && l.task_id === 'task1');
        const user1Task2 = logs.find((l) => l.user_id === 'user1' && l.task_id === 'task2');
        const user1Task3 = logs.find((l) => l.user_id === 'user1' && l.task_id === 'task3');
        const user2Task1 = logs.find((l) => l.user_id === 'user2' && l.task_id === 'task1');
        const user2Task2 = logs.find((l) => l.user_id === 'user2' && l.task_id === 'task2');

        // Original AVAILABLE tasks should now be ONGOING
        expect(user1Task1?.status).toEqual(TaskStatus.ONGOING);
        expect(user2Task1?.status).toEqual(TaskStatus.ONGOING);
        expect(user2Task2?.status).toEqual(TaskStatus.ONGOING); // Was AVAILABLE, now ONGOING

        // COMPLETED and FAILED tasks should be preserved
        expect(user1Task2?.status).toEqual(TaskStatus.COMPLETED); // Should remain COMPLETED
        expect(user1Task3?.status).toEqual(TaskStatus.FAILED); // Should remain FAILED
    });
});

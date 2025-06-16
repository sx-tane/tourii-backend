import { cleanDb } from '@app/core-test/prisma/clean-db';
import { UserMapper } from '@app/core/infrastructure/mapper/user.mapper';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Test, type TestingModule } from '@nestjs/testing';
import { TaskStatus, TaskType } from '@prisma/client';
import { UserTaskLogRepositoryDb } from './user-task-log.repository-db';

describe('UserTaskLogRepositoryDb - Social Share', () => {
    let repository: UserTaskLogRepositoryDb;
    let prisma: PrismaService;

    const userId = 'test-user-id';
    const questId = 'test-quest-id';
    const taskId = 'test-task-id';
    const socialShareUrl = 'https://twitter.com/user/status/1234567890';

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserTaskLogRepositoryDb, PrismaService],
        }).compile();

        repository = module.get(UserTaskLogRepositoryDb);
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
                perks_wallet_address: 'test-wallet-address',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

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
                quest_id: questId,
                tourist_spot_id: 'spot1',
                quest_name: 'Test Quest',
                quest_desc: 'A quest for testing',
                quest_type: 'TRAVEL_TO_EARN',
                reward_type: 'LOCAL_EXPERIENCES',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        await prisma.quest_task.create({
            data: {
                quest_task_id: taskId,
                quest_id: questId,
                task_theme: 'STORY',
                task_type: 'SHARE_SOCIAL',
                task_name: 'Social Share Task',
                task_desc: 'Share your experience on social media',
                is_unlocked: true,
                required_action: 'Share on social media',
                group_activity_members: [],
                select_options: [],
                anti_cheat_rules: {},
                magatama_point_awarded: 15,
                reward_earned: 'Social Influencer Badge',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
    });

    describe('completeSocialShareTask', () => {
        it('should create a new user task log when completing a social share task for the first time', async () => {
            await repository.completeSocialShareTask(userId, taskId, socialShareUrl);

            const taskLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            expect(taskLog).not.toBeNull();
            expect(taskLog?.status).toEqual(TaskStatus.COMPLETED);
            expect(taskLog?.action).toEqual(TaskType.SHARE_SOCIAL);
            expect(taskLog?.submission_data).toEqual({ social_share_url: socialShareUrl });
            expect(taskLog?.completed_at).not.toBeNull();
            expect(taskLog?.claimed_at).not.toBeNull();
            expect(taskLog?.total_magatama_point_awarded).toEqual(0);
            expect(taskLog?.group_activity_members).toEqual([]);
            expect(taskLog?.ins_user_id).toEqual(userId);
            expect(taskLog?.upd_user_id).toEqual(userId);
        });

        it('should update an existing user task log when completing a social share task again', async () => {
            const initialSocialUrl = 'https://twitter.com/user/status/1111111111';
            const updatedSocialUrl = 'https://twitter.com/user/status/2222222222';

            // First completion
            await repository.completeSocialShareTask(userId, taskId, initialSocialUrl);
            const initialLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            // Second completion with updated social share
            await repository.completeSocialShareTask(userId, taskId, updatedSocialUrl);
            const updatedLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            expect(updatedLog).not.toBeNull();
            expect(updatedLog?.user_task_log_id).toEqual(initialLog?.user_task_log_id);
            expect(updatedLog?.status).toEqual(TaskStatus.COMPLETED);
            expect(updatedLog?.submission_data).toEqual({ social_share_url: updatedSocialUrl });
            expect(updatedLog?.completed_at).not.toBeNull();
            expect(updatedLog?.upd_user_id).toEqual(userId);
            // Verify the social share URL was updated
            expect(updatedLog?.submission_data).not.toEqual({ social_share_url: initialSocialUrl });
        });

        it('should throw an error when the quest task does not exist', async () => {
            const nonExistentTaskId = 'non-existent-task-id';

            await expect(
                repository.completeSocialShareTask(userId, nonExistentTaskId, socialShareUrl),
            ).rejects.toThrow(new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_028));
        });

        it('should use UserMapper to create task log data', async () => {
            const userMapperSpy = jest.spyOn(UserMapper, 'createUserTaskLogForSocialShare');

            await repository.completeSocialShareTask(userId, taskId, socialShareUrl);

            expect(userMapperSpy).toHaveBeenCalledWith(userId, questId, taskId, socialShareUrl);

            userMapperSpy.mockRestore();
        });

        it('should handle database errors gracefully', async () => {
            // Mock Prisma to throw an error
            const prismaError = new Error('Database connection failed');
            jest.spyOn(prisma.quest_task, 'findUnique').mockRejectedValueOnce(prismaError);

            await expect(
                repository.completeSocialShareTask(userId, taskId, socialShareUrl),
            ).rejects.toThrow(prismaError);
        });

        it('should preserve existing task log fields when updating', async () => {
            // Create initial task log with some custom data
            await prisma.user_task_log.create({
                data: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                    status: TaskStatus.ONGOING,
                    action: TaskType.SHARE_SOCIAL,
                    group_activity_members: [],
                    submission_data: { social_share_url: 'old-url.com' },
                    total_magatama_point_awarded: 5,
                    ins_user_id: 'original-user',
                    ins_date_time: new Date('2023-01-01'),
                    upd_user_id: 'original-user',
                    upd_date_time: new Date('2023-01-01'),
                },
            });

            await repository.completeSocialShareTask(userId, taskId, socialShareUrl);

            const updatedLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            expect(updatedLog).not.toBeNull();
            expect(updatedLog?.status).toEqual(TaskStatus.COMPLETED);
            expect(updatedLog?.submission_data).toEqual({ social_share_url: socialShareUrl });
            expect(updatedLog?.completed_at).not.toBeNull();
            expect(updatedLog?.upd_user_id).toEqual(userId);
            // Verify original creation data is preserved
            expect(updatedLog?.ins_user_id).toEqual('original-user');
            expect(updatedLog?.ins_date_time).toEqual(new Date('2023-01-01'));
        });

        it('should handle various social media platform URLs', async () => {
            const testUrls = [
                'https://twitter.com/user/status/1234567890',
                'https://x.com/user/status/1234567890',
                'https://instagram.com/p/ABC123/',
                'https://facebook.com/user/posts/123456',
                'https://linkedin.com/posts/user_123456',
                'https://tiktok.com/@user/video/1234567890',
                'https://youtube.com/watch?v=dQw4w9WgXcQ',
                'https://reddit.com/r/programming/comments/abc123/',
            ];

            for (const [index, url] of testUrls.entries()) {
                const uniqueTaskId = `${taskId}-${index}`;
                
                // Create a unique task for each URL test
                await prisma.quest_task.create({
                    data: {
                        quest_task_id: uniqueTaskId,
                        quest_id: questId,
                        task_theme: 'STORY',
                        task_type: 'SHARE_SOCIAL',
                        task_name: `Social Share Task ${index}`,
                        task_desc: 'Share your experience on social media',
                        is_unlocked: true,
                        required_action: 'Share on social media',
                        group_activity_members: [],
                        select_options: [],
                        anti_cheat_rules: {},
                        magatama_point_awarded: 15,
                        reward_earned: 'Social Influencer Badge',
                        ins_user_id: 'system',
                        upd_user_id: 'system',
                    },
                });

                await repository.completeSocialShareTask(userId, uniqueTaskId, url);

                const taskLog = await prisma.user_task_log.findFirst({
                    where: {
                        user_id: userId,
                        quest_id: questId,
                        task_id: uniqueTaskId,
                    },
                });

                expect(taskLog).not.toBeNull();
                expect(taskLog?.status).toEqual(TaskStatus.COMPLETED);
                expect(taskLog?.action).toEqual(TaskType.SHARE_SOCIAL);
                expect(taskLog?.submission_data).toEqual({ social_share_url: url });
            }
        });

        it('should handle empty and null social share URLs', async () => {
            const emptyUrl = '';
            
            await repository.completeSocialShareTask(userId, taskId, emptyUrl);

            const taskLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            expect(taskLog).not.toBeNull();
            expect(taskLog?.status).toEqual(TaskStatus.COMPLETED);
            expect(taskLog?.action).toEqual(TaskType.SHARE_SOCIAL);
            expect(taskLog?.submission_data).toEqual({ social_share_url: emptyUrl });
        });

        it('should handle concurrent completions for different users', async () => {
            const userId2 = 'test-user-id-2';
            const socialUrl1 = 'https://twitter.com/user1/status/1111111111';
            const socialUrl2 = 'https://twitter.com/user2/status/2222222222';

            // Create second user
            await prisma.user.create({
                data: {
                    user_id: userId2,
                    username: 'test-user-2',
                    password: 'password',
                    perks_wallet_address: 'test-wallet-address-2',
                    ins_user_id: 'system',
                    upd_user_id: 'system',
                },
            });

            // Complete tasks simultaneously for both users
            await Promise.all([
                repository.completeSocialShareTask(userId, taskId, socialUrl1),
                repository.completeSocialShareTask(userId2, taskId, socialUrl2),
            ]);

            const taskLog1 = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            const taskLog2 = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId2,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            expect(taskLog1).not.toBeNull();
            expect(taskLog2).not.toBeNull();
            expect(taskLog1?.submission_data).toEqual({ social_share_url: socialUrl1 });
            expect(taskLog2?.submission_data).toEqual({ social_share_url: socialUrl2 });
            expect(taskLog1?.user_task_log_id).not.toEqual(taskLog2?.user_task_log_id);
        });
    });
});
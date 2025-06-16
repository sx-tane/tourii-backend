import { cleanDb } from '@app/core-test/prisma/clean-db';
import { UserMapper } from '@app/core/infrastructure/mapper/user.mapper';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Test, type TestingModule } from '@nestjs/testing';
import { TaskStatus, TaskType } from '@prisma/client';
import { UserTaskLogRepositoryDb } from './user-task-log.repository-db';

describe('UserTaskLogRepositoryDb', () => {
    let repository: UserTaskLogRepositoryDb;
    let prisma: PrismaService;

    const userId = 'test-user-id';
    const questId = 'test-quest-id';
    const taskId = 'test-task-id';
    const proofUrl = 'https://example.com/proof.jpg';

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
                task_type: 'PHOTO_UPLOAD',
                task_name: 'Photo Upload Task',
                task_desc: 'Upload a photo to complete this task',
                is_unlocked: true,
                required_action: 'Take a photo',
                group_activity_members: [],
                select_options: [],
                anti_cheat_rules: {},
                magatama_point_awarded: 10,
                reward_earned: 'Photo Badge',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
    });

    describe('completePhotoTask', () => {
        it('should create a new user task log when completing a photo task for the first time', async () => {
            await repository.completePhotoTask(userId, taskId, proofUrl);

            const taskLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            expect(taskLog).not.toBeNull();
            expect(taskLog?.status).toEqual(TaskStatus.COMPLETED);
            expect(taskLog?.action).toEqual(TaskType.PHOTO_UPLOAD);
            expect(taskLog?.submission_data).toEqual({ image_url: proofUrl });
            expect(taskLog?.completed_at).not.toBeNull();
            expect(taskLog?.claimed_at).not.toBeNull();
            expect(taskLog?.total_magatama_point_awarded).toEqual(0);
            expect(taskLog?.group_activity_members).toEqual([]);
            expect(taskLog?.ins_user_id).toEqual(userId);
            expect(taskLog?.upd_user_id).toEqual(userId);
        });

        it('should update an existing user task log when completing a photo task again', async () => {
            const initialProofUrl = 'https://example.com/initial-proof.jpg';
            const updatedProofUrl = 'https://example.com/updated-proof.jpg';

            // First completion
            await repository.completePhotoTask(userId, taskId, initialProofUrl);
            const initialLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            // Second completion with updated proof
            await repository.completePhotoTask(userId, taskId, updatedProofUrl);
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
            expect(updatedLog?.submission_data).toEqual({ image_url: updatedProofUrl });
            expect(updatedLog?.completed_at).not.toBeNull();
            expect(updatedLog?.upd_user_id).toEqual(userId);
            // Verify the proof URL was updated
            expect(updatedLog?.submission_data).not.toEqual({ image_url: initialProofUrl });
        });

        it('should throw an error when the quest task does not exist', async () => {
            const nonExistentTaskId = 'non-existent-task-id';

            await expect(
                repository.completePhotoTask(userId, nonExistentTaskId, proofUrl),
            ).rejects.toThrow(new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_028));
        });

        it('should use UserMapper to create task log data', async () => {
            const userMapperSpy = jest.spyOn(UserMapper, 'createUserTaskLogForPhotoUpload');

            await repository.completePhotoTask(userId, taskId, proofUrl);

            expect(userMapperSpy).toHaveBeenCalledWith(userId, questId, taskId, proofUrl);

            userMapperSpy.mockRestore();
        });

        it('should handle database errors gracefully', async () => {
            // Mock Prisma to throw an error
            const prismaError = new Error('Database connection failed');
            jest.spyOn(prisma.quest_task, 'findUnique').mockRejectedValueOnce(prismaError);

            await expect(repository.completePhotoTask(userId, taskId, proofUrl)).rejects.toThrow(
                prismaError,
            );
        });

        it('should preserve existing task log fields when updating', async () => {
            // Create initial task log with some custom data
            await prisma.user_task_log.create({
                data: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                    status: TaskStatus.ONGOING,
                    action: TaskType.PHOTO_UPLOAD,
                    group_activity_members: [],
                    submission_data: { image_url: 'old-url.jpg' },
                    total_magatama_point_awarded: 5,
                    ins_user_id: 'original-user',
                    ins_date_time: new Date('2023-01-01'),
                    upd_user_id: 'original-user',
                    upd_date_time: new Date('2023-01-01'),
                },
            });

            await repository.completePhotoTask(userId, taskId, proofUrl);

            const updatedLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            expect(updatedLog).not.toBeNull();
            expect(updatedLog?.status).toEqual(TaskStatus.COMPLETED);
            expect(updatedLog?.submission_data).toEqual({ image_url: proofUrl });
            expect(updatedLog?.completed_at).not.toBeNull();
            expect(updatedLog?.upd_user_id).toEqual(userId);
            // Verify original creation data is preserved
            expect(updatedLog?.ins_user_id).toEqual('original-user');
            expect(updatedLog?.ins_date_time).toEqual(new Date('2023-01-01'));
        });
    });

    describe('completeSocialTask', () => {
        const socialUrl = 'https://twitter.com/user/status/123456789';

        beforeEach(async () => {
            // Update the existing task to be a social share task for social tests
            await prisma.quest_task.update({
                where: { quest_task_id: taskId },
                data: {
                    task_type: 'SHARE_SOCIAL',
                    task_name: 'Social Share Task',
                    task_desc: 'Share your experience on social media',
                    required_action: 'Share on social media',
                },
            });
        });

        it('should create a new user task log when completing a social task for the first time', async () => {
            await repository.completeSocialTask(userId, taskId, socialUrl);

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
            expect(taskLog?.submission_data).toEqual({ social_url: socialUrl });
            expect(taskLog?.completed_at).not.toBeNull();
            expect(taskLog?.claimed_at).not.toBeNull();
            expect(taskLog?.total_magatama_point_awarded).toEqual(0);
            expect(taskLog?.group_activity_members).toEqual([]);
            expect(taskLog?.ins_user_id).toEqual(userId);
            expect(taskLog?.upd_user_id).toEqual(userId);
        });

        it('should update an existing user task log when completing a social task again', async () => {
            const initialSocialUrl = 'https://twitter.com/user/status/111111111';
            const updatedSocialUrl = 'https://twitter.com/user/status/222222222';

            // First completion
            await repository.completeSocialTask(userId, taskId, initialSocialUrl);
            const initialLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            // Second completion with updated social URL
            await repository.completeSocialTask(userId, taskId, updatedSocialUrl);
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
            expect(updatedLog?.submission_data).toEqual({ social_url: updatedSocialUrl });
            expect(updatedLog?.completed_at).not.toBeNull();
            expect(updatedLog?.upd_user_id).toEqual(userId);
            // Verify the social URL was updated
            expect(updatedLog?.submission_data).not.toEqual({ social_url: initialSocialUrl });
        });

        it('should throw an error when the quest task does not exist', async () => {
            const nonExistentTaskId = 'non-existent-social-task-id';

            await expect(
                repository.completeSocialTask(userId, nonExistentTaskId, socialUrl),
            ).rejects.toThrow(new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_028));
        });

        it('should use UserMapper to create social task log data', async () => {
            const userMapperSpy = jest.spyOn(UserMapper, 'createUserTaskLogForSocialShare');

            await repository.completeSocialTask(userId, taskId, socialUrl);

            expect(userMapperSpy).toHaveBeenCalledWith(userId, questId, taskId, socialUrl);

            userMapperSpy.mockRestore();
        });

        it('should handle database errors gracefully for social tasks', async () => {
            // Mock Prisma to throw an error
            const prismaError = new Error('Database connection failed');
            jest.spyOn(prisma.quest_task, 'findUnique').mockRejectedValueOnce(prismaError);

            await expect(repository.completeSocialTask(userId, taskId, socialUrl)).rejects.toThrow(
                prismaError,
            );
        });

        it('should preserve existing task log fields when updating social task', async () => {
            // Create initial task log with some custom data
            await prisma.user_task_log.create({
                data: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                    status: TaskStatus.ONGOING,
                    action: TaskType.SHARE_SOCIAL,
                    group_activity_members: [],
                    submission_data: { social_url: 'https://twitter.com/old/status/999' },
                    total_magatama_point_awarded: 5,
                    ins_user_id: 'original-user',
                    ins_date_time: new Date('2023-01-01'),
                    upd_user_id: 'original-user',
                    upd_date_time: new Date('2023-01-01'),
                },
            });

            await repository.completeSocialTask(userId, taskId, socialUrl);

            const updatedLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            expect(updatedLog).not.toBeNull();
            expect(updatedLog?.status).toEqual(TaskStatus.COMPLETED);
            expect(updatedLog?.submission_data).toEqual({ social_url: socialUrl });
            expect(updatedLog?.completed_at).not.toBeNull();
            expect(updatedLog?.upd_user_id).toEqual(userId);
            // Verify original creation data is preserved
            expect(updatedLog?.ins_user_id).toEqual('original-user');
            expect(updatedLog?.ins_date_time).toEqual(new Date('2023-01-01'));
        });

        it('should handle different social media platforms correctly', async () => {
            const testCases = [
                'https://twitter.com/user/status/123456789',
                'https://x.com/user/status/123456789',
                'https://instagram.com/p/ABC123/',
                'https://facebook.com/user/posts/123456789',
                'https://linkedin.com/posts/user_123456789',
                'https://tiktok.com/@user/video/123456789',
                'https://youtube.com/watch?v=ABC123',
                'https://reddit.com/r/subreddit/comments/123456/title/',
            ];

            for (const url of testCases) {
                // Clean up previous test data
                await prisma.user_task_log.deleteMany({
                    where: {
                        user_id: userId,
                        quest_id: questId,
                        task_id: taskId,
                    },
                });

                await repository.completeSocialTask(userId, taskId, url);

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
                expect(taskLog?.submission_data).toEqual({ social_url: url });
            }
        });

        it('should handle edge cases for social URLs', async () => {
            const edgeCases = [
                'https://twitter.com/user/status/123456789?ref=src%5Etfw',
                'https://www.instagram.com/p/ABC123/?utm_source=ig_web_copy_link',
                'https://m.facebook.com/user/posts/123456789',
                'https://linkedin.com/posts/user_activity-123456789-xyz',
            ];

            for (const url of edgeCases) {
                // Clean up previous test data
                await prisma.user_task_log.deleteMany({
                    where: {
                        user_id: userId,
                        quest_id: questId,
                        task_id: taskId,
                    },
                });

                await repository.completeSocialTask(userId, taskId, url);

                const taskLog = await prisma.user_task_log.findFirst({
                    where: {
                        user_id: userId,
                        quest_id: questId,
                        task_id: taskId,
                    },
                });

                expect(taskLog).not.toBeNull();
                expect(taskLog?.submission_data).toEqual({ social_url: url });
            }
        });
    });
});

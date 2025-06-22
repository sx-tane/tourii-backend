import { UserMapper } from '@app/core/infrastructure/mapper/user.mapper';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { cleanDb } from '@app/core-test/prisma/clean-db';
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
        const socialProofUrl = 'https://twitter.com/user/status/1234567890';

        it('should create a new user task log when completing a social task for the first time', async () => {
            await repository.completeSocialTask(userId, taskId, socialProofUrl);

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
            expect(taskLog?.submission_data).toEqual({ social_url: socialProofUrl });
            expect(taskLog?.completed_at).not.toBeNull();
            expect(taskLog?.claimed_at).not.toBeNull();
            expect(taskLog?.total_magatama_point_awarded).toEqual(0);
            expect(taskLog?.group_activity_members).toEqual([]);
            expect(taskLog?.ins_user_id).toEqual(userId);
            expect(taskLog?.upd_user_id).toEqual(userId);
        });

        it('should update an existing user task log when completing a social task again', async () => {
            const initialSocialUrl = 'https://twitter.com/user/status/111111';
            const updatedSocialUrl = 'https://twitter.com/user/status/222222';

            // First completion
            await repository.completeSocialTask(userId, taskId, initialSocialUrl);
            const initialLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            // Second completion with updated proof
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
                repository.completeSocialTask(userId, nonExistentTaskId, socialProofUrl),
            ).rejects.toThrow(new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_028));
        });

        it('should use UserMapper to create social task log data', async () => {
            const userMapperSpy = jest.spyOn(UserMapper, 'createUserTaskLogForSocialShare');

            await repository.completeSocialTask(userId, taskId, socialProofUrl);

            expect(userMapperSpy).toHaveBeenCalledWith(userId, questId, taskId, socialProofUrl);

            userMapperSpy.mockRestore();
        });

        it('should handle database errors gracefully for social tasks', async () => {
            // Mock Prisma to throw an error
            const prismaError = new Error('Database connection failed');
            jest.spyOn(prisma.quest_task, 'findUnique').mockRejectedValueOnce(prismaError);

            await expect(
                repository.completeSocialTask(userId, taskId, socialProofUrl),
            ).rejects.toThrow(prismaError);
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
                    submission_data: { social_url: 'https://old-social-url.com' },
                    total_magatama_point_awarded: 5,
                    ins_user_id: 'original-user',
                    ins_date_time: new Date('2023-01-01'),
                    upd_user_id: 'original-user',
                    upd_date_time: new Date('2023-01-01'),
                },
            });

            await repository.completeSocialTask(userId, taskId, socialProofUrl);

            const updatedLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            expect(updatedLog).not.toBeNull();
            expect(updatedLog?.status).toEqual(TaskStatus.COMPLETED);
            expect(updatedLog?.submission_data).toEqual({ social_url: socialProofUrl });
            expect(updatedLog?.completed_at).not.toBeNull();
            expect(updatedLog?.upd_user_id).toEqual(userId);
            // Verify original creation data is preserved
            expect(updatedLog?.ins_user_id).toEqual('original-user');
            expect(updatedLog?.ins_date_time).toEqual(new Date('2023-01-01'));
        });

        it('should handle various social media URL formats', async () => {
            const testCases = [
                'https://twitter.com/user/status/123',
                'https://x.com/user/status/456',
                'https://instagram.com/p/abcd123/',
                'https://www.facebook.com/user/posts/789',
                'https://linkedin.com/feed/update/urn:li:activity:456',
                'https://tiktok.com/@user/video/789',
                'https://youtube.com/watch?v=abc123',
                'https://reddit.com/r/subreddit/comments/123/title/',
            ];

            for (const [index, url] of testCases.entries()) {
                const uniqueTaskId = `${taskId}-${index}`;

                // Create a unique task for each test case
                await prisma.quest_task.create({
                    data: {
                        quest_task_id: uniqueTaskId,
                        quest_id: questId,
                        task_theme: 'STORY',
                        task_type: 'SHARE_SOCIAL',
                        task_name: `Social Share Task ${index}`,
                        task_desc: 'Share on social media',
                        is_unlocked: true,
                        required_action: 'Share on social media',
                        group_activity_members: [],
                        select_options: [],
                        anti_cheat_rules: {},
                        magatama_point_awarded: 10,
                        reward_earned: 'Social Badge',
                        ins_user_id: 'system',
                        upd_user_id: 'system',
                    },
                });

                await repository.completeSocialTask(userId, uniqueTaskId, url);

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
                expect(taskLog?.submission_data).toEqual({ social_url: url });
            }
        });

        it('should handle concurrent social task completions without conflicts', async () => {
            const promises = Array.from({ length: 5 }, (_, i) =>
                repository.completeSocialTask(userId, taskId, `${socialProofUrl}${i}`),
            );

            await Promise.all(promises);

            const taskLogs = await prisma.user_task_log.findMany({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            // Should only have one record due to upsert behavior
            expect(taskLogs).toHaveLength(1);
            expect(taskLogs[0].status).toEqual(TaskStatus.COMPLETED);
            expect(taskLogs[0].action).toEqual(TaskType.SHARE_SOCIAL);
            // The final URL should be from one of the concurrent operations
            expect(taskLogs[0].submission_data).toEqual(
                expect.objectContaining({
                    social_url: expect.stringContaining(socialProofUrl),
                }),
            );
        });
    });

    describe('submitLocalInteractionTaskForVerification', () => {
        beforeEach(async () => {
            // Create a task specifically for local interaction testing
            await prisma.quest_task.upsert({
                where: { quest_task_id: taskId },
                update: {
                    task_type: 'LOCAL_INTERACTION',
                    task_name: 'Local Interaction Task',
                    task_desc: 'Submit a local interaction to complete this task',
                },
                create: {
                    quest_task_id: taskId,
                    quest_id: questId,
                    task_theme: 'STORY',
                    task_type: 'LOCAL_INTERACTION',
                    task_name: 'Local Interaction Task',
                    task_desc: 'Submit a local interaction to complete this task',
                    is_unlocked: true,
                    required_action: 'Submit local interaction',
                    group_activity_members: [],
                    select_options: [],
                    anti_cheat_rules: {},
                    magatama_point_awarded: 15,
                    reward_earned: 'Interaction Badge',
                    ins_user_id: 'system',
                    upd_user_id: 'system',
                },
            });
        });

        it('should create a new user task log for text interaction when submitting for the first time', async () => {
            const textContent = 'This is my local interaction text response';

            await repository.submitLocalInteractionTaskForVerification(
                userId,
                taskId,
                'text',
                textContent,
            );

            const taskLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            expect(taskLog).not.toBeNull();
            expect(taskLog?.status).toEqual(TaskStatus.ONGOING);
            expect(taskLog?.action).toEqual(TaskType.LOCAL_INTERACTION);
            expect(taskLog?.submission_data).toEqual({
                interaction_type: 'text',
                content: textContent,
            });
            expect(taskLog?.user_response).toEqual(textContent);
            expect(taskLog?.completed_at).not.toBeNull();
            expect(taskLog?.claimed_at).toBeNull(); // Not claimed until verified
            expect(taskLog?.total_magatama_point_awarded).toEqual(0);
            expect(taskLog?.ins_user_id).toEqual(userId);
            expect(taskLog?.upd_user_id).toEqual(userId);
        });

        it('should create a new user task log for photo interaction', async () => {
            const photoUrl = 'https://example.com/photo-interaction.jpg';

            await repository.submitLocalInteractionTaskForVerification(
                userId,
                taskId,
                'photo',
                photoUrl,
            );

            const taskLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            expect(taskLog).not.toBeNull();
            expect(taskLog?.status).toEqual(TaskStatus.ONGOING);
            expect(taskLog?.action).toEqual(TaskType.LOCAL_INTERACTION);
            expect(taskLog?.submission_data).toEqual({
                interaction_type: 'photo',
                content: photoUrl,
            });
            expect(taskLog?.user_response).toEqual(photoUrl);
            expect(taskLog?.completed_at).not.toBeNull();
            expect(taskLog?.claimed_at).toBeNull();
        });

        it('should create a new user task log for audio interaction', async () => {
            const audioUrl = 'https://example.com/audio-interaction.mp3';

            await repository.submitLocalInteractionTaskForVerification(
                userId,
                taskId,
                'audio',
                audioUrl,
            );

            const taskLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            expect(taskLog).not.toBeNull();
            expect(taskLog?.status).toEqual(TaskStatus.ONGOING);
            expect(taskLog?.action).toEqual(TaskType.LOCAL_INTERACTION);
            expect(taskLog?.submission_data).toEqual({
                interaction_type: 'audio',
                content: audioUrl,
            });
            expect(taskLog?.user_response).toEqual(audioUrl);
        });

        it('should update an existing user task log when submitting again', async () => {
            const initialContent = 'Initial interaction text';
            const updatedContent = 'Updated interaction text';

            // First submission
            await repository.submitLocalInteractionTaskForVerification(
                userId,
                taskId,
                'text',
                initialContent,
            );
            const initialLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            // Second submission with updated content
            await repository.submitLocalInteractionTaskForVerification(
                userId,
                taskId,
                'text',
                updatedContent,
            );
            const updatedLog = await prisma.user_task_log.findFirst({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            expect(updatedLog).not.toBeNull();
            expect(updatedLog?.user_task_log_id).toEqual(initialLog?.user_task_log_id);
            expect(updatedLog?.status).toEqual(TaskStatus.ONGOING);
            expect(updatedLog?.submission_data).toEqual({
                interaction_type: 'text',
                content: updatedContent,
            });
            expect(updatedLog?.user_response).toEqual(updatedContent);
            expect(updatedLog?.upd_user_id).toEqual(userId);
            // Verify the content was updated
            expect(updatedLog?.submission_data).not.toEqual({
                interaction_type: 'text',
                content: initialContent,
            });
        });

        it('should throw TouriiBackendAppException when the quest task does not exist', async () => {
            const nonExistentTaskId = 'non-existent-task-id';
            const textContent = 'Test content';

            await expect(
                repository.submitLocalInteractionTaskForVerification(
                    userId,
                    nonExistentTaskId,
                    'text',
                    textContent,
                ),
            ).rejects.toThrow(TouriiBackendAppException);

            await expect(
                repository.submitLocalInteractionTaskForVerification(
                    userId,
                    nonExistentTaskId,
                    'text',
                    textContent,
                ),
            ).rejects.toThrow('Quest task not found');
        });

        it('should handle different interaction types correctly in submission data', async () => {
            const interactions = [
                { type: 'text' as const, content: 'Text interaction content' },
                { type: 'photo' as const, content: 'https://example.com/photo.jpg' },
                { type: 'audio' as const, content: 'https://example.com/audio.mp3' },
            ];

            for (let i = 0; i < interactions.length; i++) {
                const interaction = interactions[i];
                const uniqueTaskId = `${taskId}-${i}`;
                const uniqueUserId = `${userId}-${i}`;

                // Create unique task and user for each test case
                await prisma.quest_task.create({
                    data: {
                        quest_task_id: uniqueTaskId,
                        quest_id: questId,
                        task_theme: 'STORY',
                        task_type: 'LOCAL_INTERACTION',
                        task_name: `Test Task ${i}`,
                        task_desc: 'Test task description',
                        is_unlocked: true,
                        required_action: 'Submit interaction',
                        group_activity_members: [],
                        select_options: [],
                        anti_cheat_rules: {},
                        magatama_point_awarded: 10,
                        reward_earned: 'Test Badge',
                        ins_user_id: 'system',
                        upd_user_id: 'system',
                    },
                });

                await prisma.user.create({
                    data: {
                        user_id: uniqueUserId,
                        username: `test-user-${i}`,
                        password: 'password',
                        perks_wallet_address: `test-wallet-address-${i}`,
                        ins_user_id: 'system',
                        upd_user_id: 'system',
                    },
                });

                await repository.submitLocalInteractionTaskForVerification(
                    uniqueUserId,
                    uniqueTaskId,
                    interaction.type,
                    interaction.content,
                );

                const taskLog = await prisma.user_task_log.findFirst({
                    where: {
                        user_id: uniqueUserId,
                        quest_id: questId,
                        task_id: uniqueTaskId,
                    },
                });

                expect(taskLog?.submission_data).toEqual({
                    interaction_type: interaction.type,
                    content: interaction.content,
                });
                expect(taskLog?.user_response).toEqual(interaction.content);
                expect(taskLog?.action).toEqual(TaskType.LOCAL_INTERACTION);
            }
        });

        it('should handle concurrent submissions correctly with upsert behavior', async () => {
            const concurrentContent1 = 'Concurrent content 1';
            const concurrentContent2 = 'Concurrent content 2';

            // Submit two interactions concurrently
            await Promise.all([
                repository.submitLocalInteractionTaskForVerification(
                    userId,
                    taskId,
                    'text',
                    concurrentContent1,
                ),
                repository.submitLocalInteractionTaskForVerification(
                    userId,
                    taskId,
                    'text',
                    concurrentContent2,
                ),
            ]);

            const taskLogs = await prisma.user_task_log.findMany({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                },
            });

            // Should only have one record due to upsert behavior
            expect(taskLogs).toHaveLength(1);
            expect(taskLogs[0].status).toEqual(TaskStatus.ONGOING);
            expect(taskLogs[0].action).toEqual(TaskType.LOCAL_INTERACTION);
            // The final content should be from one of the concurrent operations
            expect([concurrentContent1, concurrentContent2]).toContain(taskLogs[0].user_response);
        });
    });
});

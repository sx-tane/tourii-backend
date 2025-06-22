import type { UserTravelLogFilter } from '@app/core/domain/user/user-travel-log.repository';
import { PrismaService } from '@app/core/provider/prisma.service';
import { cleanDb } from '@app/core-test/prisma/clean-db';
import { Test, type TestingModule } from '@nestjs/testing';
import { UserTravelLogRepositoryDb } from './user-travel-log.repository-db';

describe('UserTravelLogRepositoryDb', () => {
    let repository: UserTravelLogRepositoryDb;
    let prismaService: PrismaService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserTravelLogRepositoryDb, PrismaService],
        }).compile();

        repository = module.get<UserTravelLogRepositoryDb>(UserTravelLogRepositoryDb);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    beforeEach(async () => {
        await cleanDb();

        // Create prerequisite user record for foreign key constraint
        await prismaService.user.create({
            data: {
                user_id: 'test-user-id',
                username: 'test-user',
                password: 'password',
                perks_wallet_address: 'test-wallet-address',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
    });

    afterAll(async () => {
        await prismaService.$disconnect();
    });

    describe('getUserTravelLogsWithPagination', () => {
        it('should return empty result when no logs exist', async () => {
            const filter: UserTravelLogFilter = {
                userId: 'test-user-id',
            };

            const result = await repository.getUserTravelLogsWithPagination(filter, 1, 20);

            expect(result.logs).toHaveLength(0);
            expect(result.total).toBe(0);
            expect(result.page).toBe(1);
            expect(result.limit).toBe(20);
        });

        it('should return paginated travel logs for user', async () => {
            // Setup test data
            const userId = 'test-user-id';
            const questId = 'test-quest-id';
            const taskId = 'test-task-id';
            const touristSpotId = 'test-tourist-spot-id';

            // Create test travel logs
            await prismaService.user_travel_log.createMany({
                data: [
                    {
                        user_travel_log_id: 'log1',
                        user_id: userId,
                        quest_id: questId,
                        task_id: taskId,
                        tourist_spot_id: touristSpotId,
                        user_longitude: 139.6917,
                        user_latitude: 35.6895,
                        travel_distance: 1.5,
                        ins_user_id: userId,
                        upd_user_id: userId,
                    },
                    {
                        user_travel_log_id: 'log2',
                        user_id: userId,
                        quest_id: questId,
                        task_id: taskId,
                        tourist_spot_id: touristSpotId,
                        user_longitude: 139.7671,
                        user_latitude: 35.6812,
                        travel_distance: 2.3,
                        ins_user_id: userId,
                        upd_user_id: userId,
                    },
                ],
            });

            const filter: UserTravelLogFilter = {
                userId,
            };

            const result = await repository.getUserTravelLogsWithPagination(filter, 1, 20);

            expect(result.logs).toHaveLength(2);
            expect(result.total).toBe(2);
            expect(result.page).toBe(1);
            expect(result.limit).toBe(20);
            expect(result.logs[0].userId).toBe(userId);
            expect(result.logs[0].questId).toBe(questId);
        });

        it('should filter by questId when provided', async () => {
            const userId = 'test-user-id';
            const questId1 = 'quest-1';
            const questId2 = 'quest-2';
            const taskId = 'test-task-id';
            const touristSpotId = 'test-tourist-spot-id';

            await prismaService.user_travel_log.createMany({
                data: [
                    {
                        user_travel_log_id: 'log1',
                        user_id: userId,
                        quest_id: questId1,
                        task_id: taskId,
                        tourist_spot_id: touristSpotId,
                        user_longitude: 139.6917,
                        user_latitude: 35.6895,
                        travel_distance: 1.5,
                        ins_user_id: userId,
                        upd_user_id: userId,
                    },
                    {
                        user_travel_log_id: 'log2',
                        user_id: userId,
                        quest_id: questId2,
                        task_id: taskId,
                        tourist_spot_id: touristSpotId,
                        user_longitude: 139.7671,
                        user_latitude: 35.6812,
                        travel_distance: 2.3,
                        ins_user_id: userId,
                        upd_user_id: userId,
                    },
                ],
            });

            const filter: UserTravelLogFilter = {
                userId,
                questId: questId1,
            };

            const result = await repository.getUserTravelLogsWithPagination(filter, 1, 20);

            expect(result.logs).toHaveLength(1);
            expect(result.total).toBe(1);
            expect(result.logs[0].questId).toBe(questId1);
        });

        it('should filter by touristSpotId when provided', async () => {
            const userId = 'test-user-id';
            const questId = 'test-quest-id';
            const taskId = 'test-task-id';
            const touristSpotId1 = 'spot-1';
            const touristSpotId2 = 'spot-2';

            await prismaService.user_travel_log.createMany({
                data: [
                    {
                        user_travel_log_id: 'log1',
                        user_id: userId,
                        quest_id: questId,
                        task_id: taskId,
                        tourist_spot_id: touristSpotId1,
                        user_longitude: 139.6917,
                        user_latitude: 35.6895,
                        travel_distance: 1.5,
                        ins_user_id: userId,
                        upd_user_id: userId,
                    },
                    {
                        user_travel_log_id: 'log2',
                        user_id: userId,
                        quest_id: questId,
                        task_id: taskId,
                        tourist_spot_id: touristSpotId2,
                        user_longitude: 139.7671,
                        user_latitude: 35.6812,
                        travel_distance: 2.3,
                        ins_user_id: userId,
                        upd_user_id: userId,
                    },
                ],
            });

            const filter: UserTravelLogFilter = {
                userId,
                touristSpotId: touristSpotId1,
            };

            const result = await repository.getUserTravelLogsWithPagination(filter, 1, 20);

            expect(result.logs).toHaveLength(1);
            expect(result.total).toBe(1);
            expect(result.logs[0].touristSpotId).toBe(touristSpotId1);
        });

        it('should filter by date range when provided', async () => {
            const userId = 'test-user-id';
            const questId = 'test-quest-id';
            const taskId = 'test-task-id';
            const touristSpotId = 'test-tourist-spot-id';

            const oldDate = new Date('2024-01-01');
            const newDate = new Date('2024-12-01');
            const filterStartDate = new Date('2024-06-01');
            const filterEndDate = new Date('2024-12-31');

            await prismaService.user_travel_log.createMany({
                data: [
                    {
                        user_travel_log_id: 'log1',
                        user_id: userId,
                        quest_id: questId,
                        task_id: taskId,
                        tourist_spot_id: touristSpotId,
                        user_longitude: 139.6917,
                        user_latitude: 35.6895,
                        travel_distance: 1.5,
                        ins_user_id: userId,
                        upd_user_id: userId,
                        ins_date_time: oldDate,
                        upd_date_time: oldDate,
                    },
                    {
                        user_travel_log_id: 'log2',
                        user_id: userId,
                        quest_id: questId,
                        task_id: taskId,
                        tourist_spot_id: touristSpotId,
                        user_longitude: 139.7671,
                        user_latitude: 35.6812,
                        travel_distance: 2.3,
                        ins_user_id: userId,
                        upd_user_id: userId,
                        ins_date_time: newDate,
                        upd_date_time: newDate,
                    },
                ],
            });

            const filter: UserTravelLogFilter = {
                userId,
                startDate: filterStartDate,
                endDate: filterEndDate,
            };

            const result = await repository.getUserTravelLogsWithPagination(filter, 1, 20);

            expect(result.logs).toHaveLength(1);
            expect(result.total).toBe(1);
            expect(result.logs[0].userTravelLogId).toBe('log2');
        });

        it('should handle pagination correctly', async () => {
            const userId = 'test-user-id';
            const questId = 'test-quest-id';
            const taskId = 'test-task-id';
            const touristSpotId = 'test-tourist-spot-id';

            // Create 5 test logs
            const logData = Array.from({ length: 5 }, (_, i) => ({
                user_travel_log_id: `log${i + 1}`,
                user_id: userId,
                quest_id: questId,
                task_id: taskId,
                tourist_spot_id: touristSpotId,
                user_longitude: 139.6917 + i * 0.001,
                user_latitude: 35.6895 + i * 0.001,
                travel_distance: 1.5 + i,
                ins_user_id: userId,
                upd_user_id: userId,
            }));

            await prismaService.user_travel_log.createMany({
                data: logData,
            });

            const filter: UserTravelLogFilter = {
                userId,
            };

            // Test first page
            const page1Result = await repository.getUserTravelLogsWithPagination(filter, 1, 2);
            expect(page1Result.logs).toHaveLength(2);
            expect(page1Result.total).toBe(5);
            expect(page1Result.page).toBe(1);
            expect(page1Result.limit).toBe(2);

            // Test second page
            const page2Result = await repository.getUserTravelLogsWithPagination(filter, 2, 2);
            expect(page2Result.logs).toHaveLength(2);
            expect(page2Result.total).toBe(5);
            expect(page2Result.page).toBe(2);
            expect(page2Result.limit).toBe(2);

            // Test third page (last page with 1 item)
            const page3Result = await repository.getUserTravelLogsWithPagination(filter, 3, 2);
            expect(page3Result.logs).toHaveLength(1);
            expect(page3Result.total).toBe(5);
            expect(page3Result.page).toBe(3);
            expect(page3Result.limit).toBe(2);
        });

        it('should exclude deleted logs', async () => {
            const userId = 'test-user-id';
            const questId = 'test-quest-id';
            const taskId = 'test-task-id';
            const touristSpotId = 'test-tourist-spot-id';

            await prismaService.user_travel_log.createMany({
                data: [
                    {
                        user_travel_log_id: 'log1',
                        user_id: userId,
                        quest_id: questId,
                        task_id: taskId,
                        tourist_spot_id: touristSpotId,
                        user_longitude: 139.6917,
                        user_latitude: 35.6895,
                        travel_distance: 1.5,
                        del_flag: false,
                        ins_user_id: userId,
                        upd_user_id: userId,
                    },
                    {
                        user_travel_log_id: 'log2',
                        user_id: userId,
                        quest_id: questId,
                        task_id: taskId,
                        tourist_spot_id: touristSpotId,
                        user_longitude: 139.7671,
                        user_latitude: 35.6812,
                        travel_distance: 2.3,
                        del_flag: true, // Deleted log
                        ins_user_id: userId,
                        upd_user_id: userId,
                    },
                ],
            });

            const filter: UserTravelLogFilter = {
                userId,
            };

            const result = await repository.getUserTravelLogsWithPagination(filter, 1, 20);

            expect(result.logs).toHaveLength(1);
            expect(result.total).toBe(1);
            expect(result.logs[0].userTravelLogId).toBe('log1');
        });
    });

    describe('getUserTravelLogById', () => {
        it('should return travel log by ID', async () => {
            const userId = 'test-user-id';
            const logId = 'test-log-id';
            const questId = 'test-quest-id';
            const taskId = 'test-task-id';
            const touristSpotId = 'test-tourist-spot-id';

            await prismaService.user_travel_log.create({
                data: {
                    user_travel_log_id: logId,
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                    tourist_spot_id: touristSpotId,
                    user_longitude: 139.6917,
                    user_latitude: 35.6895,
                    travel_distance: 1.5,
                    ins_user_id: userId,
                    upd_user_id: userId,
                },
            });

            const result = await repository.getUserTravelLogById(logId);

            expect(result).toBeDefined();
            expect(result?.userTravelLogId).toBe(logId);
            expect(result?.userId).toBe(userId);
            expect(result?.questId).toBe(questId);
        });

        it('should return undefined for non-existent log', async () => {
            const result = await repository.getUserTravelLogById('non-existent-id');
            expect(result).toBeUndefined();
        });

        it('should return undefined for deleted log', async () => {
            const userId = 'test-user-id';
            const logId = 'deleted-log-id';
            const questId = 'test-quest-id';
            const taskId = 'test-task-id';
            const touristSpotId = 'test-tourist-spot-id';

            await prismaService.user_travel_log.create({
                data: {
                    user_travel_log_id: logId,
                    user_id: userId,
                    quest_id: questId,
                    task_id: taskId,
                    tourist_spot_id: touristSpotId,
                    user_longitude: 139.6917,
                    user_latitude: 35.6895,
                    travel_distance: 1.5,
                    del_flag: true, // Deleted
                    ins_user_id: userId,
                    upd_user_id: userId,
                },
            });

            const result = await repository.getUserTravelLogById(logId);
            expect(result).toBeUndefined();
        });
    });
});

import { cleanDb } from '@app/core-test/prisma/clean-db';
import { MomentType } from '@app/core/domain/feed/moment-type';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Test, type TestingModule } from '@nestjs/testing';
import { MomentRepositoryDb } from './moment.repository-db';

describe('MomentRepositoryDb', () => {
    let repository: MomentRepositoryDb;
    let prisma: PrismaService;
    let cachingService: CachingService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MomentRepositoryDb,
                PrismaService,
                {
                    provide: CachingService,
                    useValue: {
                        getOrSet: jest.fn(),
                        invalidate: jest.fn(),
                        clearAll: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = module.get(MomentRepositoryDb);
        prisma = module.get(PrismaService);
        cachingService = module.get(CachingService);
        await prisma.$connect();
    });

    afterAll(async () => {
        await cleanDb();
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await cleanDb();
        jest.clearAllMocks();
    });

    describe('getLatest', () => {
        beforeEach(async () => {
            // Setup test data - this would typically come from actual data seeding
            // For now, we'll create mock data in the moment_view if it exists
            // Note: Since moment_view is a view, we need to create the underlying data

            // Create test users with unique wallet addresses
            await prisma.user.create({
                data: {
                    user_id: 'user1',
                    username: 'testuser1',
                    password: 'password',
                    perks_wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
                    ins_user_id: 'system',
                    upd_user_id: 'system',
                },
            });

            await prisma.user.create({
                data: {
                    user_id: 'user2',
                    username: 'testuser2',
                    password: 'password',
                    perks_wallet_address: '0x9876543210fedcba9876543210fedcba98765432',
                    ins_user_id: 'system',
                    upd_user_id: 'system',
                },
            });
        });

        it('should return moments with caching enabled', async () => {
            const mockMoments = [
                {
                    id: 'moment1',
                    user_id: 'user1',
                    username: 'testuser1',
                    image_url: 'https://example.com/image1.jpg',
                    description: 'Completed a quest',
                    reward_text: 'Earned 50 points',
                    ins_date_time: new Date('2024-01-01T10:00:00Z'),
                    moment_type: 'QUEST',
                },
                {
                    id: 'moment2',
                    user_id: 'user2',
                    username: 'testuser2',
                    image_url: 'https://example.com/image2.jpg',
                    description: 'Visited a location',
                    reward_text: 'Discovered new place',
                    ins_date_time: new Date('2024-01-01T09:00:00Z'),
                    moment_type: 'TRAVEL',
                },
            ];

            // Mock the caching service to return test data
            (cachingService.getOrSet as jest.Mock).mockResolvedValue({
                data: mockMoments,
                totalItems: 2,
            });

            const result = await repository.getLatest(10, 0);

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('moment1');
            expect(result[0].username).toBe('testuser1');
            expect(result[0].description).toBe('Completed a quest');
            expect(result[0].momentType).toBe(MomentType.QUEST);
            expect(result[0].totalItems).toBe(2);

            expect(result[1].id).toBe('moment2');
            expect(result[1].username).toBe('testuser2');
            expect(result[1].momentType).toBe(MomentType.TRAVEL);

            // Verify caching was called with correct parameters
            expect(cachingService.getOrSet).toHaveBeenCalledWith(
                'moments:10:0:all',
                expect.any(Function),
                300,
            );
        });

        it('should handle different moment types', async () => {
            const mockStoryMoments = [
                {
                    id: 'story1',
                    user_id: 'user1',
                    username: 'testuser1',
                    image_url: null,
                    description: 'Story completed',
                    reward_text: 'Story completed',
                    ins_date_time: new Date('2024-01-01T10:00:00Z'),
                    moment_type: 'STORY',
                },
            ];

            (cachingService.getOrSet as jest.Mock).mockResolvedValue({
                data: mockStoryMoments,
                totalItems: 1,
            });

            const result = await repository.getLatest(10, 0, MomentType.STORY);

            expect(result).toHaveLength(1);
            expect(result[0].momentType).toBe(MomentType.STORY);
            expect(result[0].description).toBe('Story completed');

            // Verify caching was called with correct cache key including moment type
            expect(cachingService.getOrSet).toHaveBeenCalledWith(
                'moments:10:0:STORY',
                expect.any(Function),
                300,
            );
        });

        it('should handle pagination parameters in cache key', async () => {
            const mockMoments = [
                {
                    id: 'moment3',
                    user_id: 'user1',
                    username: 'testuser1',
                    image_url: null,
                    description: 'Test moment',
                    reward_text: null,
                    ins_date_time: new Date('2024-01-01T10:00:00Z'),
                    moment_type: 'ITEM',
                },
            ];

            (cachingService.getOrSet as jest.Mock).mockResolvedValue({
                data: mockMoments,
                totalItems: 1,
            });

            await repository.getLatest(5, 10, MomentType.ITEM);

            // Verify cache key includes pagination parameters
            expect(cachingService.getOrSet).toHaveBeenCalledWith(
                'moments:5:10:ITEM',
                expect.any(Function),
                300,
            );
        });

        it('should return empty array when cache returns null', async () => {
            (cachingService.getOrSet as jest.Mock).mockResolvedValue(null);

            const result = await repository.getLatest(10, 0);

            expect(result).toEqual([]);
        });

        it('should handle null values in moment data correctly', async () => {
            const mockMomentsWithNulls = [
                {
                    id: 'moment4',
                    user_id: 'user1',
                    username: null,
                    image_url: null,
                    description: null,
                    reward_text: null,
                    ins_date_time: new Date('2024-01-01T10:00:00Z'),
                    moment_type: 'INVITE',
                },
            ];

            (cachingService.getOrSet as jest.Mock).mockResolvedValue({
                data: mockMomentsWithNulls,
                totalItems: 1,
            });

            const result = await repository.getLatest(10, 0);

            expect(result).toHaveLength(1);
            expect(result[0].username).toBeUndefined();
            expect(result[0].imageUrl).toBeUndefined();
            expect(result[0].description).toBe('Invited a friend'); // Default for INVITE type
            expect(result[0].rewardText).toBe('Earned points for inviting'); // Default for INVITE type
        });

        it('should call database when cache misses', async () => {
            // Mock database calls
            const mockDbData = [
                {
                    id: 'db_moment1',
                    user_id: 'user1',
                    username: 'dbuser1',
                    image_url: 'https://example.com/db1.jpg',
                    description: 'DB moment',
                    reward_text: 'DB reward',
                    ins_date_time: new Date('2024-01-01T10:00:00Z'),
                    moment_type: 'QUEST',
                },
            ];

            // Mock the caching service to call the actual function (simulating cache miss)
            (cachingService.getOrSet as jest.Mock).mockImplementation(
                async (_key: string, fetchFn: () => Promise<any>) => {
                    // Simulate calling the actual fetch function
                    return fetchFn();
                },
            );

            // Mock Prisma calls
            const mockFindMany = jest.fn().mockResolvedValue(mockDbData);
            const mockCount = jest.fn().mockResolvedValue(1);

            // Override prisma methods
            (prisma.moment_view as any) = {
                findMany: mockFindMany,
                count: mockCount,
            };

            const result = await repository.getLatest(10, 0, MomentType.QUEST);

            // Verify database was called with correct parameters
            expect(mockFindMany).toHaveBeenCalledWith({
                take: 10,
                skip: 0,
                orderBy: { ins_date_time: 'desc' },
                where: { moment_type: MomentType.QUEST },
            });

            expect(mockCount).toHaveBeenCalledWith({
                where: { moment_type: MomentType.QUEST },
            });

            // Verify results
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('db_moment1');
            expect(result[0].username).toBe('dbuser1');
        });

        it('should handle date serialization/deserialization correctly', async () => {
            const testDate = new Date('2024-01-01T10:00:00Z');
            const mockMoments = [
                {
                    id: 'moment_date_test',
                    user_id: 'user1',
                    username: 'testuser1',
                    image_url: null,
                    description: 'Date test',
                    reward_text: null,
                    ins_date_time: testDate,
                    moment_type: 'TRAVEL',
                },
            ];

            // Mock caching to simulate returning cached data with string dates
            (cachingService.getOrSet as jest.Mock).mockResolvedValue({
                data: [
                    {
                        ...mockMoments[0],
                        ins_date_time: testDate.toISOString(), // Simulate cached string date
                    },
                ],
                totalItems: 1,
            });

            const result = await repository.getLatest(10, 0);

            expect(result).toHaveLength(1);
            expect(result[0].insDateTime instanceof Date).toBe(true);
            expect(result[0].insDateTime.getTime()).toBe(testDate.getTime());
        });

        it('should generate different cache keys for different parameters', async () => {
            (cachingService.getOrSet as jest.Mock).mockResolvedValue({
                data: [],
                totalItems: 0,
            });

            // Test different parameter combinations
            await repository.getLatest(10, 0);
            await repository.getLatest(20, 10);
            await repository.getLatest(10, 0, MomentType.STORY);
            await repository.getLatest(5, 5, MomentType.QUEST);

            // Verify different cache keys were used
            expect(cachingService.getOrSet).toHaveBeenCalledTimes(4);
            expect(cachingService.getOrSet).toHaveBeenNthCalledWith(
                1,
                'moments:10:0:all',
                expect.any(Function),
                300,
            );
            expect(cachingService.getOrSet).toHaveBeenNthCalledWith(
                2,
                'moments:20:10:all',
                expect.any(Function),
                300,
            );
            expect(cachingService.getOrSet).toHaveBeenNthCalledWith(
                3,
                'moments:10:0:STORY',
                expect.any(Function),
                300,
            );
            expect(cachingService.getOrSet).toHaveBeenNthCalledWith(
                4,
                'moments:5:5:QUEST',
                expect.any(Function),
                300,
            );
        });
    });
});

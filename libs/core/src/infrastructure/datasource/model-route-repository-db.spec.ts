import { cleanDb } from '@app/core-test/prisma/clean-db';
import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Test, type TestingModule } from '@nestjs/testing';
import { ModelRouteRepositoryDb } from './model-route-repository-db';

describe('ModelRouteRepositoryDb', () => {
    let repository: ModelRouteRepositoryDb;
    let prisma: PrismaService;
    let caching: CachingService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ModelRouteRepositoryDb,
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

        repository = module.get(ModelRouteRepositoryDb);
        prisma = module.get(PrismaService);
        caching = module.get(CachingService);
        await prisma.$connect();
    });

    afterAll(async () => {
        await cleanDb();
    });

    it('createModelRoute stores data in the database and invalidates cache', async () => {
        const baseDate = new Date('2024-01-01T00:00:00.000Z');
        // A story is required for a model route due to foreign key constraints.
        const story = await prisma.story.create({
            data: {
                saga_name: 'Test Saga',
                saga_desc: 'A saga for testing',
                order: 1,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        const modelRoute = new ModelRouteEntity(
            {
                storyId: story.story_id,
                routeName: 'Route 1',
                insUserId: 'system',
                insDateTime: baseDate,
                updUserId: 'system',
                updDateTime: baseDate,
                touristSpotList: [],
            },
            undefined,
        );
        const created = await repository.createModelRoute(modelRoute);
        expect(created.modelRouteId).toBeDefined();

        // Verify the data was stored in the database.
        const found = await prisma.model_route.findUnique({
            where: { model_route_id: created.modelRouteId },
        });
        expect(found).not.toBeNull();
        expect(found?.route_name).toEqual('Route 1');

        // Verify the cache was invalidated.
        expect(caching.invalidate).toHaveBeenCalledWith(`model_route_raw:${created.modelRouteId}`);
        expect(caching.invalidate).toHaveBeenCalledWith('model_routes_all_list');
    });
});

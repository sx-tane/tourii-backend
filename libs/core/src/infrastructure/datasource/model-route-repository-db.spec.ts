import { cleanDb } from '@app/core-test/prisma/clean-db';
import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
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
                        getOrSet: jest.fn(async (_k: string, fn: () => Promise<any>) => fn()),
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

    it('updateModelRoute updates the route and clears cache', async () => {
        const baseDate = new Date('2024-01-01T00:00:00.000Z');

        const story = await prisma.story.create({
            data: {
                saga_name: 'Update Saga',
                saga_desc: 'Saga for update test',
                order: 1,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        const createdRoute = await prisma.model_route.create({
            data: {
                story_id: story.story_id,
                route_name: 'Old Name',
                recommendation: [],
                region: 'Old Region',
                region_latitude: 0,
                region_longitude: 0,
                ins_user_id: 'system',
                upd_user_id: 'system',
                ins_date_time: baseDate,
                upd_date_time: baseDate,
            },
        });

        const updateEntity = new ModelRouteEntity(
            {
                storyId: story.story_id,
                routeName: 'New Name',
                region: 'New Region',
                regionDesc: 'Updated',
                regionLatitude: 1,
                regionLongitude: 2,
                updUserId: 'tester',
                updDateTime: baseDate,
            },
            createdRoute.model_route_id,
        );

        const updated = await repository.updateModelRoute(updateEntity);
        expect(updated.routeName).toEqual('New Name');

        const found = await prisma.model_route.findUnique({
            where: { model_route_id: createdRoute.model_route_id },
        });
        expect(found?.route_name).toEqual('New Name');
        expect(found?.region_desc).toEqual('Updated');

        expect(caching.invalidate).toHaveBeenCalledWith(
            `model_route_raw:${createdRoute.model_route_id}`,
        );
        expect(caching.invalidate).toHaveBeenCalledWith('model_routes_all_list');
    });

    it('updateTouristSpot updates the spot and clears cache', async () => {
        const baseDate = new Date('2024-01-01T00:00:00.000Z');

        const story = await prisma.story.create({
            data: {
                saga_name: 'Spot Saga',
                saga_desc: 'Saga for spot test',
                order: 1,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        const route = await prisma.model_route.create({
            data: {
                story_id: story.story_id,
                route_name: 'Route Name',
                recommendation: [],
                region: 'R',
                region_latitude: 0,
                region_longitude: 0,
                ins_user_id: 'system',
                upd_user_id: 'system',
                ins_date_time: baseDate,
                upd_date_time: baseDate,
            },
        });

        const chapter = await prisma.story_chapter.create({
            data: {
                story_id: story.story_id,
                tourist_spot_id: 'spot1',
                story_chapter_id: 'chapter1',
                chapter_title: 'c',
                chapter_number: '1',
                chapter_desc: 'd',
                chapter_image: 'i',
                character_name_list: [],
                real_world_image: 'i',
                chapter_video_url: 'v',
                chapter_video_mobile_url: 'vm',
                chapter_pdf_url: 'p',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        const spot = await prisma.tourist_spot.create({
            data: {
                tourist_spot_id: 'spot1',
                model_route_id: route.model_route_id,
                story_chapter_id: chapter.story_chapter_id,
                tourist_spot_name: 'Old Spot',
                tourist_spot_desc: 'desc',
                latitude: 0,
                longitude: 0,
                tourist_spot_hashtag: [],
                ins_user_id: 'system',
                upd_user_id: 'system',
                ins_date_time: baseDate,
                upd_date_time: baseDate,
            },
        });

        const spotEntity = new TouristSpot({
            touristSpotId: spot.tourist_spot_id,
            storyChapterId: chapter.story_chapter_id,
            touristSpotName: 'New Spot',
            touristSpotDesc: 'new desc',
            latitude: 1,
            longitude: 1,
            updUserId: 'tester',
            updDateTime: baseDate,
        });

        const updatedSpot = await repository.updateTouristSpot(spotEntity);
        expect(updatedSpot.touristSpotName).toEqual('New Spot');

        const foundSpot = await prisma.tourist_spot.findUnique({
            where: { tourist_spot_id: spot.tourist_spot_id },
        });
        expect(foundSpot?.tourist_spot_name).toEqual('New Spot');

        expect(caching.invalidate).toHaveBeenCalledWith(`model_route_raw:${route.model_route_id}`);
        expect(caching.invalidate).toHaveBeenCalledWith('model_routes_all_list');
    });

    it('deleteModelRoute removes route and spots', async () => {
        const story = await prisma.story.create({
            data: {
                saga_name: 'DelRoute',
                saga_desc: 'd',
                order: 1,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        const route = await prisma.model_route.create({
            data: {
                model_route_id: 'delr',
                story_id: story.story_id,
                route_name: 'R',
                region: 'reg',
                region_latitude: 0,
                region_longitude: 0,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        await prisma.tourist_spot.create({
            data: {
                tourist_spot_id: 'delsp',
                model_route_id: route.model_route_id,
                story_chapter_id: 'c',
                tourist_spot_name: 'n',
                tourist_spot_desc: 'd',
                latitude: 0,
                longitude: 0,
                tourist_spot_hashtag: [],
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        await repository.deleteModelRoute(route.model_route_id);

        const foundRoute = await prisma.model_route.findUnique({
            where: { model_route_id: route.model_route_id },
        });
        const spots = await prisma.tourist_spot.findMany({
            where: { model_route_id: route.model_route_id },
        });
        expect(foundRoute).toBeNull();
        expect(spots.length).toBe(0);
    });

    it('deleteTouristSpot removes spot', async () => {
        const story = await prisma.story.create({
            data: {
                saga_name: 'DelSpot',
                saga_desc: 'd',
                order: 1,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        const route = await prisma.model_route.create({
            data: {
                model_route_id: 'delr2',
                story_id: story.story_id,
                route_name: 'R',
                region: 'reg',
                region_latitude: 0,
                region_longitude: 0,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });
        const spot = await prisma.tourist_spot.create({
            data: {
                tourist_spot_id: 'delsp2',
                model_route_id: route.model_route_id,
                story_chapter_id: 'c2',
                tourist_spot_name: 'n',
                tourist_spot_desc: 'd',
                latitude: 0,
                longitude: 0,
                tourist_spot_hashtag: [],
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        await repository.deleteTouristSpot(spot.tourist_spot_id);

        const found = await prisma.tourist_spot.findUnique({
            where: { tourist_spot_id: spot.tourist_spot_id },
        });
        expect(found).toBeNull();
    });

    it('retrieves tourist spots by story chapter id', async () => {
        const baseDate = new Date('2024-01-01T00:00:00.000Z');

        const story = await prisma.story.create({
            data: {
                saga_name: 'Saga',
                saga_desc: 'desc',
                order: 1,
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        const route = await prisma.model_route.create({
            data: {
                story_id: story.story_id,
                route_name: 'Route',
                recommendation: [],
                region: 'R',
                region_latitude: 0,
                region_longitude: 0,
                ins_user_id: 'system',
                upd_user_id: 'system',
                ins_date_time: baseDate,
                upd_date_time: baseDate,
            },
        });

        const chapter = await prisma.story_chapter.create({
            data: {
                story_id: story.story_id,
                tourist_spot_id: 'spot1',
                story_chapter_id: 'chapter1',
                chapter_title: 'c',
                chapter_number: '1',
                chapter_desc: 'd',
                chapter_image: 'i',
                character_name_list: [],
                real_world_image: 'i',
                chapter_video_url: 'v',
                chapter_video_mobile_url: 'vm',
                chapter_pdf_url: 'p',
                ins_user_id: 'system',
                upd_user_id: 'system',
            },
        });

        await prisma.tourist_spot.create({
            data: {
                tourist_spot_id: 'spot1',
                model_route_id: route.model_route_id,
                story_chapter_id: chapter.story_chapter_id,
                tourist_spot_name: 'Spot 1',
                tourist_spot_desc: 'desc',
                latitude: 0,
                longitude: 0,
                tourist_spot_hashtag: [],
                ins_user_id: 'system',
                upd_user_id: 'system',
                ins_date_time: baseDate,
                upd_date_time: baseDate,
            },
        });

        await prisma.tourist_spot.create({
            data: {
                tourist_spot_id: 'spot2',
                model_route_id: route.model_route_id,
                story_chapter_id: chapter.story_chapter_id,
                tourist_spot_name: 'Spot 2',
                tourist_spot_desc: 'desc',
                latitude: 1,
                longitude: 1,
                tourist_spot_hashtag: [],
                ins_user_id: 'system',
                upd_user_id: 'system',
                ins_date_time: baseDate,
                upd_date_time: baseDate,
            },
        });

        const spots = await repository.getTouristSpotsByStoryChapterId(chapter.story_chapter_id);

        expect(spots).toHaveLength(2);
        const names = spots.map((s) => s.touristSpotName).sort();
        expect(names).toEqual(['Spot 1', 'Spot 2']);
    });
});

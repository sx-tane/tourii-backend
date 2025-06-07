import { ModelRouteRepositoryDb } from './model-route-repository-db';
import type { PrismaService } from '@app/core/provider/prisma.service';
import type { CachingService } from '@app/core/provider/caching.service';
import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';

describe('ModelRouteRepositoryDb', () => {
  it('createModelRoute stores data and invalidates cache', async () => {
    const baseDate = new Date('2024-01-01T00:00:00.000Z');
    const prisma = {
      model_route: {
        create: jest.fn().mockResolvedValue({
          model_route_id: 'route1',
          story_id: 'story1',
          route_name: 'Route 1',
          region: 'Region',
          region_desc: null,
          region_latitude: 0,
          region_longitude: 0,
          region_background_media: null,
          recommendation: [],
          del_flag: false,
          ins_user_id: 'system',
          ins_date_time: baseDate,
          upd_user_id: 'system',
          upd_date_time: baseDate,
          request_id: null,
          tourist_spot: [],
        }),
      },
    } as unknown as PrismaService;
    const caching = { invalidate: jest.fn() } as unknown as CachingService;
    const repository = new ModelRouteRepositoryDb(prisma, caching);
    const modelRoute = new ModelRouteEntity(
      {
        storyId: 'story1',
        routeName: 'Route 1',
        insUserId: 'system',
        insDateTime: baseDate,
        updUserId: 'system',
        updDateTime: baseDate,
        touristSpotList: [],
      },
      'route1',
    );
    const created = await repository.createModelRoute(modelRoute);
    expect(created.modelRouteId).toEqual('route1');
    expect(prisma.model_route.create).toHaveBeenCalled();
    expect(caching.invalidate).toHaveBeenCalledWith('model_route_raw:route1');
    expect(caching.invalidate).toHaveBeenCalledWith('model_routes_all_list');
  });
});

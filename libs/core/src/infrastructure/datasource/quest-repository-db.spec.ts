import { QuestRepositoryDb } from './quest-repository-db';
import type { PrismaService } from '@app/core/provider/prisma.service';
import type { CachingService } from '@app/core/provider/caching.service';

describe('QuestRepositoryDb', () => {
  it('fetchQuestById maps result from prisma', async () => {
    const baseDate = new Date('2024-01-01T00:00:00.000Z');
    const prisma = {
      quest: {
        findUnique: jest.fn().mockResolvedValue({
          quest_id: 'quest1',
          tourist_spot_id: 'spot1',
          quest_name: 'Quest Name',
          quest_desc: 'Quest description',
          quest_type: 'TRAVEL_TO_EARN',
          quest_image: null,
          is_unlocked: true,
          is_premium: false,
          total_magatama_point_awarded: 10,
          reward_type: 'LOCAL_EXPERIENCES',
          del_flag: false,
          ins_user_id: 'system',
          ins_date_time: baseDate,
          upd_user_id: 'system',
          upd_date_time: baseDate,
          request_id: null,
          quest_task: [],
        }),
      },
    } as unknown as PrismaService;
    const caching = {} as CachingService;
    const repository = new QuestRepositoryDb(prisma, caching);
    const quest = await repository.fetchQuestById('quest1');
    expect(quest.questId).toEqual('quest1');
    expect(prisma.quest.findUnique).toHaveBeenCalledWith({
      where: { quest_id: 'quest1' },
      include: { quest_task: true },
    });
  });
});

import { StoryRepositoryDb } from './story-repository-db';
import type { PrismaService } from '@app/core/provider/prisma.service';
import type { CachingService } from '@app/core/provider/caching.service';
import { StoryEntity } from '@app/core/domain/game/story/story.entity';

describe('StoryRepositoryDb', () => {
  it('createStory stores data and invalidates cache', async () => {
    const baseDate = new Date('2024-01-01T00:00:00.000Z');
    const prisma = {
      story: {
        create: jest.fn().mockResolvedValue({
          story_id: 'story1',
          saga_name: 'Saga',
          saga_desc: 'desc',
          background_media: null,
          map_image: null,
          location: null,
          order: 1,
          is_prologue: true,
          is_selected: false,
          del_flag: false,
          ins_user_id: 'system',
          ins_date_time: baseDate,
          upd_user_id: 'system',
          upd_date_time: baseDate,
          request_id: null,
          story_chapter: [],
        }),
      },
    } as unknown as PrismaService;
    const caching = { invalidate: jest.fn() } as unknown as CachingService;
    const repository = new StoryRepositoryDb(prisma, caching);
    const story = new StoryEntity(
      {
        sagaName: 'Saga',
        sagaDesc: 'desc',
        isPrologue: true,
        isSelected: false,
        insUserId: 'system',
        insDateTime: baseDate,
        updUserId: 'system',
        updDateTime: baseDate,
      },
      'story1',
    );
    const created = await repository.createStory(story);
    expect(created.storyId).toEqual('story1');
    expect(prisma.story.create).toHaveBeenCalled();
    expect(caching.invalidate).toHaveBeenCalledWith('stories:all');
  });
});

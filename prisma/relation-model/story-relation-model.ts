import { Prisma } from '@prisma/client';

export type StoryRelationModel = Prisma.storyGetPayload<{
    include: {
        story_chapter: true;
    };
}>;

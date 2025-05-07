import { Prisma } from '@prisma/client';

const StoryRelationModel = Prisma.validator<Prisma.storyDefaultArgs>()({
    include: {
        story_chapter: true,
    },
});

export type StoryRelationModel = Prisma.storyGetPayload<typeof StoryRelationModel>;

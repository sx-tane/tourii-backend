import { Prisma } from '@prisma/client';

const storyInclude = Prisma.validator<Prisma.storyInclude>()({
    story_chapter: true,
});

export type StoryRelationModel = Prisma.storyGetPayload<{
    include: typeof storyInclude;
}>;

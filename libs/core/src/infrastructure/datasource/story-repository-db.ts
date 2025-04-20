// biome-ignore lint/style/useImportType: <explanation>
import { StoryEntity } from "@app/core/domain/game/story/story.entity";
import type { StoryRepository } from "@app/core/domain/game/story/story.repository";
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from "@app/core/provider/prisma.service";
import { Injectable } from "@nestjs/common";
import { StoryMapper } from "../mapper/story.mapper";

@Injectable()
export class StoryRepositoryDb implements StoryRepository {
	constructor(private prisma: PrismaService) {}

	async createStory(story: StoryEntity): Promise<StoryEntity> {
		const createdStory = await this.prisma.story.create({
			data: StoryMapper.storyEntityToPrismaInput(story),
			include: {
				story_chapter: true,
			},
		});
		return StoryMapper.prismaModelToStoryEntity(createdStory);
	}

	async getStories(): Promise<StoryEntity[]> {
		const stories = await this.prisma.story.findMany({
			include: {
				story_chapter: true,
			},
		});

		return stories.map((story) => StoryMapper.prismaModelToStoryEntity(story));
	}
}

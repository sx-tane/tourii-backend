import { StoryChapter } from "./chapter-story";
import type { StoryEntity } from "./story.entity";

export interface StoryRepository {
	/**
	 * Create story
	 * @param story
	 * @returns StoryEntity
	 */
	createStory(story: StoryEntity): Promise<StoryEntity>;

	/**
	 * Get stories
	 * @returns StoryEntity[]
	 */
	getStories(): Promise<StoryEntity[]>;

	/**
	 * Get story chapters
	 * @param storyId
	 * @returns StoryChapter[]
	 */
	getStoryChapters(storyId: string): Promise<StoryChapter[]>;
}

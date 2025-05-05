import type { StoryEntity } from "./story.entity";
import type { StoryChapter } from "./chapter-story";

export interface StoryRepository {
	/**
	 * Create story
	 * @param story
	 * @returns StoryEntity
	 */
	createStory(story: StoryEntity): Promise<StoryEntity>;

	/**
	 * Create story chapter
	 * @param storyId
	 * @param chapter
	 * @returns StoryChapterEntity
	 */
	createStoryChapter(
		storyId: string,
		chapter: StoryChapter,
	): Promise<StoryChapter>;

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

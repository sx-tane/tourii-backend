import type { StoryChapter } from './chapter-story';
import type { StoryEntity } from './story.entity';
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
    createStoryChapter(storyId: string, chapter: StoryChapter): Promise<StoryChapter>;

    /**
     * Update tourist spot id list in story chapter
     * @param pairs Array of chapter ID and tourist spot ID pairs
     * @returns boolean
     */
    updateTouristSpotIdListInStoryChapter(
        pairs: {
            storyChapterId: string;
            touristSpotId: string;
        }[],
    ): Promise<boolean>;

    /**
     * Get stories
     * @returns StoryEntity[]
     */
    getStories(): Promise<StoryEntity[] | undefined>;

    /**
     * Get story chapters
     * @param storyId
     * @returns StoryChapter[]
     */
    getStoryChaptersByStoryId(storyId: string): Promise<StoryChapter[]>;

    /**
     * Get story by id
     * @param storyId
     * @returns StoryEntity
     */
    getStoryById(storyId: string): Promise<StoryEntity>;
}

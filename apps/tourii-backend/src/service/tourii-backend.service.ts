import type { StoryRepository } from '@app/core/domain/game/story/story.repository';
import type { UserEntity } from '@app/core/domain/user/user.entity';
import type { UserRepository } from '@app/core/domain/user/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import type { StoryCreateRequestDto } from '../controller/model/tourii-request/create/story-create-request.model';
import type { StoryResponseDto } from '../controller/model/tourii-response/story-response.model';
import { TouriiBackendConstants } from '../tourii-backend.constant';
import { StoryCreateRequestBuilder } from './builder/story-create-request-builder';
import { StoryResultBuilder } from './builder/story-result-builder';
import type { StoryChapterResponseDto } from '../controller/model/tourii-response/chapter-story-response.model';

@Injectable()
export class TouriiBackendService {
  constructor(
    @Inject(TouriiBackendConstants.USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(TouriiBackendConstants.STORY_REPOSITORY_TOKEN)
    private readonly storyRepository: StoryRepository,
  ) {}

  /*
   * This method is used to get a user by their username.
   * @param username The username of the user.
   * @returns The user with the given username.
   */

  async createStory(saga: StoryCreateRequestDto): Promise<StoryResponseDto> {
    const storySaga = StoryCreateRequestBuilder.dtoToStory(saga, 'admin');
    const storySagaEntity = await this.storyRepository.createStory(storySaga);
    return StoryResultBuilder.storyToDto(storySagaEntity);
  }

  async createStoryChapter(storyId: string, chapter: StoryChapterCreateRequestDto): Promise<StoryChapterResponseDto> {
    const storyChapterEntity = await this.storyRepository.createStoryChapter(storyId, chapter);
    return StoryResultBuilder.storyChapterToDto(storyChapterEntity, storyId);
  }

  async getStories(): Promise<StoryResponseDto[]> {
    const storySagaEntity = await this.storyRepository.getStories();
    return storySagaEntity.map((story) => StoryResultBuilder.storyToDto(story));
  }

  async getStoryChapters(storyId: string): Promise<StoryChapterResponseDto[]> {
    const storyChapterEntity = await this.storyRepository.getStoryChapters(storyId);
    return storyChapterEntity.map((storyChapter) => StoryResultBuilder.storyChapterToDto(storyChapter, storyId));
  }

  async createUser(user: UserEntity) {
    // service logic
    // dto -> entity
    return this.userRepository.createUser(user);
  }

  async getUserByUserId(userId: string) {
    return this.userRepository.getUserInfoByUserId(userId);
  }
}

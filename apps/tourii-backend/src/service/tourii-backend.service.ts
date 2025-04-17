import type { UserRepository } from '@app/core/domain/user/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { TouriiBackendConstants } from '../tourii-backend.constant';
import type { UserEntity } from '@app/core/domain/user/user.entity';
import type { StorySagaCreateRequestDto } from '../controller/model/tourii-request/create/story-saga-request.model';
import type { StorySagaResponseDto } from '../controller/model/tourii-response/story-saga-response.model';
import { ContextStorage } from '@app/core/support/context/context-storage';

@Injectable()
export class TouriiBackendService {
  constructor(
    @Inject(TouriiBackendConstants.USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  /*
   * This method is used to get a user by their username.
   * @param username The username of the user.
   * @returns The user with the given username.
   */

  async createStorySaga(saga: StorySagaCreateRequestDto): Promise<StorySagaResponseDto> {


    // TODO: Implement story saga creation
    return {
      sagaId: '1',
      sagaName: saga.sagaName,
      sagaDesc: saga.sagaDesc,
      backgroundMedia: saga.backgroundMedia || '',
      mapImage: saga.mapImage || '',
      location: saga.location || '',
      order: saga.order || 0,
      isPrologue: saga.isPrologue || false,
      isSelected: saga.isSelected || false,
      chapterList: [],
      insUserId: 'system',
      insDateTime: ContextStorage.getStore()?.getSystemDateTimeJST().toISOString() ?? '',
      updUserId: 'system',
      updDateTime: ContextStorage.getStore()?.getSystemDateTimeJST().toISOString() ?? '',
    };
  }

  async getStorySagas(): Promise<StorySagaResponseDto> {
    // TODO: Implement fetching all sagas
    const now = new Date().toISOString();
    return {
      sagaId: '1',
      sagaName: 'Test Saga',
      sagaDesc: 'Test Description',
      backgroundMedia: 'https://example.com/background.jpg',
      mapImage: 'https://example.com/map.jpg',
      location: 'Tokyo',
      order: 1,
      isPrologue: false,
      isSelected: true,
      chapterList: [],
      insUserId: 'system',
      insDateTime: ContextStorage.getStore()?.getSystemDateTimeJST().toISOString() ?? '',
      updUserId: 'system',
      updDateTime: ContextStorage.getStore()?.getSystemDateTimeJST().toISOString() ?? '',
    };
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

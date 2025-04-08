import { UserRepository } from '@app/core/domain/user/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { TouriiBackendConstants } from '../tourii-backend.constant';
import { UserEntity } from '@app/core/domain/user/user.entity';

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

  async createUser(user: UserEntity) {
    // service logic
    // dto -> entity
    return this.userRepository.createUser(user);
  }

  async getUserByUserId(userId: string) {
    return this.userRepository.getUserInfoByUserId(userId);
  }
}

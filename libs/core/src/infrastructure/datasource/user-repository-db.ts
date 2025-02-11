import type { UserEntity } from '@app/core/domain/user/user.entity';
import type { UserRepository } from '@app/core/domain/user/user.repository';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class UserRepositoryDb implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async getUserInfoByUsername(
    username: string,
  ): Promise<UserEntity | undefined> {
    const user = await this.prisma.users.findFirst({
      where: {
        discord_username: username,
      },
    });

    return user ? UserMapper.prismaModelToUserEntity(user) : undefined;
  }
}

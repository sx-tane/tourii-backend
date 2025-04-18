import type { UserEntity } from '@app/core/domain/user/user.entity';
import type { UserRepository } from '@app/core/domain/user/user.repository';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class UserRepositoryDb implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(user: UserEntity): Promise<UserEntity> {
    const createdUser = await this.prisma.user.create({
      data: UserMapper.userEntityToPrismaInput(user),
    });

    return UserMapper.prismaModelToUserEntity(createdUser);
  }

  async getUserInfoByUserId(userId: string): Promise<UserEntity | undefined> {
    const user = await this.prisma.user.findFirst({
      where: {
        user_id: userId,
      },
    });

    return user ? UserMapper.prismaModelToUserEntity(user) : undefined;
  }
}

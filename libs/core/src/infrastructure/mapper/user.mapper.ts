import { UserEntity } from '@app/core/domain/user/user.entity';
import type { user, UserRoleType } from '@prisma/client';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserMapper {
  static userEntityToPrismaInput(userEntity: UserEntity): user {
    return {
      user_id: userEntity.userId,
      username: userEntity.username,
      discord_id: userEntity.discordId ?? null,
      discord_username: userEntity.discordUsername ?? null,
      twitter_id: userEntity.twitterId ?? null,
      twitter_username: userEntity.twitterUsername ?? null,
      google_email: userEntity.googleEmail ?? null,
      email: userEntity.email ?? null,
      password: userEntity.password,
      passport_wallet_address: userEntity.passportWalletAddress ?? null,
      perks_wallet_address: userEntity.perksWalletAddress,
      latest_ip_address: userEntity.latestIpAddress ?? null,
      is_premium: userEntity.isPremium,
      total_quest_completed: userEntity.totalQuestCompleted,
      total_travel_distance: userEntity.totalTravelDistance,
      role: userEntity.role as UserRoleType,
      registered_at: userEntity.registeredAt,
      discord_joined_at: userEntity.discordJoinedAt,
      is_banned: userEntity.isBanned,
      del_flag: userEntity.delFlag,
      ins_user_id: userEntity.insUserId,
      ins_date_time: userEntity.insDateTime,
      upd_user_id: userEntity.updUserId,
      upd_date_time: userEntity.updDateTime,
      request_id: userEntity.requestId ?? null,
    };
  }

  static prismaModelToUserEntity(prismaModel: user): UserEntity {
    return new UserEntity(
      {
        userId: prismaModel.user_id,
        username: prismaModel.username,
        discordId: prismaModel.discord_id ?? undefined,
        discordUsername: prismaModel.discord_username ?? undefined,
        twitterId: prismaModel.twitter_id ?? undefined,
        twitterUsername: prismaModel.twitter_username ?? undefined,
        googleEmail: prismaModel.google_email ?? undefined,
        email: prismaModel.email ?? undefined,
        password: prismaModel.password,
        passportWalletAddress: prismaModel.passport_wallet_address ?? undefined,
        perksWalletAddress: prismaModel.perks_wallet_address,
        latestIpAddress: prismaModel.latest_ip_address ?? undefined,
        isPremium: prismaModel.is_premium,
        totalQuestCompleted: prismaModel.total_quest_completed,
        totalTravelDistance: prismaModel.total_travel_distance,
        role: prismaModel.role,
        registeredAt: prismaModel.registered_at,
        discordJoinedAt: prismaModel.discord_joined_at,
        isBanned: prismaModel.is_banned,
        delFlag: prismaModel.del_flag,
        insUserId: prismaModel.ins_user_id,
        insDateTime: prismaModel.ins_date_time,
        updUserId: prismaModel.upd_user_id,
        updDateTime: prismaModel.upd_date_time,
        requestId: prismaModel.request_id ?? undefined,
      },
      prismaModel.user_id,
    );
  }
}

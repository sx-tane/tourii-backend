import { UserEntity } from "@app/core/domain/user/user.entity";
import type { users } from "@prisma/client";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserMapper{
    static prismaModelToUserEntity(prismaModel: users): UserEntity {
        return new UserEntity({
            discordId: Number(prismaModel.discord_id) ?? 0,
            userName: prismaModel.username,
            discordHandle: prismaModel.discord_handle,
            magatamaPoints: prismaModel.magatama_points ?? 0,
            magatamaBag: prismaModel.magatama_bag ?? 0,
            prayerBead: prismaModel.prayer_bead ?? 0,
            sword: prismaModel.sword ?? 0,
            orgeMask: prismaModel.orge_mask ?? 0,
            sprintShard: prismaModel.sprint_shard ?? 0,
            gachaponShard: prismaModel.gachapon_shard ?? 0,
            gachaponTicket: prismaModel.gachapon_ticket ?? 0,
            touriiOmamori: prismaModel.tourii_omamori ?? 0,
            multiplier1hr: prismaModel.multiplier_1hr ?? 0,
            multiplier3hr: prismaModel.multiplier_3hr ?? 0,
            insDateTime: prismaModel.ins_date_time ?? new Date(),
        }, prismaModel.user_id.toString());
    }
}
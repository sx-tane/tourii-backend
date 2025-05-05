import { QuestEntity } from "@app/core/domain/game/quest/quest.entity";
import type { quest } from "@prisma/client";

// biome-ignore lint/complexity/noStaticOnlyClass: Mapper class is a common pattern for grouping static mapping functions
export class QuestMapper {
	static prismaModelToQuestEntity(
		prismaModel: quest
	): QuestEntity {
		return new QuestEntity(
			{
				touristSpotId: prismaModel.tourist_spot_id ?? undefined,
				questName: prismaModel.quest_name,
				questDesc: prismaModel.quest_desc,
				questType: prismaModel.quest_type,
				questImage: prismaModel.quest_image ?? undefined,
				isUnlocked: prismaModel.is_unlocked,
				isPremium: prismaModel.is_premium,
				totalMagatamaPointAwarded:
					prismaModel.total_magatama_point_awarded ?? 0,
				rewardType: prismaModel.reward_type,
				delFlag: prismaModel.del_flag ?? false,
				insUserId: prismaModel.ins_user_id,
				insDateTime: prismaModel.ins_date_time,
				updUserId: prismaModel.upd_user_id,
				updDateTime: prismaModel.upd_date_time,
				requestId: prismaModel.request_id ?? undefined,
			},
			prismaModel.quest_id
		);
	}
}

import type { moment_view } from '@prisma/client';
import { MomentEntity } from '../../domain/feed/moment.entity';
import type { MomentType } from '../../domain/feed/moment-type';

export class MomentMapper {
    static prismaModelToMomentEntity(model: moment_view): MomentEntity {
        return new MomentEntity({
            userId: model.user_id,
            username: model.username ?? undefined,
            imageUrl: model.image_url ?? undefined,
            description: model.description ?? undefined,
            rewardText: model.reward_text ?? undefined,
            insDateTime: model.ins_date_time,
            momentType: model.moment_type as MomentType,
        });
    }
}

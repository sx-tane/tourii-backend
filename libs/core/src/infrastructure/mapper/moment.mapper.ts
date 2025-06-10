import type { moment_view } from '@prisma/client';
import { MomentEntity } from '../../domain/feed/moment.entity';

export class MomentMapper {
    static prismaModelToMomentEntity(model: moment_view): MomentEntity {
        return MomentEntity.fromViewData({
            id: model.id,
            userId: model.user_id,
            username: model.username,
            imageUrl: model.image_url,
            description: model.description,
            rewardText: model.reward_text,
            insDateTime: model.ins_date_time,
            momentType: model.moment_type,
        });
    }
}

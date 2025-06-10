import type { MomentEntity } from './moment.entity';

export interface MomentRepository {
    getLatest(limit: number, offset: number): Promise<MomentEntity[]>;
}

import { MomentType } from './moment-type';
import type { MomentEntity } from './moment.entity';

export interface MomentRepository {
    /**
     * Get the latest moments
     * @param limit - The number of moments to get
     * @param offset - The offset of the moments to get
     * @param momentType - The type of moment to get (optional)
     * @returns The latest moments
     */
    getLatest(limit: number, offset: number, momentType?: MomentType): Promise<MomentEntity[]>;
}

import { MomentType } from '@app/core/domain/feed/moment-type';
import type { MomentEntity } from '@app/core/domain/feed/moment.entity';
import type { MomentRepository } from '@app/core/domain/feed/moment.repository';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Injectable } from '@nestjs/common';
import { MomentMapper } from '../mapper/moment.mapper';

@Injectable()
export class MomentRepositoryDb implements MomentRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getLatest(
        limit: number,
        offset: number,
        momentType?: MomentType,
    ): Promise<MomentEntity[]> {
        const data = await this.prisma.moment_view.findMany({
            take: limit,
            skip: offset,
            orderBy: { ins_date_time: 'desc' },
            where: { moment_type: momentType },
        });
        return data.map(MomentMapper.prismaModelToMomentEntity);
    }
}

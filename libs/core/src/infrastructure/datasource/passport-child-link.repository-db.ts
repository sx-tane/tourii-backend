import { PassportChildType, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/core/provider/prisma.service';
import { PassportChildLinkRepository } from '@app/core/domain/onchain/passport-child-link.repository';

@Injectable()
export class PassportChildLinkRepositoryDb implements PassportChildLinkRepository {
    constructor(private prisma: PrismaService) {}

    async findLinksByPassportTokenId(passportTokenId: string) {
        return this.prisma.passport_child_link.findMany({
            where: { passport_token_id: passportTokenId },
            select: {
                child_token_id: true,
                child_type: true,
            },
        });
    }
}

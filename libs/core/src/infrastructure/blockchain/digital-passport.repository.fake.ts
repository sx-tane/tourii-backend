import { DigitalPassportRepository } from '@app/core/domain/passport/digital-passport.repository';
import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class DigitalPassportRepositoryFake implements DigitalPassportRepository {
    private readonly logger = new Logger(DigitalPassportRepositoryFake.name);
    async mint(to: string): Promise<{ tokenId: string; txHash: string }> {
        // In a real implementation this would send a transaction to the
        // blockchain. Here we simply log and return a fake token.
        const tokenId = randomUUID();
        const txHash = randomUUID();
        this.logger.log(`Minted digital passport to ${to} token ${tokenId}`);
        return { tokenId, txHash };
    }
}

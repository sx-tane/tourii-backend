import { DigitalPassportRepository } from '@app/core/domain/passport/digital-passport.repository';
import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class DigitalPassportRepositoryFake implements DigitalPassportRepository {
    private readonly logger = new Logger(DigitalPassportRepositoryFake.name);
    private nextId = 0;
    async mint(to: string, metadataUrl: string): Promise<{ tokenId: string; txHash: string }> {
        // In a real implementation this would send a transaction to the
        // blockchain. Here we simply log and return a fake token.
        const tokenId = (this.nextId++).toString();
        const txHash = randomUUID();
        this.logger.log(
            `Minted digital passport to ${to} token ${tokenId} with metadata ${metadataUrl}`,
        );
        return { tokenId, txHash };
    }

    async getNextTokenId(): Promise<string> {
        return this.nextId.toString();
    }
}

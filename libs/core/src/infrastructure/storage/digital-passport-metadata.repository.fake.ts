import { DigitalPassportMetadataRepository } from '@app/core/domain/passport/digital-passport-metadata.repository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DigitalPassportMetadataRepositoryFake implements DigitalPassportMetadataRepository {
    private readonly logger = new Logger(DigitalPassportMetadataRepositoryFake.name);
    async uploadMetadata(passportId: string, _metadata: unknown): Promise<string> {
        const url = `https://fake.example.com/metadata/${passportId}.json`;
        this.logger.log(`Fake upload for passport ${passportId} to ${url}`);
        return url;
    }
}

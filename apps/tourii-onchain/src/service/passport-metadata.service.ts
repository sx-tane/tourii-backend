import { DigitalPassportMetadata } from '@app/core/domain/passport/digital-passport-metadata';
import { PassportMetadataRepository } from '@app/core/domain/passport/passport-metadata.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { TouriiOnchainAppErrorType } from '../support/exception/tourii-onchain-app-error-type';
import { TouriiOnchainAppException } from '../support/exception/tourii-onchain-app-exception';
import { TouriiOnchainConstants } from '../tourii-onchain.constant';

@Injectable()
export class PassportMetadataService {
    private readonly logger = new Logger(PassportMetadataService.name);

    constructor(
        @Inject(TouriiOnchainConstants.PASSPORT_METADATA_REPOSITORY_TOKEN)
        private readonly passportMetadataRepository: PassportMetadataRepository,
    ) {}

    async getMetadata(tokenId: string): Promise<DigitalPassportMetadata> {
        try {
            this.logger.log(`Generating metadata for passport token ID: ${tokenId}`);

            const metadata = await this.passportMetadataRepository.generateMetadata(tokenId);

            this.logger.log(`Successfully generated metadata for passport token ID: ${tokenId}`);
            return metadata;
        } catch (error) {
            this.logger.error(`Failed to generate metadata for token ID ${tokenId}:`, error);

            if (error instanceof TouriiOnchainAppException) {
                const apiAppError = error.getResponse() as { code: string };
                if (apiAppError.code === TouriiOnchainAppErrorType.E_OC_001.code) {
                    throw new TouriiOnchainAppException(TouriiOnchainAppErrorType.E_OC_001);
                }
            }

            throw error;
        }
    }

    async updateMetadata(tokenId: string): Promise<string> {
        try {
            this.logger.log(`Updating metadata for passport token ID: ${tokenId}`);

            const metadataUrl = await this.passportMetadataRepository.updateMetadata(tokenId);

            this.logger.log(
                `Successfully updated metadata for passport token ID: ${tokenId} at ${metadataUrl}`,
            );
            return metadataUrl;
        } catch (error) {
            this.logger.error(`Failed to update metadata for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    getMetadataUrl(tokenId: string): string {
        return this.passportMetadataRepository.getMetadataUrl(tokenId);
    }
}

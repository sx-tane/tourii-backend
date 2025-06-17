import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PassportMetadataRepository } from '@app/core/domain/passport/passport-metadata.repository';
import { DigitalPassportMetadata } from '@app/core/domain/passport/digital-passport-metadata';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';

@Injectable()
export class PassportMetadataService {
    private readonly logger = new Logger(PassportMetadataService.name);

    constructor(private readonly passportMetadataRepository: PassportMetadataRepository) {}

    async getMetadata(tokenId: string): Promise<DigitalPassportMetadata> {
        try {
            this.logger.log(`Generating metadata for passport token ID: ${tokenId}`);
            
            const metadata = await this.passportMetadataRepository.generateMetadata(tokenId);
            
            this.logger.log(`Successfully generated metadata for passport token ID: ${tokenId}`);
            return metadata;
        } catch (error) {
            this.logger.error(`Failed to generate metadata for token ID ${tokenId}:`, error);
            
            if (error instanceof TouriiBackendAppException) {
                if (error.errorType === TouriiBackendAppErrorType.RESOURCE_NOT_FOUND) {
                    throw new NotFoundException(`Digital Passport with token ID ${tokenId} not found`);
                }
            }
            
            throw error;
        }
    }

    async updateMetadata(tokenId: string): Promise<string> {
        try {
            this.logger.log(`Updating metadata for passport token ID: ${tokenId}`);
            
            const metadataUrl = await this.passportMetadataRepository.updateMetadata(tokenId);
            
            this.logger.log(`Successfully updated metadata for passport token ID: ${tokenId} at ${metadataUrl}`);
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
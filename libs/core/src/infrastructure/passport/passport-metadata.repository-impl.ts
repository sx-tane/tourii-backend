import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportMetadataRepository } from '@app/core/domain/passport/passport-metadata.repository';
import { DigitalPassportMetadata, DigitalPassportMetadataBuilder, PassportMetadataInput } from '@app/core/domain/passport/digital-passport-metadata';
import { R2StorageRepository } from '@app/core/domain/storage/r2-storage.repository';
import { UserRepository } from '@app/core/domain/user/user.repository';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';

@Injectable()
export class PassportMetadataRepositoryImpl implements PassportMetadataRepository {
    private readonly logger = new Logger(PassportMetadataRepositoryImpl.name);

    constructor(
        private readonly r2Storage: R2StorageRepository,
        private readonly userRepository: UserRepository,
        private readonly config: ConfigService,
    ) {}

    async generateMetadata(tokenId: string): Promise<DigitalPassportMetadata> {
        try {
            // Find user by passport token ID
            const user = await this.userRepository.findByPassportTokenId(tokenId);
            
            if (!user || !user.userInfo) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.RESOURCE_NOT_FOUND,
                    `User with passport token ID ${tokenId} not found`
                );
            }

            const userInfo = user.userInfo;
            
            // Build metadata input
            const metadataInput: PassportMetadataInput = {
                tokenId,
                ownerAddress: user.passportWalletAddress || '',
                username: user.username,
                passportType: userInfo.userDigitalPassportType || 'BONJIN',
                level: userInfo.level || 'BONJIN',
                totalQuestCompleted: userInfo.totalQuestCompleted,
                totalTravelDistance: userInfo.totalTravelDistance,
                magatamaPoints: userInfo.magatamaPoints,
                isPremium: userInfo.isPremium,
                registeredAt: user.registeredAt,
                prayerBead: userInfo.prayerBead,
                sword: userInfo.sword,
                orgeMask: userInfo.orgeMask,
            };

            // Generate metadata
            const metadata = DigitalPassportMetadataBuilder.build(metadataInput);
            
            this.logger.log(`Generated metadata for passport token ID ${tokenId}`);
            return metadata;
        } catch (error) {
            this.logger.error(`Failed to generate metadata for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async updateMetadata(tokenId: string): Promise<string> {
        try {
            // Generate fresh metadata
            const metadata = await this.generateMetadata(tokenId);
            
            // Upload to R2 storage
            const key = `metadata/${tokenId}.json`;
            const metadataUrl = await this.r2Storage.uploadMetadata(metadata, key);
            
            this.logger.log(`Updated metadata for passport token ID ${tokenId}: ${metadataUrl}`);
            return metadataUrl;
        } catch (error) {
            this.logger.error(`Failed to update metadata for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    getMetadataUrl(tokenId: string): string {
        const key = `metadata/${tokenId}.json`;
        return this.r2Storage.generatePublicUrl(key);
    }
}
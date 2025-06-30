import {
    DigitalPassportMetadata,
    DigitalPassportMetadataBuilder,
    PassportMetadataInput,
} from '@app/core/domain/passport/digital-passport-metadata';
import { PassportMetadataRepository } from '@app/core/domain/passport/passport-metadata.repository';
import { R2StorageRepository } from '@app/core/domain/storage/r2-storage.repository';
import { UserRepository } from '@app/core/domain/user/user.repository';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { TouriiOnchainConstants } from '@app/tourii-onchain/tourii-onchain.constant';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PassportMetadataRepositoryImpl implements PassportMetadataRepository {
    private readonly logger = new Logger(PassportMetadataRepositoryImpl.name);

    constructor(
        @Inject(TouriiOnchainConstants.R2_STORAGE_REPOSITORY_TOKEN)
        private readonly r2Storage: R2StorageRepository,
        @Inject(TouriiOnchainConstants.USER_REPOSITORY_TOKEN)
        private readonly userRepository: UserRepository,
        private readonly config: ConfigService,
    ) {}

    async generateMetadata(tokenId: string): Promise<DigitalPassportMetadata> {
        try {
            // Check if this is a mock token ID
            if (this.isMockTokenId(tokenId)) {
                return this.getMockMetadata(tokenId);
            }

            // Find user by passport token ID
            const user = await this.userRepository.findByPassportTokenId(tokenId);

            if (!user || !user.userInfo) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
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

    /**
     * Check if token ID is a mock/test token
     */
    private isMockTokenId(tokenId: string): boolean {
        const mockTokenIds = [
            '123',
            '456',
            '789',
            'test-user-1',
            'test-user-2',
            'test-user-3',
            'alice',
            'bob',
            'charlie',
        ];
        return mockTokenIds.includes(tokenId);
    }

    /**
     * Get mock metadata based on token ID
     */
    private getMockMetadata(tokenId: string): DigitalPassportMetadata {
        const mockProfiles: Record<string, DigitalPassportMetadata> = {
            '123': {
                name: 'デジタルパスポート #123',
                description: 'テスト用デジタルパスポート',
                image: 'https://example.com/passport-image.png',
                attributes: [
                    { trait_type: 'Username', value: 'テストユーザー' },
                    { trait_type: 'Level', value: 'Eクラス 天津神' },
                    { trait_type: 'Passport Type', value: '天津神' },
                    { trait_type: 'Quests Completed', value: 15 },
                    { trait_type: 'Travel Distance', value: 250 },
                    { trait_type: 'Magatama Points', value: 1500 },
                    { trait_type: 'Premium Status', value: 'プレミアム' },
                    { trait_type: 'CardType', value: '妖怪' },
                    { trait_type: 'CardKanji', value: '妖' },
                ],
            },
            '456': {
                name: 'Digital Passport #456',
                description: 'Advanced Traveler Profile',
                image: 'https://example.com/passport-image-456.png',
                attributes: [
                    { trait_type: 'Username', value: 'AdvancedUser' },
                    { trait_type: 'Level', value: 'S級 国津神' },
                    { trait_type: 'Passport Type', value: '国津神' },
                    { trait_type: 'Quests Completed', value: 42 },
                    { trait_type: 'Travel Distance', value: 1250 },
                    { trait_type: 'Magatama Points', value: 8500 },
                    { trait_type: 'Premium Status', value: 'Premium Plus' },
                    { trait_type: 'CardType', value: '神' },
                    { trait_type: 'CardKanji', value: '神' },
                ],
            },
            '789': {
                name: 'パスポート #789',
                description: '初心者向けデジタルパスポート',
                image: 'https://example.com/passport-image-789.png',
                attributes: [
                    { trait_type: 'Username', value: '初心者さん' },
                    { trait_type: 'Level', value: 'F級 地神' },
                    { trait_type: 'Passport Type', value: '地神' },
                    { trait_type: 'Quests Completed', value: 3 },
                    { trait_type: 'Travel Distance', value: 25 },
                    { trait_type: 'Magatama Points', value: 150 },
                    { trait_type: 'Premium Status', value: 'スタンダード' },
                    { trait_type: 'CardType', value: '人' },
                    { trait_type: 'CardKanji', value: '人' },
                ],
            },
            alice: {
                name: "Alice's Travel Pass",
                description: 'Explorer and Adventure Seeker',
                image: 'https://example.com/alice-passport.png',
                attributes: [
                    { trait_type: 'Username', value: 'Alice Explorer' },
                    { trait_type: 'Level', value: 'A級 山神' },
                    { trait_type: 'Passport Type', value: '山神' },
                    { trait_type: 'Quests Completed', value: 28 },
                    { trait_type: 'Travel Distance', value: 875 },
                    { trait_type: 'Magatama Points', value: 4200 },
                    { trait_type: 'Premium Status', value: 'Premium' },
                    { trait_type: 'CardType', value: '精霊' },
                    { trait_type: 'CardKanji', value: '精' },
                ],
            },
            bob: {
                name: "Bob's Digital ID",
                description: 'Tech Enthusiast Traveler',
                image: 'https://example.com/bob-passport.png',
                attributes: [
                    { trait_type: 'Username', value: 'Bob TechGuru' },
                    { trait_type: 'Level', value: 'B級 水神' },
                    { trait_type: 'Passport Type', value: '水神' },
                    { trait_type: 'Quests Completed', value: 19 },
                    { trait_type: 'Travel Distance', value: 640 },
                    { trait_type: 'Magatama Points', value: 2800 },
                    { trait_type: 'Premium Status', value: 'Standard' },
                    { trait_type: 'CardType', value: '龍' },
                    { trait_type: 'CardKanji', value: '龍' },
                ],
            },
            'test-user-1': {
                name: 'Test User Alpha',
                description: 'Development Testing Profile',
                image: 'https://example.com/test-passport-1.png',
                attributes: [
                    { trait_type: 'Username', value: 'TestAlpha' },
                    { trait_type: 'Level', value: 'C級 火神' },
                    { trait_type: 'Passport Type', value: '火神' },
                    { trait_type: 'Quests Completed', value: 12 },
                    { trait_type: 'Travel Distance', value: 380 },
                    { trait_type: 'Magatama Points', value: 1950 },
                    { trait_type: 'Premium Status', value: 'Standard' },
                    { trait_type: 'CardType', value: '鳥' },
                    { trait_type: 'CardKanji', value: '鳥' },
                ],
            },
        };

        return mockProfiles[tokenId] || mockProfiles['123']; // Fallback to default
    }
}

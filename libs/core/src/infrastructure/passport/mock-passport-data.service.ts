import {
    DigitalPassportMetadata,
    PassportAttribute,
} from '@app/core/domain/passport/digital-passport-metadata';
import { Injectable } from '@nestjs/common';

/**
 * Service that provides mock passport data for testing and development
 */
@Injectable()
export class MockPassportDataService {
    // Mock token IDs that should use test data
    private static readonly MOCK_TOKEN_IDS = [
        '123',
        '456',
        '789',
        'test-user-1',
        'test-user-2',
        'test-user-3',
        'alice',
        'bob',
        'charlie',
    ] as const;

    /**
     * Check if token ID should use mock data
     */
    isMockTokenId(tokenId: string): boolean {
        return MockPassportDataService.MOCK_TOKEN_IDS.includes(tokenId as any);
    }

    /**
     * Get mock metadata for testing purposes
     */
    getMockMetadata(tokenId: string): DigitalPassportMetadata {
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
            charlie: {
                name: "Charlie's Digital Pass",
                description: 'Multi-Platform Tester',
                image: 'https://example.com/charlie-passport.png',
                attributes: [
                    { trait_type: 'Username', value: 'Charlie Test' },
                    { trait_type: 'Level', value: 'D級 風神' },
                    { trait_type: 'Passport Type', value: '風神' },
                    { trait_type: 'Quests Completed', value: 8 },
                    { trait_type: 'Travel Distance', value: 320 },
                    { trait_type: 'Magatama Points', value: 950 },
                    { trait_type: 'Premium Status', value: 'Standard' },
                    { trait_type: 'CardType', value: '天' },
                    { trait_type: 'CardKanji', value: '天' },
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

    /**
     * Extract a specific attribute value from metadata with type safety
     */
    extractAttributeValue<T>(
        attributes: PassportAttribute[],
        traitType: string,
        defaultValue: T,
    ): T {
        const attribute = attributes.find((a) => a.trait_type === traitType);
        return (attribute?.value as T) ?? defaultValue;
    }
}

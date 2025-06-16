import { LevelType, PassportType } from '@prisma/client';

export interface DigitalPassportMetadata {
    name: string;
    description: string;
    image: string;
    external_url?: string;
    animation_url?: string;
    attributes: PassportAttribute[];
}

export interface PassportAttribute {
    trait_type: string;
    value: string | number;
    display_type?: 'boost_number' | 'boost_percentage' | 'number' | 'date';
    max_value?: number;
}

export interface PassportMetadataInput {
    tokenId: string;
    ownerAddress: string;
    username: string;
    passportType: PassportType;
    level: LevelType;
    totalQuestCompleted: number;
    totalTravelDistance: number;
    magatamaPoints: number;
    isPremium: boolean;
    registeredAt: Date;
    prayerBead?: number;
    sword?: number;
    orgeMask?: number;
}

export class DigitalPassportMetadataBuilder {
    static build(input: PassportMetadataInput): DigitalPassportMetadata {
        const passportTypeName = this.getPassportTypeName(input.passportType);
        const levelName = this.getLevelName(input.level);
        
        return {
            name: `${passportTypeName} Digital Passport #${input.tokenId}`,
            description: `Tourii Digital Passport for ${input.username}. This passport grants access to exclusive travel experiences and tracks your journey through Japan's hidden gems.`,
            image: this.generateImageUrl(input.passportType, input.level),
            external_url: `https://tourii.com/passport/${input.tokenId}`,
            attributes: [
                {
                    trait_type: 'Passport Type',
                    value: passportTypeName,
                },
                {
                    trait_type: 'Level',
                    value: levelName,
                },
                {
                    trait_type: 'Username',
                    value: input.username,
                },
                {
                    trait_type: 'Quests Completed',
                    value: input.totalQuestCompleted,
                    display_type: 'number',
                },
                {
                    trait_type: 'Travel Distance',
                    value: Math.floor(input.totalTravelDistance),
                    display_type: 'number',
                },
                {
                    trait_type: 'Magatama Points',
                    value: input.magatamaPoints,
                    display_type: 'number',
                },
                {
                    trait_type: 'Premium Status',
                    value: input.isPremium ? 'Premium' : 'Standard',
                },
                {
                    trait_type: 'Registration Date',
                    value: Math.floor(input.registeredAt.getTime() / 1000),
                    display_type: 'date',
                },
                ...(input.prayerBead !== undefined && input.prayerBead > 0 ? [{
                    trait_type: 'Prayer Beads',
                    value: input.prayerBead,
                    display_type: 'number' as const,
                }] : []),
                ...(input.sword !== undefined && input.sword > 0 ? [{
                    trait_type: 'Swords',
                    value: input.sword,
                    display_type: 'number' as const,
                }] : []),
                ...(input.orgeMask !== undefined && input.orgeMask > 0 ? [{
                    trait_type: 'Orge Masks',
                    value: input.orgeMask,
                    display_type: 'number' as const,
                }] : []),
            ],
        };
    }

    private static getPassportTypeName(type: PassportType): string {
        const typeNames: Record<PassportType, string> = {
            BONJIN: 'Bonjin',
            AMATSUKAMI: 'Amatsukami',
            KUNITSUKAMI: 'Kunitsukami',
            YOKAI: 'Yokai',
        };
        return typeNames[type] || 'Unknown';
    }

    private static getLevelName(level: LevelType): string {
        const levelNames: Record<LevelType, string> = {
            BONJIN: 'Bonjin',
            E_CLASS_AMATSUKAMI: 'E-Class Amatsukami',
            E_CLASS_KUNITSUKAMI: 'E-Class Kunitsukami',
            E_CLASS_YOKAI: 'E-Class Yokai',
            D_CLASS_AMATSUKAMI: 'D-Class Amatsukami',
            D_CLASS_KUNITSUKAMI: 'D-Class Kunitsukami',
            D_CLASS_YOKAI: 'D-Class Yokai',
            C_CLASS_AMATSUKAMI: 'C-Class Amatsukami',
            C_CLASS_KUNITSUKAMI: 'C-Class Kunitsukami',
            C_CLASS_YOKAI: 'C-Class Yokai',
            B_CLASS_AMATSUKAMI: 'B-Class Amatsukami',
            B_CLASS_KUNITSUKAMI: 'B-Class Kunitsukami',
            B_CLASS_YOKAI: 'B-Class Yokai',
            A_CLASS_AMATSUKAMI: 'A-Class Amatsukami',
            A_CLASS_KUNITSUKAMI: 'A-Class Kunitsukami',
            A_CLASS_YOKAI: 'A-Class Yokai',
            S_CLASS_AMATSUKAMI: 'S-Class Amatsukami',
            S_CLASS_KUNITSUKAMI: 'S-Class Kunitsukami',
            S_CLASS_YOKAI: 'S-Class Yokai',
        };
        return levelNames[level] || 'Unknown';
    }

    private static generateImageUrl(passportType: PassportType, level: LevelType): string {
        // Generate image URL based on passport type and level
        // This would typically point to dynamically generated or pre-designed images
        const baseUrl = 'https://assets.tourii.com/passport';
        const typeSlug = passportType.toLowerCase();
        const levelSlug = level.toLowerCase().replace(/_/g, '-');
        
        return `${baseUrl}/${typeSlug}/${levelSlug}.png`;
    }
}
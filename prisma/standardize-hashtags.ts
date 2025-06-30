#!/usr/bin/env npx tsx

/**
 * Script to standardize hashtag format in tourist_spot table
 * - Remove # prefix from hashtags
 * - Apply proper casing (Tokyo, Shibuya instead of #tokyo, #shibuya)
 * - Deduplicate hashtags within each spot
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface HashtagMapping {
    [key: string]: string;
}

const hashtagMapping: HashtagMapping = {
    // Cities and regions
    tokyo: 'Tokyo',
    shibuya: 'Shibuya',
    shinjuku: 'Shinjuku',
    harajuku: 'Harajuku',
    ginza: 'Ginza',
    roppongi: 'Roppongi',
    akihabara: 'Akihabara',
    asakusa: 'Asakusa',
    ueno: 'Ueno',
    ikebukuro: 'Ikebukuro',
    kyoto: 'Kyoto',
    osaka: 'Osaka',
    kobe: 'Kobe',
    nara: 'Nara',
    yokohama: 'Yokohama',
    hiroshima: 'Hiroshima',
    fukuoka: 'Fukuoka',
    sapporo: 'Sapporo',
    sendai: 'Sendai',
    nagoya: 'Nagoya',

    // Attractions and landmarks
    crossing: 'Crossing',
    station: 'Station',
    market: 'Market',
    temple: 'Temple',
    shrine: 'Shrine',
    castle: 'Castle',
    tower: 'Tower',
    bridge: 'Bridge',
    garden: 'Garden',
    park: 'Park',
    museum: 'Museum',
    gallery: 'Gallery',

    // Themes and activities
    food: 'Food',
    shopping: 'Shopping',
    culture: 'Culture',
    traditional: 'Traditional',
    modern: 'Modern',
    historic: 'Historic',
    nature: 'Nature',
    urban: 'Urban',
    nightlife: 'Nightlife',
    entertainment: 'Entertainment',
    anime: 'Anime',
    manga: 'Manga',
    'pop culture': 'Pop Culture',
    art: 'Art',
    architecture: 'Architecture',

    // Transportation
    railway: 'Railway',
    metro: 'Metro',
    subway: 'Subway',
    train: 'Train',
    'tokyo station': 'Tokyo Station',
    tokyostation: 'Tokyo Station',

    // Experience types
    family: 'Family',
    couples: 'Couples',
    solo: 'Solo',
    group: 'Group',
    photography: 'Photography',
    walking: 'Walking',
    scenic: 'Scenic',
    viewpoint: 'Viewpoint',
    'hidden gems': 'Hidden Gems',
    hiddengems: 'Hidden Gems',
    historicart: 'Historic Art',
    'historic art': 'Historic Art',
    'spiritual site': 'Spiritual',
    spiritualsite: 'Spiritual',
    'healing spots': 'Healing',
    healingspots: 'Healing',
};

function normalizeHashtag(hashtag: string): string {
    // Remove # prefix if present
    const cleaned = hashtag.replace(/^#/, '').trim();

    // Convert to lowercase for lookup
    const lookup = cleaned.toLowerCase();

    // Return mapped value if found
    if (hashtagMapping[lookup]) {
        return hashtagMapping[lookup];
    }

    // Handle compound words (like TokyoStation -> Tokyo Station)
    const splitCompound = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2');
    const compoundLookup = splitCompound.toLowerCase();
    if (hashtagMapping[compoundLookup]) {
        return hashtagMapping[compoundLookup];
    }

    // Special handling for common patterns
    if (lookup.includes('tokyo')) {
        if (lookup.includes('station')) return 'Tokyo Station';
        return 'Tokyo';
    }
    if (lookup.includes('shibuya')) {
        if (lookup.includes('crossing')) return 'Shibuya Crossing';
        return 'Shibuya';
    }
    if (lookup.includes('historic')) return 'Historic';
    if (lookup.includes('hidden')) return 'Hidden Gems';
    if (lookup.includes('spiritual')) return 'Spiritual';
    if (lookup.includes('healing')) return 'Healing';

    // Apply proper title case as fallback
    return splitCompound
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function deduplicateHashtags(hashtags: string[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const hashtag of hashtags) {
        const normalized = normalizeHashtag(hashtag);
        const key = normalized.toLowerCase();

        if (!seen.has(key)) {
            seen.add(key);
            result.push(normalized);
        }
    }

    return result;
}

async function standardizeHashtags() {
    console.log('🏷️  Starting hashtag standardization...');

    try {
        // Get all tourist spots with their current hashtags
        const spots = await prisma.tourist_spot.findMany({
            select: {
                tourist_spot_id: true,
                tourist_spot_name: true,
                tourist_spot_hashtag: true,
            },
            where: {
                del_flag: false,
            },
        });

        console.log(`📍 Found ${spots.length} tourist spots to process`);

        let updatedCount = 0;
        let totalHashtagsBefore = 0;
        let totalHashtagsAfter = 0;

        for (const spot of spots) {
            const originalHashtags = Array.isArray(spot.tourist_spot_hashtag)
                ? (spot.tourist_spot_hashtag as string[])
                : [];

            if (originalHashtags.length === 0) {
                continue;
            }

            totalHashtagsBefore += originalHashtags.length;

            // Standardize and deduplicate hashtags
            const standardizedHashtags = deduplicateHashtags(originalHashtags);
            totalHashtagsAfter += standardizedHashtags.length;

            // Check if changes are needed
            const hasChanges =
                originalHashtags.length !== standardizedHashtags.length ||
                originalHashtags.some((tag, index) => tag !== standardizedHashtags[index]);

            if (hasChanges) {
                console.log(`🔄 Updating ${spot.tourist_spot_name}:`);
                console.log(`   Before: [${originalHashtags.join(', ')}]`);
                console.log(`   After:  [${standardizedHashtags.join(', ')}]`);

                await prisma.tourist_spot.update({
                    where: { tourist_spot_id: spot.tourist_spot_id },
                    data: {
                        tourist_spot_hashtag: standardizedHashtags,
                        upd_date_time: new Date(),
                        upd_user_id: 'hashtag-standardization',
                    },
                });

                updatedCount++;
            }
        }

        console.log('\\n✅ Hashtag standardization completed!');
        console.log(`📊 Statistics:`);
        console.log(`   • Tourist spots processed: ${spots.length}`);
        console.log(`   • Tourist spots updated: ${updatedCount}`);
        console.log(`   • Hashtags before: ${totalHashtagsBefore}`);
        console.log(`   • Hashtags after: ${totalHashtagsAfter}`);
        console.log(
            `   • Hashtags removed (duplicates): ${totalHashtagsBefore - totalHashtagsAfter}`,
        );
    } catch (error) {
        console.error('❌ Error during hashtag standardization:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
if (require.main === module) {
    standardizeHashtags()
        .then(() => {
            console.log('🎉 Hashtag standardization completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Hashtag standardization failed:', error);
            process.exit(1);
        });
}

export { standardizeHashtags };

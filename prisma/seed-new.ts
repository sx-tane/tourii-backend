/**
 * 🌱 Tourii Database Seeding
 *
 * Modular, maintainable database seeding for development and testing.
 * Run specific parts or everything as needed.
 *
 * Usage:
 *   npx tsx prisma/seed-new.ts                    # Seed everything
 *   npx tsx prisma/seed-new.ts --users-only       # Just users
 *   npx tsx prisma/seed-new.ts --stories-only     # Just stories
 *   npx tsx prisma/seed-new.ts --clean            # Clean everything first
 */

import { Logger } from '@nestjs/common';
import {
    AchievementType,
    BlockchainType,
    KendamaSeason,
    LevelType,
    OnchainItemType,
    PassportType,
    PrismaClient,
    QuestType,
    RewardType,
    StoryStatus,
    TaskTheme,
    TaskType,
    UserRoleType,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

// 🎯 Configuration
const SEED_CONFIG = {
    users: {
        testPassword: 'hashed_password_placeholder', // Replace with actual hashing
        defaultUsers: ['alice', 'bob', 'admin'] as const,
    },
    stories: {
        createSampleContent: true,
        includeRealLocations: true,
    },
    discord: {
        createRoles: true,
        assignToUsers: true,
    },
};

// 📝 Data Templates
const USER_TEMPLATES = {
    alice: {
        username: 'alice',
        email: 'alice@tourii.dev',
        discord_id: 'discord_alice_123',
        discord_username: 'AliceDiscord',
        role: UserRoleType.USER,
        is_premium: false,
        level: LevelType.BONJIN,
        magatama_points: 150,
    },
    bob: {
        username: 'bob',
        email: 'bob@tourii.dev',
        discord_id: 'discord_bob_456',
        discord_username: 'BobDiscord',
        role: UserRoleType.USER,
        is_premium: false,
        level: LevelType.E_CLASS_AMATSUKAMI,
        magatama_points: 650,
    },
    admin: {
        username: 'admin',
        email: 'admin@tourii.dev',
        discord_id: 'discord_admin_789',
        discord_username: 'AdminDiscord',
        role: UserRoleType.ADMIN,
        is_premium: true,
        level: LevelType.C_CLASS_AMATSUKAMI,
        magatama_points: 2500,
    },
} as const;

const STORY_TEMPLATES = {
    prologue: {
        saga_name: 'Prologue: Welcome to Tourii',
        saga_desc: 'Learn the basics of your digital journey',
        location: 'Digital Realm',
        order: 1,
        is_prologue: true,
        is_selected: true,
    },
    tokyo: {
        saga_name: 'Tokyo Urban Adventure',
        saga_desc: 'Explore the bustling metropolis of Tokyo',
        location: 'Tokyo, Japan',
        order: 2,
        is_prologue: false,
        background_media: 'https://cdn.tourii.app/images/tokyo_bg.jpg',
        map_image: 'https://cdn.tourii.app/images/tokyo_map.jpg',
    },
    kyoto: {
        saga_name: 'Kyoto Cultural Heritage',
        saga_desc: 'Discover traditional Japan in the ancient capital',
        location: 'Kyoto, Japan',
        order: 3,
        is_prologue: false,
        background_media: 'https://cdn.tourii.app/images/kyoto_bg.jpg',
        map_image: 'https://cdn.tourii.app/images/kyoto_map.jpg',
    },
} as const;

// 🧹 Cleanup Functions
class DatabaseCleaner {
    static async cleanAll() {
        Logger.log('🧹 Cleaning database...');

        // Delete in correct order (respecting foreign keys)
        await prisma.user_travel_log.deleteMany();
        await prisma.user_task_log.deleteMany();
        await prisma.user_story_log.deleteMany();
        await prisma.user_item_claim_log.deleteMany();
        await prisma.user_onchain_item.deleteMany();
        await prisma.user_achievement.deleteMany();
        await prisma.discord_user_roles.deleteMany();
        await prisma.discord_activity_log.deleteMany();
        await prisma.discord_rewarded_roles.deleteMany();
        await prisma.user_invite_log.deleteMany();
        await prisma.user_info.deleteMany();

        await prisma.quest_task.deleteMany();
        await prisma.quest.deleteMany();
        await prisma.tourist_spot.deleteMany();
        await prisma.story_chapter.deleteMany();
        await prisma.model_route.deleteMany();
        await prisma.story.deleteMany();

        await prisma.user.deleteMany();
        await prisma.onchain_item_catalog.deleteMany();
        await prisma.discord_roles.deleteMany();
        await prisma.level_requirement_master.deleteMany();
        await prisma.kendama_random_range.deleteMany();

        Logger.log('✅ Database cleaned');
    }

    static async cleanUsers() {
        await prisma.user_travel_log.deleteMany();
        await prisma.user_task_log.deleteMany();
        await prisma.user_story_log.deleteMany();
        await prisma.user_item_claim_log.deleteMany();
        await prisma.user_onchain_item.deleteMany();
        await prisma.user_achievement.deleteMany();
        await prisma.discord_user_roles.deleteMany();
        await prisma.user_info.deleteMany();
        await prisma.user.deleteMany();
    }

    static async cleanStories() {
        await prisma.user_story_log.deleteMany();
        await prisma.quest_task.deleteMany();
        await prisma.quest.deleteMany();
        await prisma.tourist_spot.deleteMany();
        await prisma.story_chapter.deleteMany();
        await prisma.model_route.deleteMany();
        await prisma.story.deleteMany();
    }
}

// 🏗️ System Data Seeders
class SystemSeeder {
    static async seedDiscordRoles() {
        Logger.log('👥 Creating Discord roles...');

        const roles = [
            { id: BigInt('100000000000000001'), name: 'Tourii User' },
            { id: BigInt('100000000000000002'), name: 'Tourii Moderator' },
            { id: BigInt('100000000000000003'), name: 'Tourii Admin' },
        ];

        const createdRoles = [];
        for (const role of roles) {
            const created = await prisma.discord_roles.upsert({
                where: { role_id: role.id },
                create: {
                    role_id: role.id,
                    name: role.name,
                    ins_user_id: 'system-seed',
                },
                update: {},
            });
            createdRoles.push(created);
        }

        Logger.log(`✅ Created ${createdRoles.length} Discord roles`);
        return createdRoles;
    }

    static async seedLevelRequirements() {
        Logger.log('📊 Creating level requirements...');

        const levels = [
            {
                level: LevelType.BONJIN,
                min_points: 0,
                max_points: 99,
                items_required: 0,
            },
            {
                level: LevelType.E_CLASS_AMATSUKAMI,
                min_points: 100,
                max_points: 499,
                items_required: 1,
            },
            // Add more levels as needed
        ];

        for (const level of levels) {
            await prisma.level_requirement_master.upsert({
                where: { level: level.level },
                create: {
                    level: level.level,
                    discord_role_id: '100000000000000001', // Default to user role
                    min_get_magatama_points: level.min_points,
                    max_get_magatama_points: level.max_points,
                    total_onchain_item: level.items_required,
                    prayer_bead: 0,
                    sword: 0,
                    orge_mask: 0,
                    ins_user_id: 'system-seed',
                },
                update: {},
            });
        }

        Logger.log('✅ Level requirements created');
    }

    static async seedGameConfig() {
        Logger.log('🎮 Creating game configuration...');

        // Kendama game settings
        const kendamaSettings = [
            {
                season: KendamaSeason.NORMAL,
                landed: new Decimal('0.7'),
                missed: new Decimal('0.3'),
                win_rate: new Decimal('0.6'),
            },
            {
                season: KendamaSeason.EVENT,
                landed: new Decimal('0.8'),
                missed: new Decimal('0.2'),
                win_rate: new Decimal('0.75'),
            },
        ];

        for (const setting of kendamaSettings) {
            await prisma.kendama_random_range.upsert({
                where: { season: setting.season },
                create: {
                    ...setting,
                    ins_user_id: 'system-seed',
                },
                update: setting,
            });
        }

        Logger.log('✅ Game configuration created');
    }

    static async seedNFTCatalog() {
        Logger.log('🎨 Creating NFT catalog...');

        const nftItems = [
            {
                id: 'CATALOG-PASSPORT-001',
                type: OnchainItemType.DIGITAL_PASSPORT,
                blockchain: BlockchainType.VARA,
                name: 'Tourii Digital Passport',
                description: 'Your gateway to the Tourii universe',
                image: 'https://cdn.tourii.app/nft/passport.png',
            },
            {
                id: 'CATALOG-LOG-001',
                type: OnchainItemType.LOG_NFT,
                blockchain: BlockchainType.VARA,
                name: 'Adventure Log Entry',
                description: 'Commemorative log of your journey',
                image: 'https://cdn.tourii.app/nft/log.png',
            },
            {
                id: 'CATALOG-PERK-001',
                type: OnchainItemType.PERK,
                blockchain: BlockchainType.CAMINO,
                name: 'Discount Voucher',
                description: '10% off at participating locations',
                image: 'https://cdn.tourii.app/nft/perk.png',
            },
        ];

        const created = [];
        for (const item of nftItems) {
            const nft = await prisma.onchain_item_catalog.upsert({
                where: { onchain_item_id: item.id },
                create: {
                    onchain_item_id: item.id,
                    item_type: item.type,
                    blockchain_type: item.blockchain,
                    nft_name: item.name,
                    nft_description: item.description,
                    image_url: item.image,
                    contract_address: `0x${item.id.toLowerCase()}`,
                    token_id: '1',
                    attributes: [],
                    release_date: new Date('2024-01-01'),
                    max_supply: item.type === OnchainItemType.PERK ? 1000 : 0,
                    ins_user_id: 'system-seed',
                },
                update: {},
            });
            created.push(nft);
        }

        Logger.log(`✅ Created ${created.length} NFT catalog items`);
        return created;
    }
}

// 👤 User Seeders
class UserSeeder {
    static async seedUsers(usernames: readonly string[] = ['alice', 'bob', 'admin']) {
        Logger.log(`👤 Creating users: ${usernames.join(', ')}`);

        const createdUsers = [];

        for (const username of usernames) {
            const template = USER_TEMPLATES[username as keyof typeof USER_TEMPLATES];
            if (!template) {
                console.warn(`⚠️ No template found for user: ${username}`);
                continue;
            }

            const user = await prisma.user.upsert({
                where: { username: template.username },
                create: {
                    username: template.username,
                    email: template.email,
                    password: SEED_CONFIG.users.testPassword,
                    discord_id: template.discord_id,
                    discord_username: template.discord_username,
                    passport_wallet_address: `0xPassport${template.username}123`,
                    perks_wallet_address: `0xPerks${template.username}456`,
                    encrypted_private_key: 'encrypted_placeholder',
                    latest_ip_address: '127.0.0.1',
                    is_premium: template.is_premium,
                    role: template.role,
                    registered_at: new Date(),
                    ins_user_id: 'system-seed',
                },
                update: {
                    latest_ip_address: '127.0.0.1',
                    upd_user_id: 'system-seed',
                    upd_date_time: new Date(),
                },
            });

            // Create user_info
            await prisma.user_info.upsert({
                where: { user_id: user.user_id },
                create: {
                    user_id: user.user_id,
                    digital_passport_address: user.passport_wallet_address!,
                    log_nft_address: `0xLogNFT${template.username}`,
                    user_digital_passport_type: PassportType.BONJIN,
                    level: template.level,
                    magatama_points: template.magatama_points,
                    total_quest_completed: 0,
                    total_travel_distance: 0,
                    is_premium: template.is_premium,
                    ins_user_id: 'system-seed',
                },
                update: {
                    magatama_points: template.magatama_points,
                    level: template.level,
                    upd_user_id: 'system-seed',
                    upd_date_time: new Date(),
                },
            });

            createdUsers.push({ user, template });
        }

        Logger.log(`✅ Created ${createdUsers.length} users`);
        return createdUsers;
    }

    static async assignDiscordRoles(users: any[], roles: any[]) {
        if (!SEED_CONFIG.discord.assignToUsers) return;

        Logger.log('🔗 Assigning Discord roles...');

        const userRole = roles.find((r) => r.name === 'Tourii User');
        const adminRole = roles.find((r) => r.name === 'Tourii Admin');

        for (const { user, template } of users) {
            // All users get user role
            const existingUserRole = await prisma.discord_user_roles.findFirst({
                where: {
                    user_id: user.user_id,
                    role_id: userRole.role_id,
                },
            });

            if (!existingUserRole) {
                await prisma.discord_user_roles.create({
                    data: {
                        user_id: user.user_id,
                        role_id: userRole.role_id,
                        ins_user_id: 'system-seed',
                    },
                });
            }

            // Admins also get admin role
            if (template.role === UserRoleType.ADMIN && adminRole) {
                const existingAdminRole = await prisma.discord_user_roles.findFirst({
                    where: {
                        user_id: user.user_id,
                        role_id: adminRole.role_id,
                    },
                });

                if (!existingAdminRole) {
                    await prisma.discord_user_roles.create({
                        data: {
                            user_id: user.user_id,
                            role_id: adminRole.role_id,
                            ins_user_id: 'system-seed',
                        },
                    });
                }
            }
        }

        Logger.log('✅ Discord roles assigned');
    }

    static async createSampleAchievements(users: any[]) {
        Logger.log('🏆 Creating sample achievements...');

        const achievements = [
            {
                name: 'First Steps',
                description: 'Completed your first quest',
                type: AchievementType.MILESTONE,
                points: 10,
            },
            {
                name: 'Explorer',
                description: 'Visited 5 different locations',
                type: AchievementType.MILESTONE,
                points: 25,
            },
            {
                name: 'Community Helper',
                description: 'Helped other users in Discord',
                type: AchievementType.COMMUNITY,
                points: 15,
            },
        ];

        for (const { user } of users.slice(0, 2)) {
            // Only give to first 2 users
            const randomAchievements = achievements.slice(0, Math.floor(Math.random() * 2) + 1);

            for (const achievement of randomAchievements) {
                await prisma.user_achievement.create({
                    data: {
                        user_id: user.user_id,
                        achievement_name: achievement.name,
                        achievement_desc: achievement.description,
                        achievement_type: achievement.type,
                        magatama_point_awarded: achievement.points,
                        ins_user_id: 'system-seed',
                    },
                });
            }
        }

        Logger.log('✅ Sample achievements created');
    }
}

// 📚 Story Content Seeders
class StorySeeder {
    static async seedStories() {
        if (!SEED_CONFIG.stories.createSampleContent) return [];

        Logger.log('📚 Creating stories...');

        const createdStories = [];

        for (const [key, template] of Object.entries(STORY_TEMPLATES)) {
            const story = await prisma.story.create({
                data: {
                    ...template,
                    ins_user_id: 'system-seed',
                },
            });

            createdStories.push({ key, story });
        }

        Logger.log(`✅ Created ${createdStories.length} stories`);
        return createdStories;
    }

    static async createSampleContent(stories: any[]) {
        Logger.log('🗺️ Creating routes and tourist spots...');

        // Create sample content for Tokyo story
        const tokyoStory = stories.find((s) => s.key === 'tokyo')?.story;
        if (!tokyoStory) return;

        // Create model route
        const route = await prisma.model_route.create({
            data: {
                story_id: tokyoStory.story_id,
                route_name: 'Tokyo Central Walking Tour',
                region: 'Tokyo',
                region_latitude: 35.6762,
                region_longitude: 139.6503,
                recommendation: ['Urban Culture', 'Street Food', 'Photography'],
                ins_user_id: 'system-seed',
            },
        });

        // Create tourist spots
        const spots = [
            {
                name: 'Shibuya Crossing',
                description: "The world's busiest pedestrian crossing",
                latitude: 35.6595,
                longitude: 139.7006,
                hashtags: ['#Shibuya', '#Tokyo', '#Crossing'],
            },
            {
                name: 'Tokyo Station',
                description: 'Historic railway station and transport hub',
                latitude: 35.6812,
                longitude: 139.7645,
                hashtags: ['#TokyoStation', '#Railway', '#Historic'],
            },
        ];

        const createdSpots = [];
        for (const [index, spot] of spots.entries()) {
            // Create story chapter first to get the ID
            const chapter = await prisma.story_chapter.create({
                data: {
                    story_id: tokyoStory.story_id,
                    tourist_spot_id: 'placeholder', // Will be updated after tourist spot creation
                    chapter_number: `1-${index + 1}`,
                    chapter_title: `Discover ${spot.name}`,
                    chapter_desc: spot.description,
                    chapter_image: `https://cdn.tourii.app/images/chapter_${index + 1}.jpg`,
                    character_name_list: ['Local Guide', 'Tourist'],
                    real_world_image: `https://cdn.tourii.app/images/${spot.name.toLowerCase().replace(' ', '_')}_real.jpg`,
                    chapter_video_url: `https://cdn.tourii.app/videos/chapter_${index + 1}.mp4`,
                    chapter_video_mobile_url: `https://cdn.tourii.app/videos/chapter_${index + 1}_mobile.mp4`,
                    chapter_pdf_url: `https://cdn.tourii.app/pdfs/chapter_${index + 1}.pdf`,
                    is_unlocked: true,
                    ins_user_id: 'system-seed',
                },
            });

            // Create tourist spot with the chapter ID
            const touristSpot = await prisma.tourist_spot.create({
                data: {
                    model_route_id: route.model_route_id,
                    story_chapter_id: chapter.story_chapter_id,
                    tourist_spot_name: spot.name,
                    tourist_spot_desc: spot.description,
                    latitude: spot.latitude,
                    longitude: spot.longitude,
                    address: `${spot.name}, Tokyo, Japan`,
                    tourist_spot_hashtag: spot.hashtags,
                    image_set: {
                        main: `https://cdn.tourii.app/images/${spot.name.toLowerCase().replace(' ', '_')}_main.jpg`,
                        small: [],
                    },
                    ins_user_id: 'system-seed',
                },
            });

            // Update chapter with tourist spot ID
            await prisma.story_chapter.update({
                where: { story_chapter_id: chapter.story_chapter_id },
                data: { tourist_spot_id: touristSpot.tourist_spot_id },
            });

            createdSpots.push({ spot: touristSpot, chapter });
        }

        Logger.log(`✅ Created route with ${createdSpots.length} tourist spots`);
        return { route, spots: createdSpots };
    }

    static async createSampleQuests(content: any) {
        if (!content?.spots) return;

        Logger.log('🎯 Creating sample quests...');

        const questTemplates = [
            {
                name: 'Photo Challenge',
                description: 'Take a memorable photo at this location',
                type: QuestType.TRAVEL_TO_EARN,
                taskType: TaskType.PHOTO_UPLOAD,
                points: 50,
            },
            {
                name: 'Local Knowledge Quiz',
                description: 'Test your knowledge about this place',
                type: QuestType.EARN_TO_TRAVEL,
                taskType: TaskType.SELECT_OPTION,
                points: 30,
            },
        ];

        for (const { spot } of content.spots) {
            const template = questTemplates[Math.floor(Math.random() * questTemplates.length)];

            const quest = await prisma.quest.create({
                data: {
                    tourist_spot_id: spot.tourist_spot_id,
                    quest_name: `${spot.tourist_spot_name} - ${template.name}`,
                    quest_desc: template.description,
                    quest_type: template.type,
                    quest_image: `https://cdn.tourii.app/images/quest_${spot.tourist_spot_id}.jpg`,
                    is_unlocked: true,
                    is_premium: Math.random() > 0.7, // 30% chance of premium
                    total_magatama_point_awarded: template.points,
                    reward_type: RewardType.SOCIAL_RECOGNITION,
                    reward_items: [
                        {
                            item_name: 'Featured Photo',
                            item_desc: 'Chance to be featured on social media',
                        },
                    ],
                    ins_user_id: 'system-seed',
                },
            });

            // Create a task for the quest
            await prisma.quest_task.create({
                data: {
                    quest_id: quest.quest_id,
                    task_theme: TaskTheme.NATURE,
                    task_type: template.taskType,
                    task_name: template.name,
                    task_desc: template.description,
                    is_unlocked: true,
                    required_action: '{}',
                    select_options:
                        template.taskType === TaskType.SELECT_OPTION
                            ? [
                                  { option_text: 'Option A', answer_flag: true },
                                  { option_text: 'Option B', answer_flag: false },
                                  { option_text: 'Option C', answer_flag: false },
                              ]
                            : [],
                    group_activity_members: [],
                    anti_cheat_rules: { claim_once: true },
                    magatama_point_awarded: template.points,
                    ins_user_id: 'system-seed',
                },
            });
        }

        Logger.log('✅ Sample quests created');
    }
}

// 🎮 Activity Seeders
class ActivitySeeder {
    static async createSampleActivity(users: any[], stories: any[]) {
        Logger.log('📝 Creating sample user activity...');

        const alice = users.find((u) => u.template.username === 'alice')?.user;
        if (!alice || stories.length === 0) return;

        const tokyoStory = stories.find((s) => s.key === 'tokyo')?.story;
        if (!tokyoStory) return;

        // Story progress
        await prisma.user_story_log.create({
            data: {
                user_id: alice.user_id,
                story_chapter_id: tokyoStory.story_id,
                status: StoryStatus.IN_PROGRESS,
                unlocked_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                ins_user_id: 'system-seed',
            },
        });

        // Discord activity
        await prisma.discord_activity_log.create({
            data: {
                user_id: alice.user_id,
                activity_type: 'message_sent',
                activity_details: 'Posted in #general channel',
                magatama_point_awarded: 1,
                ins_user_id: 'system-seed',
            },
        });

        Logger.log('✅ Sample activity created');
    }
}

// 🎯 Main Seeding Functions
class TouriiSeeder {
    static async seedEverything() {
        Logger.log('🌱 Starting complete database seeding...\n');

        try {
            // System data
            const roles = await SystemSeeder.seedDiscordRoles();
            await SystemSeeder.seedLevelRequirements();
            await SystemSeeder.seedGameConfig();
            const nftCatalog = await SystemSeeder.seedNFTCatalog();

            // Users
            const users = await UserSeeder.seedUsers(['alice', 'bob', 'admin']);
            await UserSeeder.assignDiscordRoles(users, roles);
            await UserSeeder.createSampleAchievements(users);

            // Stories and content
            const stories = await StorySeeder.seedStories();
            const content = await StorySeeder.createSampleContent(stories);
            await StorySeeder.createSampleQuests(content);

            // Activity
            await ActivitySeeder.createSampleActivity(users, stories);

            Logger.log('\n🎉 Database seeding completed successfully!');
            Logger.log('📊 Summary:');
            Logger.log(`   👤 Users: ${users.length}`);
            Logger.log(`   👥 Discord Roles: ${roles.length}`);
            Logger.log(`   📚 Stories: ${stories.length}`);
            Logger.log(`   🎨 NFT Items: ${nftCatalog.length}`);
        } catch (error) {
            console.error('❌ Seeding failed:', error);
            throw error;
        }
    }

    static async seedUsersOnly() {
        Logger.log('👤 Seeding users only...');

        const roles = await SystemSeeder.seedDiscordRoles();
        const users = await UserSeeder.seedUsers(['alice', 'bob', 'admin']);
        await UserSeeder.assignDiscordRoles(users, roles);
        await UserSeeder.createSampleAchievements(users);

        Logger.log('✅ Users seeded successfully');
    }

    static async seedStoriesOnly() {
        Logger.log('📚 Seeding stories only...');

        const stories = await StorySeeder.seedStories();
        const content = await StorySeeder.createSampleContent(stories);
        await StorySeeder.createSampleQuests(content);

        Logger.log('✅ Stories seeded successfully');
    }
}

// 🚀 CLI Runner
async function main() {
    const args = process.argv.slice(2);
    const isCleanFirst = args.includes('--clean');
    const isUsersOnly = args.includes('--users-only');
    const isStoriesOnly = args.includes('--stories-only');

    try {
        if (isCleanFirst) {
            await DatabaseCleaner.cleanAll();
        }

        if (isUsersOnly) {
            if (!isCleanFirst) await DatabaseCleaner.cleanUsers();
            await TouriiSeeder.seedUsersOnly();
        } else if (isStoriesOnly) {
            if (!isCleanFirst) await DatabaseCleaner.cleanStories();
            await TouriiSeeder.seedStoriesOnly();
        } else {
            await TouriiSeeder.seedEverything();
        }
    } catch (error) {
        console.error('💥 Fatal error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

export {
    ActivitySeeder,
    DatabaseCleaner,
    SEED_CONFIG,
    STORY_TEMPLATES,
    StorySeeder,
    SystemSeeder,
    TouriiSeeder,
    USER_TEMPLATES,
    UserSeeder,
};

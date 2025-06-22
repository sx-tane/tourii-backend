/**
 * 🌱 Admin Users Seeding
 *
 * Creates diverse set of users for testing the admin dashboard
 * with various roles, levels, and activity patterns.
 */

import { Logger } from '@nestjs/common';
import { LevelType, PassportType, PrismaClient, UserRoleType } from '@prisma/client';

const prisma = new PrismaClient();
const logger = new Logger('AdminUserSeeder');

// 📝 Enhanced User Templates
const ENHANCED_USER_TEMPLATES = [
    {
        username: 'alice_explorer',
        email: 'alice@tourii.dev',
        discord_id: 'discord_alice_123',
        discord_username: 'AliceExplorer',
        twitter_id: 'twitter_alice',
        twitter_username: 'AliceAdventures',
        role: UserRoleType.USER,
        is_premium: false,
        is_banned: false,
        total_quest_completed: 5,
        total_travel_distance: 124.5,
        latest_ip_address: '192.168.1.10',
        userInfo: {
            user_digital_passport_type: PassportType.BONJIN,
            level: LevelType.BONJIN,
            magatama_points: 150,
            magatama_bags: 1,
            total_quest_completed: 5,
            total_travel_distance: 124.5,
            is_premium: false,
            prayer_bead: 3,
            sword: 1,
            orge_mask: 0,
        },
    },
    {
        username: 'bob_wanderer',
        email: 'bob@tourii.dev',
        discord_id: 'discord_bob_456',
        discord_username: 'BobWanderer',
        twitter_id: 'twitter_bob',
        twitter_username: 'BobTravels',
        role: UserRoleType.USER,
        is_premium: true,
        is_banned: false,
        total_quest_completed: 12,
        total_travel_distance: 342.8,
        latest_ip_address: '192.168.1.20',
        userInfo: {
            user_digital_passport_type: PassportType.AMATSUKAMI,
            level: LevelType.E_CLASS_AMATSUKAMI,
            magatama_points: 650,
            magatama_bags: 3,
            total_quest_completed: 12,
            total_travel_distance: 342.8,
            is_premium: true,
            prayer_bead: 8,
            sword: 3,
            orge_mask: 1,
        },
    },
    {
        username: 'charlie_seeker',
        email: 'charlie@tourii.dev',
        discord_id: 'discord_charlie_789',
        discord_username: 'CharlieSeeker',
        google_email: 'charlie.seeker@gmail.com',
        role: UserRoleType.USER,
        is_premium: false,
        is_banned: false,
        total_quest_completed: 8,
        total_travel_distance: 201.3,
        latest_ip_address: '192.168.1.30',
        userInfo: {
            user_digital_passport_type: PassportType.KUNITSUKAMI,
            level: LevelType.D_CLASS_KUNITSUKAMI,
            magatama_points: 420,
            magatama_bags: 2,
            total_quest_completed: 8,
            total_travel_distance: 201.3,
            is_premium: false,
            prayer_bead: 5,
            sword: 2,
            orge_mask: 1,
        },
    },
    {
        username: 'diana_moderator',
        email: 'diana@tourii.dev',
        discord_id: 'discord_diana_101',
        discord_username: 'DianaMod',
        twitter_id: 'twitter_diana',
        twitter_username: 'DianaModTourii',
        role: UserRoleType.MODERATOR,
        is_premium: true,
        is_banned: false,
        total_quest_completed: 25,
        total_travel_distance: 567.2,
        latest_ip_address: '192.168.1.40',
        userInfo: {
            user_digital_passport_type: PassportType.AMATSUKAMI,
            level: LevelType.C_CLASS_AMATSUKAMI,
            magatama_points: 1250,
            magatama_bags: 5,
            total_quest_completed: 25,
            total_travel_distance: 567.2,
            is_premium: true,
            prayer_bead: 15,
            sword: 8,
            orge_mask: 3,
        },
    },
    {
        username: 'eve_premium',
        email: 'eve@tourii.dev',
        discord_id: 'discord_eve_202',
        discord_username: 'EvePremium',
        google_email: 'eve.premium@gmail.com',
        role: UserRoleType.USER,
        is_premium: true,
        is_banned: false,
        total_quest_completed: 18,
        total_travel_distance: 445.7,
        latest_ip_address: '192.168.1.50',
        userInfo: {
            user_digital_passport_type: PassportType.YOKAI,
            level: LevelType.B_CLASS_YOKAI,
            magatama_points: 890,
            magatama_bags: 4,
            total_quest_completed: 18,
            total_travel_distance: 445.7,
            is_premium: true,
            prayer_bead: 12,
            sword: 6,
            orge_mask: 4,
        },
    },
    {
        username: 'frank_newbie',
        email: 'frank@tourii.dev',
        discord_id: 'discord_frank_303',
        discord_username: 'FrankNewbie',
        role: UserRoleType.USER,
        is_premium: false,
        is_banned: false,
        total_quest_completed: 1,
        total_travel_distance: 12.4,
        latest_ip_address: '192.168.1.60',
        userInfo: {
            user_digital_passport_type: PassportType.BONJIN,
            level: LevelType.BONJIN,
            magatama_points: 25,
            magatama_bags: 0,
            total_quest_completed: 1,
            total_travel_distance: 12.4,
            is_premium: false,
            prayer_bead: 1,
            sword: 0,
            orge_mask: 0,
        },
    },
    {
        username: 'grace_veteran',
        email: 'grace@tourii.dev',
        discord_id: 'discord_grace_404',
        discord_username: 'GraceVeteran',
        twitter_id: 'twitter_grace',
        twitter_username: 'GraceTouriiPro',
        google_email: 'grace.veteran@gmail.com',
        role: UserRoleType.USER,
        is_premium: true,
        is_banned: false,
        total_quest_completed: 45,
        total_travel_distance: 1234.6,
        latest_ip_address: '192.168.1.70',
        userInfo: {
            user_digital_passport_type: PassportType.AMATSUKAMI,
            level: LevelType.A_CLASS_AMATSUKAMI,
            magatama_points: 2150,
            magatama_bags: 8,
            total_quest_completed: 45,
            total_travel_distance: 1234.6,
            is_premium: true,
            prayer_bead: 25,
            sword: 15,
            orge_mask: 8,
        },
    },
    {
        username: 'henry_banned',
        email: 'henry@tourii.dev',
        discord_id: 'discord_henry_505',
        discord_username: 'HenryBanned',
        role: UserRoleType.USER,
        is_premium: false,
        is_banned: true, // This user is banned
        total_quest_completed: 3,
        total_travel_distance: 45.2,
        latest_ip_address: '192.168.1.80',
        userInfo: {
            user_digital_passport_type: PassportType.BONJIN,
            level: LevelType.BONJIN,
            magatama_points: 75,
            magatama_bags: 0,
            total_quest_completed: 3,
            total_travel_distance: 45.2,
            is_premium: false,
            prayer_bead: 2,
            sword: 0,
            orge_mask: 0,
        },
    },
    {
        username: 'irene_social',
        email: 'irene@tourii.dev',
        discord_id: 'discord_irene_606',
        discord_username: 'IreneSocial',
        twitter_id: 'twitter_irene',
        twitter_username: 'IreneTouriiSocial',
        role: UserRoleType.USER,
        is_premium: false,
        is_banned: false,
        total_quest_completed: 15,
        total_travel_distance: 289.1,
        latest_ip_address: '192.168.1.90',
        userInfo: {
            user_digital_passport_type: PassportType.KUNITSUKAMI,
            level: LevelType.C_CLASS_KUNITSUKAMI,
            magatama_points: 720,
            magatama_bags: 3,
            total_quest_completed: 15,
            total_travel_distance: 289.1,
            is_premium: false,
            prayer_bead: 10,
            sword: 4,
            orge_mask: 2,
        },
    },
    {
        username: 'jack_admin',
        email: 'jack@tourii.dev',
        discord_id: 'discord_jack_707',
        discord_username: 'JackAdmin',
        google_email: 'jack.admin@tourii.dev',
        role: UserRoleType.ADMIN,
        is_premium: true,
        is_banned: false,
        total_quest_completed: 35,
        total_travel_distance: 892.4,
        latest_ip_address: '192.168.1.100',
        userInfo: {
            user_digital_passport_type: PassportType.AMATSUKAMI,
            level: LevelType.S_CLASS_AMATSUKAMI,
            magatama_points: 3500,
            magatama_bags: 12,
            total_quest_completed: 35,
            total_travel_distance: 892.4,
            is_premium: true,
            prayer_bead: 30,
            sword: 20,
            orge_mask: 10,
        },
    },
    {
        username: 'katie_casual',
        email: 'katie@tourii.dev',
        discord_id: 'discord_katie_808',
        discord_username: 'KatieCasual',
        role: UserRoleType.USER,
        is_premium: false,
        is_banned: false,
        total_quest_completed: 6,
        total_travel_distance: 98.7,
        latest_ip_address: '192.168.1.110',
        userInfo: {
            user_digital_passport_type: PassportType.BONJIN,
            level: LevelType.E_CLASS_YOKAI,
            magatama_points: 280,
            magatama_bags: 1,
            total_quest_completed: 6,
            total_travel_distance: 98.7,
            is_premium: false,
            prayer_bead: 4,
            sword: 1,
            orge_mask: 1,
        },
    },
    {
        username: 'liam_elite',
        email: 'liam@tourii.dev',
        discord_id: 'discord_liam_909',
        discord_username: 'LiamElite',
        twitter_id: 'twitter_liam',
        twitter_username: 'LiamTouriiElite',
        google_email: 'liam.elite@gmail.com',
        role: UserRoleType.USER,
        is_premium: true,
        is_banned: false,
        total_quest_completed: 52,
        total_travel_distance: 1567.3,
        latest_ip_address: '192.168.1.120',
        userInfo: {
            user_digital_passport_type: PassportType.YOKAI,
            level: LevelType.S_CLASS_YOKAI,
            magatama_points: 4200,
            magatama_bags: 15,
            total_quest_completed: 52,
            total_travel_distance: 1567.3,
            is_premium: true,
            prayer_bead: 40,
            sword: 25,
            orge_mask: 15,
        },
    },
];

async function seedEnhancedUsers() {
    logger.log('🌱 Starting enhanced user seeding...');

    let createdCount = 0;

    for (const userTemplate of ENHANCED_USER_TEMPLATES) {
        try {
            // Check if user already exists
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username: userTemplate.username },
                        { email: userTemplate.email },
                        { discord_id: userTemplate.discord_id },
                    ],
                },
            });

            if (existingUser) {
                logger.log(`⏭️  User ${userTemplate.username} already exists, skipping...`);
                continue;
            }

            // Create user with nested user_info
            const user = await prisma.user.create({
                data: {
                    username: userTemplate.username,
                    email: userTemplate.email,
                    discord_id: userTemplate.discord_id,
                    discord_username: userTemplate.discord_username,
                    twitter_id: userTemplate.twitter_id,
                    twitter_username: userTemplate.twitter_username,
                    google_email: userTemplate.google_email,
                    password: 'hashed_password_placeholder', // In real app, use proper hashing
                    role: userTemplate.role,
                    is_premium: userTemplate.is_premium,
                    is_banned: userTemplate.is_banned,
                    total_quest_completed: userTemplate.total_quest_completed,
                    total_travel_distance: userTemplate.total_travel_distance,
                    latest_ip_address: userTemplate.latest_ip_address,
                    perks_wallet_address: `wallet_${userTemplate.username}_${Date.now()}`,
                    passport_wallet_address: `passport_${userTemplate.username}_${Date.now()}`,
                    registered_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
                    discord_joined_at: new Date(
                        Date.now() - Math.random() * 200 * 24 * 60 * 60 * 1000,
                    ), // Random date within last 200 days

                    // Create user_info as nested relation
                    user_info: {
                        create: {
                            digital_passport_address: `passport_addr_${userTemplate.username}`,
                            log_nft_address: `log_nft_addr_${userTemplate.username}`,
                            passport_token_id: `token_${userTemplate.username}_${Date.now()}`,
                            user_digital_passport_type:
                                userTemplate.userInfo.user_digital_passport_type,
                            level: userTemplate.userInfo.level,
                            magatama_points: userTemplate.userInfo.magatama_points,
                            magatama_bags: userTemplate.userInfo.magatama_bags,
                            total_quest_completed: userTemplate.userInfo.total_quest_completed,
                            total_travel_distance: userTemplate.userInfo.total_travel_distance,
                            is_premium: userTemplate.userInfo.is_premium,
                            prayer_bead: userTemplate.userInfo.prayer_bead,
                            sword: userTemplate.userInfo.sword,
                            orge_mask: userTemplate.userInfo.orge_mask,
                            discount_rate: userTemplate.is_premium ? 0.1 : 0.0, // 10% discount for premium users
                        },
                    },
                },
                include: {
                    user_info: true,
                },
            });

            createdCount++;
            logger.log(
                `✅ Created user: ${user.username} (${user.role}) with ${user.user_info?.magatama_points} magatama points`,
            );
        } catch (error) {
            logger.error(`❌ Failed to create user ${userTemplate.username}:`, error);
        }
    }

    logger.log(`🎉 Enhanced user seeding completed! Created ${createdCount} users.`);
}

async function main() {
    try {
        await seedEnhancedUsers();
    } catch (error) {
        logger.error('❌ Enhanced user seeding failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

export { seedEnhancedUsers };

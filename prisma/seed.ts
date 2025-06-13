import {
    AchievementType,
    BlockchainType,
    CheckInMethod,
    ItemStatus,
    ItemType,
    KendamaSeason,
    LevelType,
    OnchainItemStatus,
    OnchainItemType,
    PassportType,
    PrismaClient,
    QuestType,
    RewardType,
    StoryStatus,
    TaskStatus,
    TaskTheme,
    TaskType,
    UserRoleType,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library'; // For explicit Decimal type if needed

// If you use password hashing (recommended!), import your hashing library
// import bcrypt from 'bcrypt';
// const SALT_ROUNDS = 10; // Example salt rounds

const prisma = new PrismaClient();

async function main() {
    const roleUser = await prisma.discord_roles.upsert({
        where: {
            role_id: BigInt('100000000000000001'),
        }, // Use BigInt constructor
        create: {
            role_id: BigInt('100000000000000001'), // Use BigInt constructor
            name: 'Tourii User',
            ins_user_id: 'system-seed',
        },
        update: {},
    });

    const _roleModerator = await prisma.discord_roles.upsert({
        where: {
            role_id: BigInt('100000000000000002'),
        },
        create: {
            role_id: BigInt('100000000000000002'),
            name: 'Tourii Moderator',
            ins_user_id: 'system-seed',
        },
        update: {},
    });

    const roleAdmin = await prisma.discord_roles.upsert({
        where: {
            role_id: BigInt('100000000000000003'),
        },
        create: {
            role_id: BigInt('100000000000000003'),
            name: 'Tourii Admin',
            ins_user_id: 'system-seed',
        },
        update: {},
    });
    await prisma.level_requirement_master.upsert({
        where: {
            level: LevelType.BONJIN,
        },
        create: {
            level: LevelType.BONJIN,
            discord_role_id: roleUser.role_id.toString(), // Assuming role_id is stored as String in master
            min_get_magatama_points: 0,
            max_get_magatama_points: 99,
            total_onchain_item: 0,
            prayer_bead: 0,
            sword: 0,
            orge_mask: 0,
            ins_user_id: 'system-seed',
        },
        update: {},
    });
    await prisma.level_requirement_master.upsert({
        where: {
            level: LevelType.E_CLASS_AMATSUKAMI,
        },
        create: {
            level: LevelType.E_CLASS_AMATSUKAMI,
            discord_role_id: roleUser.role_id.toString(),
            min_get_magatama_points: 100,
            max_get_magatama_points: 499,
            total_onchain_item: 1,
            prayer_bead: 1,
            sword: 0,
            orge_mask: 0,
            ins_user_id: 'system-seed',
        },
        update: {},
    });
    await prisma.kendama_random_range.upsert({
        where: {
            season: KendamaSeason.NORMAL,
        },
        create: {
            season: KendamaSeason.NORMAL,
            landed: new Decimal('0.7'), // Use Decimal constructor or string
            missed: new Decimal('0.3'),
            win_rate: new Decimal('0.6'),
            ins_user_id: 'system-seed',
        },
        update: {
            landed: new Decimal('0.7'),
            missed: new Decimal('0.3'),
            win_rate: new Decimal('0.6'),
        },
    });
    await prisma.kendama_random_range.upsert({
        where: {
            season: KendamaSeason.EVENT,
        },
        create: {
            season: KendamaSeason.EVENT,
            landed: new Decimal('0.8'),
            missed: new Decimal('0.2'),
            win_rate: new Decimal('0.75'),
            ins_user_id: 'system-seed',
        },
        update: {
            landed: new Decimal('0.8'),
            missed: new Decimal('0.2'),
            win_rate: new Decimal('0.75'),
        },
    });
    const catalogItemPassport = await prisma.onchain_item_catalog.upsert({
        where: {
            onchain_item_id: 'CATALOG-PASSPORT-001',
        }, // Using a custom unique ID for upsert
        create: {
            onchain_item_id: 'CATALOG-PASSPORT-001',
            item_type: OnchainItemType.DIGITAL_PASSPORT,
            blockchain_type: BlockchainType.VARA,
            nft_name: 'Tourii Bonjin Passport',
            nft_description: 'Standard Digital Passport for Tourii explorers.',
            image_url: 'https://cdn.tourii.app/images/passport_bonjin.png',
            contract_address: '0xContractAddressPassport',
            token_id: '1', // Example Token ID
            attributes: [], // JSON array
            release_date: new Date('2024-01-01T00:00:00Z'),
            max_supply: 0, // Unlimited
            ins_user_id: 'system-seed',
        },
        update: {},
    });
    const catalogItemPerk = await prisma.onchain_item_catalog.upsert({
        where: {
            onchain_item_id: 'CATALOG-PERK-001',
        },
        create: {
            onchain_item_id: 'CATALOG-PERK-001',
            item_type: OnchainItemType.PERK,
            blockchain_type: BlockchainType.CAMINO,
            nft_name: 'Discount Voucher',
            nft_description: '10% off at participating locations.',
            image_url: 'https://cdn.tourii.app/images/perk_voucher.png',
            contract_address: '0xContractAddressPerk',
            metadata_url: 'https://metadata.tourii.app/perk/001',
            attributes: [
                {
                    trait_type: 'Discount',
                    value: '10%',
                },
            ],
            release_date: new Date('2024-05-01T00:00:00Z'),
            expiry_date: new Date('2025-12-31T23:59:59Z'),
            max_supply: 1000,
            ins_user_id: 'system-seed',
        },
        update: {},
    });
    const _catalogItemLogNFT = await prisma.onchain_item_catalog.upsert({
        where: {
            onchain_item_id: 'CATALOG-LOGNFT-001',
        },
        create: {
            onchain_item_id: 'CATALOG-LOGNFT-001',
            item_type: OnchainItemType.LOG_NFT,
            blockchain_type: BlockchainType.VARA,
            nft_name: 'Explorer Log Entry',
            nft_description: 'Commemorative Log NFT for completing the Prologue.',
            image_url: 'https://cdn.tourii.app/images/log_nft_prologue.png',
            contract_address: '0xContractAddressLogNFT',
            metadata_url: 'https://metadata.tourii.app/log/001',
            attributes: [
                {
                    trait_type: 'Saga',
                    value: 'Prologue',
                },
            ],
            release_date: new Date('2024-01-01T00:00:00Z'),
            max_supply: 0, // Unlimited
            ins_user_id: 'system-seed',
        },
        update: {},
    });
    // IMPORTANT: Replace "hashed_password_example" with actual hashed passwords
    // using a library like bcrypt in a real scenario.
    // const hashedPassword = await bcrypt.hash('password123', SALT_ROUNDS);
    const hashedPasswordPlaceholder = 'hashed_password_example_needs_replace'; // Placeholder

    const userAlice = await prisma.user.upsert({
        where: {
            username: 'alice',
        },
        create: {
            username: 'alice',
            email: 'alice@example.com',
            password: hashedPasswordPlaceholder,
            discord_id: 'discord_alice_123',
            discord_username: 'AliceDiscord',
            twitter_id: 'twitter_alice_456',
            twitter_username: 'AliceTwitter',
            google_email: 'alice.google@example.com',
            passport_wallet_address: '0xWalletAlicePassport123',
            encrypted_private_key: 'encrypted_key',
            perks_wallet_address: '0xWalletAlicePerks456',
            latest_ip_address: '192.168.1.100',
            is_premium: false,
            role: UserRoleType.USER,
            registered_at: new Date('2024-04-01T10:00:00Z'),
            discord_joined_at: new Date('2024-04-01T10:05:00Z'),
            ins_user_id: 'system-seed',
        },
        update: {
            // Minimal update if user exists
            latest_ip_address: '192.168.1.101',
            upd_user_id: 'system-seed',
            upd_date_time: new Date(),
        },
    });

    const userBobAdmin = await prisma.user.upsert({
        where: {
            username: 'bobadmin',
        },
        create: {
            username: 'bobadmin',
            email: 'bob.admin@example.com',
            password: hashedPasswordPlaceholder,
            discord_id: 'discord_bob_789',
            discord_username: 'BobAdminDiscord',
            passport_wallet_address: '0xWalletBobPassport789',
            encrypted_private_key: 'encrypted_key',
            perks_wallet_address: '0xWalletBobPerks101',
            is_premium: true,
            role: UserRoleType.ADMIN,
            registered_at: new Date('2024-03-15T09:00:00Z'),
            discord_joined_at: new Date('2024-03-15T09:05:00Z'),
            ins_user_id: 'system-seed',
        },
        update: {
            latest_ip_address: '10.0.0.5',
            upd_user_id: 'system-seed',
            upd_date_time: new Date(),
        },
    });
    await prisma.user_info.upsert({
        where: {
            user_id: userAlice.user_id,
        },
        create: {
            user_id: userAlice.user_id,
            digital_passport_address: userAlice.passport_wallet_address ?? '0xDefaultPassportAlice',
            log_nft_address: '0xLogNFTAddressAlice',
            user_digital_passport_type: PassportType.BONJIN,
            level: LevelType.BONJIN,
            magatama_points: 50,
            total_quest_completed: 2,
            total_travel_distance: 15.5,
            is_premium: userAlice.is_premium,
            ins_user_id: 'system-seed',
        },
        update: {
            // Update relevant fields if user_info already exists
            magatama_points: 55,
            total_quest_completed: 3,
            upd_user_id: 'system-seed',
            upd_date_time: new Date(),
        },
    });
    await prisma.user_info.upsert({
        where: {
            user_id: userBobAdmin.user_id,
        },
        create: {
            user_id: userBobAdmin.user_id,
            digital_passport_address:
                userBobAdmin.passport_wallet_address ?? '0xDefaultPassportBob',
            log_nft_address: '0xLogNFTAddressBob',
            user_digital_passport_type: PassportType.AMATSUKAMI,
            level: LevelType.E_CLASS_AMATSUKAMI,
            magatama_points: 1200,
            total_quest_completed: 25,
            total_travel_distance: 250.8,
            is_premium: userBobAdmin.is_premium,
            prayer_bead: 5,
            sword: 1,
            ins_user_id: 'system-seed',
        },
        update: {},
    });
    await prisma.user_achievement.create({
        data: {
            user_id: userAlice.user_id,
            achievement_name: 'First Steps',
            achievement_desc: 'Completed the tutorial quest.',
            achievement_type: AchievementType.MILESTONE,
            magatama_point_awarded: 10,
            ins_user_id: 'system-seed',
        },
    });
    await prisma.user_achievement.create({
        data: {
            user_id: userAlice.user_id,
            achievement_name: 'Community Helper',
            achievement_desc: 'Helped another user on Discord.',
            achievement_type: AchievementType.COMMUNITY,
            magatama_point_awarded: 5,
            ins_user_id: 'system-seed',
        },
    });
    await prisma.user_onchain_item.create({
        data: {
            user_id: userAlice.user_id,
            item_type: OnchainItemType.DIGITAL_PASSPORT,
            item_txn_hash: userAlice.passport_wallet_address ?? '0xDefaultPassportAlice',
            blockchain_type: BlockchainType.VARA,
            onchain_item_id: catalogItemPassport.onchain_item_id,
            status: OnchainItemStatus.ACTIVE,
            minted_at: new Date('2024-04-01T10:10:00Z'),
            ins_user_id: 'system-seed',
        },
    });
    await prisma.user_onchain_item.create({
        data: {
            user_id: userBobAdmin.user_id,
            item_type: OnchainItemType.PERK,
            item_txn_hash: '0xTxBobPerkMint9876543210',
            blockchain_type: BlockchainType.CAMINO,
            onchain_item_id: catalogItemPerk.onchain_item_id,
            status: OnchainItemStatus.PENDING, // Example pending status
            ins_user_id: 'system-seed',
        },
    });
    await prisma.user_item_claim_log.create({
        data: {
            user_id: userAlice.user_id,
            offchain_item_name: 'Welcome Bonus Magatama',
            item_amount: 50,
            item_details: 'Initial bonus upon registration.',
            type: ItemType.OFFCHAIN,
            claimed_at: new Date('2024-04-01T10:01:00Z'),
            status: ItemStatus.SUCCESS,
            ins_user_id: 'system-seed',
        },
    });
    await prisma.user_item_claim_log.create({
        data: {
            user_id: userBobAdmin.user_id,
            onchain_item_id: catalogItemPerk.onchain_item_id,
            item_amount: 1,
            item_details: 'Claimed Discount Voucher Perk.',
            type: ItemType.ONCHAIN,
            claimed_at: new Date('2024-05-02T11:00:00Z'),
            status: ItemStatus.FAILED, // Example failed claim
            error_msg: 'Insufficient funds for gas fees.',
            ins_user_id: 'system-seed',
        },
    });
    // Using create as upsert needs a unique key for the relation itself
    // If re-running seed causes duplicates, consider deleting existing roles first
    // await prisma.discord_user_roles.deleteMany({}); // Example delete
    await prisma.discord_user_roles.create({
        data: {
            user_id: userAlice.user_id,
            role_id: roleUser.role_id,
            ins_user_id: 'system-seed',
        },
    });
    await prisma.discord_user_roles.create({
        data: {
            user_id: userBobAdmin.user_id,
            role_id: roleAdmin.role_id,
            ins_user_id: 'system-seed',
        },
    });
    // Bob is also a regular user
    await prisma.discord_user_roles.create({
        data: {
            user_id: userBobAdmin.user_id,
            role_id: roleUser.role_id,
            ins_user_id: 'system-seed',
        },
    });
    await prisma.discord_activity_log.create({
        data: {
            user_id: userAlice.user_id,
            activity_type: 'message_sent',
            activity_details: 'Posted in #general channel',
            magatama_point_awarded: 1,
            ins_user_id: 'system-seed',
        },
    });
    await prisma.discord_rewarded_roles.create({
        data: {
            user_id: userBobAdmin.user_id,
            role_id: roleAdmin.role_id,
            magatama_point_awarded: 100, // Points for achieving admin role (example)
            ins_user_id: 'system-seed',
        },
    });
    await prisma.user_invite_log.create({
        data: {
            user_id: userBobAdmin.user_id, // Bob invited someone
            invitee_discord_id: 'invited_user_discord_111',
            // invitee_user_id will be filled when the invitee registers
            magatama_point_awarded: 50, // Points for successful referral
            ins_user_id: 'system-seed',
        },
    });
    const storyPrologue = await prisma.story.create({
        data: {
            saga_name: 'Prologue: The Awakening',
            saga_desc: 'Begin your journey and discover the world of Tourii.',
            location: 'Digital Realm',
            order: 1,
            is_prologue: true,
            is_selected: true, // Make it the default selected
            ins_user_id: 'system-seed',
        },
    });
    const storyBungo = await prisma.story.create({
        data: {
            saga_name: 'Bungo Ono Tales',
            saga_desc: 'Explore the legends and nature of Bungo Ono.',
            background_media: 'https://cdn.tourii.app/images/bungo_bg.jpg',
            map_image: 'https://cdn.tourii.app/images/bungo_map.jpg',
            location: 'Bungo Ono, Oita',
            order: 2,
            is_prologue: false,
            ins_user_id: 'system-seed',
        },
    });
    const routeBungoMain = await prisma.model_route.create({
        data: {
            story_id: storyBungo.story_id,
            route_name: 'Sacred Falls Trail',
            region: 'Bungo Ono',
            region_latitude: 32.9795,
            region_longitude: 131.4172,
            recommendation: ['Nature', 'Local Food', 'Photography'],
            ins_user_id: 'system-seed',
        },
    });
    const chapterBungo1 = await prisma.story_chapter.create({
        data: {
            story_id: storyBungo.story_id,
            tourist_spot_id: 'HARAJIRI-001', // We'll update this after creating the spot
            chapter_number: '1-1',
            chapter_title: 'The Roar of Harajiri',
            chapter_desc: 'Witness the power of the falls and learn its legend.',
            chapter_image: 'https://cdn.tourii.app/images/bungo_ch1.jpg',
            character_name_list: ['Local Elder', 'Kagura'],
            real_world_image: 'https://cdn.tourii.app/images/harajiri_main.jpg',
            chapter_video_url: 'https://cdn.tourii.app/videos/bungo_ch1.mp4',
            chapter_video_mobile_url: 'https://cdn.tourii.app/videos/bungo_ch1_mobile.mp4',
            chapter_pdf_url: 'https://cdn.tourii.app/pdfs/bungo_ch1.pdf',
            is_unlocked: true,
            ins_user_id: 'system-seed',
        },
    });
    const spotHarajiri = await prisma.tourist_spot.create({
        data: {
            model_route_id: routeBungoMain.model_route_id,
            story_chapter_id: chapterBungo1.story_chapter_id,
            tourist_spot_name: 'Harajiri Falls',
            tourist_spot_desc: 'Known as the "Niagara of the East", a majestic waterfall.',
            latitude: 32.9795,
            longitude: 131.4172,
            address: 'Harajiri, Ogatamachi, Bungoono, Oita 879-6631, Japan',
            tourist_spot_hashtag: ['#Waterfall', '#BungoOno', '#Nature'],
            image_set: {
                main: 'https://cdn.tourii.app/images/harajiri_main.jpg',
                small: [
                    'https://cdn.tourii.app/images/harajiri_1.jpg',
                    'https://cdn.tourii.app/images/harajiri_2.jpg',
                ],
            },
            ins_user_id: 'system-seed',
        },
    });
    await prisma.story_chapter.update({
        where: {
            story_chapter_id: chapterBungo1.story_chapter_id,
        },
        data: {
            tourist_spot_id: spotHarajiri.tourist_spot_id,
        },
    });
    const chapterBungo2 = await prisma.story_chapter.create({
        data: {
            story_id: storyBungo.story_id,
            tourist_spot_id: 'CAVE-001', // We'll update this after creating the spot
            chapter_number: '1-2',
            chapter_title: 'The Cave of Wisdom',
            chapter_desc: 'Discover the ancient Buddhist carvings.',
            chapter_image: 'https://cdn.tourii.app/images/bungo_ch2.jpg',
            character_name_list: ['Local Guide', 'Monk'],
            real_world_image: 'https://cdn.tourii.app/images/cave_main.jpg',
            chapter_video_url: 'https://cdn.tourii.app/videos/bungo_ch2.mp4',
            chapter_video_mobile_url: 'https://cdn.tourii.app/videos/bungo_ch2_mobile.mp4',
            chapter_pdf_url: 'https://cdn.tourii.app/pdfs/bungo_ch2.pdf',
            is_unlocked: true,
            ins_user_id: 'system-seed',
        },
    });
    const spotCave = await prisma.tourist_spot.create({
        data: {
            model_route_id: routeBungoMain.model_route_id,
            story_chapter_id: chapterBungo2.story_chapter_id,
            tourist_spot_name: 'Fukiji Cave Cliff Buddhas',
            tourist_spot_desc: 'Ancient Buddhist carvings in a cliff face.',
            latitude: 33.03,
            longitude: 131.4,
            address: 'Asajimachi Imazato, Bungoono, Oita 879-6223, Japan',
            tourist_spot_hashtag: ['#History', '#Buddhism', '#Cave'],
            image_set: {
                main: 'https://cdn.tourii.app/images/cave_main.jpg',
                small: [],
            },
            ins_user_id: 'system-seed',
        },
    });
    await prisma.story_chapter.update({
        where: {
            story_chapter_id: chapterBungo2.story_chapter_id,
        },
        data: {
            tourist_spot_id: spotCave.tourist_spot_id,
        },
    });
    const _chapterPrologue1 = await prisma.story_chapter.create({
        data: {
            story_id: storyPrologue.story_id,
            tourist_spot_id: 'DIGITAL-REALM-01', // Placeholder as prologue might not map 1:1
            chapter_number: '0-1',
            chapter_title: 'Your First Log',
            chapter_desc: 'Learn how to navigate and log your adventures.',
            chapter_image: 'https://cdn.tourii.app/images/prologue_ch1.jpg',
            character_name_list: ['Guide Bot'],
            real_world_image: 'https://cdn.tourii.app/images/prologue_real1.jpg', // Maybe generic app screen
            chapter_video_url: 'https://cdn.tourii.app/videos/prologue_ch1.mp4',
            chapter_video_mobile_url: 'https://cdn.tourii.app/videos/prologue_ch1_mobile.mp4',
            chapter_pdf_url: 'https://cdn.tourii.app/pdfs/prologue_ch1.pdf',
            is_unlocked: true,
            ins_user_id: 'system-seed',
        },
    });
    const _chapterBungo1 = await prisma.story_chapter.create({
        data: {
            story_id: storyBungo.story_id,
            tourist_spot_id: spotHarajiri.tourist_spot_id,
            chapter_number: '1-1',
            chapter_title: 'The Roar of Harajiri',
            chapter_desc: 'Witness the power of the falls and learn its legend.',
            chapter_image: 'https://cdn.tourii.app/images/bungo_ch1.jpg',
            character_name_list: ['Local Elder', 'Kagura'],
            real_world_image: 'https://cdn.tourii.app/images/harajiri_main.jpg',
            chapter_video_url: 'https://cdn.tourii.app/videos/bungo_ch1.mp4',
            chapter_video_mobile_url: 'https://cdn.tourii.app/videos/bungo_ch1_mobile.mp4',
            chapter_pdf_url: 'https://cdn.tourii.app/pdfs/bungo_ch1.pdf',
            is_unlocked: true,
            ins_user_id: 'system-seed',
        },
    });
    const questHarajiriPhoto = await prisma.quest.create({
        data: {
            tourist_spot_id: spotHarajiri.tourist_spot_id,
            quest_name: 'Capture the Falls',
            quest_desc: 'Take a beautiful photo of Harajiri Falls.',
            quest_type: QuestType.TRAVEL_TO_EARN,
            quest_image: 'https://cdn.tourii.app/images/quest_harajiri_photo.jpg',
            is_unlocked: true,
            is_premium: false,
            total_magatama_point_awarded: 25,
            reward_type: RewardType.SOCIAL_RECOGNITION,
            reward_items: [
                {
                    // Example JSON structure
                    item_name: 'Featured Photo',
                    item_desc: 'Chance to be featured on Tourii social media',
                    item_image: 'https://cdn.tourii.app/images/reward_social.png',
                },
            ],
            ins_user_id: 'system-seed',
        },
    });
    const questCaveQuiz = await prisma.quest.create({
        data: {
            tourist_spot_id: spotCave.tourist_spot_id,
            quest_name: 'Cave History Quiz',
            quest_desc: 'Answer questions about the Fukiji Cave Buddhas.',
            quest_type: QuestType.EARN_TO_TRAVEL, // Example type
            is_unlocked: true,
            is_premium: true, // Example premium quest
            total_magatama_point_awarded: 50,
            reward_type: RewardType.HIDDEN_PERKS,
            reward_items: [
                {
                    item_name: 'Extended Cave Tour Info',
                    item_desc: 'Unlock extra details about the cave history.',
                    item_image: 'https://cdn.tourii.app/images/reward_info.png',
                },
            ],
            ins_user_id: 'system-seed',
        },
    });
    const taskHarajiriUpload = await prisma.quest_task.create({
        data: {
            quest_id: questHarajiriPhoto.quest_id,
            task_theme: TaskTheme.NATURE,
            task_type: TaskType.PHOTO_UPLOAD,
            task_name: 'Upload Waterfall Photo',
            task_desc: 'Upload your best photo of Harajiri Falls!',
            is_unlocked: true,
            required_action: '{ "min_resolution": "1024x768" }', // JSON as string or Prisma JSON type
            select_options: [], // Empty array for non-SELECT_OPTION type
            group_activity_members: [], // Empty array
            anti_cheat_rules: {
                claim_once: true,
            }, // JSON object
            magatama_point_awarded: 25,
            ins_user_id: 'system-seed',
        },
    });
    const _taskCaveQuestion1 = await prisma.quest_task.create({
        data: {
            quest_id: questCaveQuiz.quest_id,
            task_theme: TaskTheme.LOCAL_CULTURE,
            task_type: TaskType.SELECT_OPTION,
            task_name: 'Quiz Question 1',
            task_desc: 'Approximately how old are the carvings?',
            is_unlocked: true,
            required_action: '{}', // No specific action required
            select_options: [
                // Example JSON array for options
                {
                    option_text: '100 years',
                    answer_flag: false,
                },
                {
                    option_text: '500 years',
                    answer_flag: false,
                },
                {
                    option_text: 'Over 1000 years',
                    answer_flag: true,
                },
            ],
            group_activity_members: [],
            anti_cheat_rules: {
                max_attempts: 1,
            },
            magatama_point_awarded: 25,
            ins_user_id: 'system-seed',
        },
    });
    const _taskCaveQuestion2 = await prisma.quest_task.create({
        data: {
            quest_id: questCaveQuiz.quest_id,
            task_theme: TaskTheme.LOCAL_CULTURE,
            task_type: TaskType.ANSWER_TEXT,
            task_name: 'Quiz Question 2',
            task_desc: 'What is the name of the main Buddha depicted?',
            is_unlocked: true, // Assuming tasks unlock sequentially or together
            required_action: '{}',
            select_options: [],
            group_activity_members: [],
            anti_cheat_rules: {
                only_once: true,
            },
            magatama_point_awarded: 25,
            ins_user_id: 'system-seed',
        },
    });
    await prisma.user_story_log.create({
        data: {
            user_id: userAlice.user_id,
            story_chapter_id: storyPrologue.story_id, // Assuming linking to Saga ID directly for overall progress
            status: StoryStatus.COMPLETED,
            unlocked_at: new Date('2024-04-01T10:15:00Z'),
            finished_at: new Date('2024-04-01T10:45:00Z'),
            ins_user_id: 'system-seed',
        },
    });
    await prisma.user_story_log.create({
        data: {
            user_id: userAlice.user_id,
            story_chapter_id: storyBungo.story_id,
            status: StoryStatus.IN_PROGRESS,
            unlocked_at: new Date('2024-05-01T14:00:00Z'),
            ins_user_id: 'system-seed',
        },
    });
    await prisma.user_task_log.create({
        data: {
            user_id: userAlice.user_id,
            quest_id: questHarajiriPhoto.quest_id,
            task_id: taskHarajiriUpload.quest_task_id, // Link to the specific task
            status: TaskStatus.COMPLETED,
            action: TaskType.PHOTO_UPLOAD, // Action performed for this log
            submission_data: {
                image_url: 'https://useruploads.tourii.app/alice_harajiri.jpg',
            },
            completed_at: new Date('2024-05-02T15:30:00Z'),
            claimed_at: new Date('2024-05-02T15:31:00Z'),
            total_magatama_point_awarded: questHarajiriPhoto.total_magatama_point_awarded,
            ins_user_id: 'system-seed',
        },
    });
    await prisma.user_task_log.create({
        data: {
            user_id: userAlice.user_id,
            quest_id: questCaveQuiz.quest_id,
            task_id: _taskCaveQuestion1.quest_task_id, // Link to the specific task
            status: TaskStatus.ONGOING,
            action: TaskType.SELECT_OPTION, // Started the quiz
            ins_user_id: 'system-seed',
        },
    });
    await prisma.user_travel_log.create({
        data: {
            user_id: userAlice.user_id,
            quest_id: questHarajiriPhoto.quest_id,
            task_id: taskHarajiriUpload.quest_task_id, // Link to the specific task
            tourist_spot_id: spotHarajiri.tourist_spot_id,
            user_longitude: spotHarajiri.longitude + 0.0001, // Slightly offset example
            user_latitude: spotHarajiri.latitude - 0.0001,
            travel_distance_from_target: 15.2, // Meters
            travel_distance: 5.2, // Kilometers for this leg/activity
            check_in_method: CheckInMethod.GPS,
            detected_fraud: false,
            ins_user_id: 'system-seed',
        },
    });
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const cleanDb = async () => {
    const tableNames = [
        'user_achievement',
        'user_info',
        'user_invite_log',
        'user_item_claim_log',
        'user_story_log',
        'user_quest_log',
        'user_travel_log',
        'user_onchain_item',
        'discord_activity_log',
        'discord_user_roles',
        'user',
        'discord_rewarded_roles',
        'discord_roles',
        'quest_task',
        'quest',
        'tourist_spot',
        'story_chapter',
        'story',
        'model_route',
        'onchain_item_catalog',
        'id_sequence',
        'level_requirement_master',
        'kendama_random_range',
    ];

    try {
        const quotedTableNames = tableNames.map((name) => `"${name}"`).join(', ');
        await prisma.$executeRawUnsafe(
            `TRUNCATE TABLE ${quotedTableNames} RESTART IDENTITY CASCADE`,
        );
    } catch (error) {
        console.error('Error cleaning the database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};

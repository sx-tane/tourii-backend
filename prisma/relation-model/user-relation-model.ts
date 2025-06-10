import { Prisma } from '@prisma/client';

export type UserRelationModel = Prisma.userGetPayload<{
    include: {
        user_info: true;
        user_achievements: true;
        user_onchain_item: true;
        user_item_claim_log: true;
        user_story_log: true;
        user_quest_log: true;
        user_travel_log: true;
        discord_activity_log: true;
        discord_user_roles: true;
        discord_rewarded_roles: true;
        user_invite_log: true;
    };
}>;

import type { user_cart, user, onchain_item_catalog } from '@prisma/client';

export type CartRelationModel = user_cart & {
    user?: {
        user_id: string;
        username: string;
        email?: string | null;
    } | null;
    product?: onchain_item_catalog | null;
};
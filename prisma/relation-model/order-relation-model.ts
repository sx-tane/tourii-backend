import type { user_order, user_order_item, user, onchain_item_catalog } from '@prisma/client';

export type OrderRelationModel = user_order & {
    user?: {
        user_id: string;
        username: string;
        email?: string | null;
    } | null;
    order_items?: (user_order_item & {
        product?: onchain_item_catalog | null;
    })[] | null;
};
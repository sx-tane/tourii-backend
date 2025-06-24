import { CartEntity } from '@app/core/domain/ecommerce/cart.entity';
import { OnchainItemCatalog } from '@app/core/domain/catalog/onchain-item-catalog.entity';
import { UserEntity } from '@app/core/domain/user/user.entity';
import type { Prisma } from '@prisma/client';
import type { CartRelationModel } from 'prisma/relation-model/cart-relation-model';

export class CartMapper {
    static cartEntityToPrismaInput(cartEntity: CartEntity): Prisma.user_cartUncheckedCreateInput {
        return {
            user_id: cartEntity.userId,
            product_id: cartEntity.productId,
            quantity: cartEntity.quantity,
            added_at: cartEntity.addedAt,
            del_flag: cartEntity.delFlag,
            ins_user_id: cartEntity.insUserId,
            ins_date_time: cartEntity.insDateTime,
            upd_user_id: cartEntity.updUserId,
            upd_date_time: cartEntity.updDateTime,
            request_id: cartEntity.requestId ?? null,
        };
    }

    static prismaModelToCartEntity(prismaModel: CartRelationModel): CartEntity {
        return new CartEntity(
            {
                userId: prismaModel.user_id,
                productId: prismaModel.product_id,
                quantity: prismaModel.quantity,
                addedAt: prismaModel.added_at,
                delFlag: prismaModel.del_flag,
                insUserId: prismaModel.ins_user_id,
                insDateTime: prismaModel.ins_date_time,
                updUserId: prismaModel.upd_user_id,
                updDateTime: prismaModel.upd_date_time,
                requestId: prismaModel.request_id ?? undefined,
                user: prismaModel.user ? CartMapper.prismaUserToUserEntity(prismaModel.user) : undefined,
                product: prismaModel.product ? CartMapper.prismaProductToOnchainItemCatalog(prismaModel.product) : undefined,
            },
            prismaModel.cart_id,
        );
    }

    private static prismaUserToUserEntity(prismaUser: any): UserEntity {
        // Create a minimal user entity for cart relations
        return new UserEntity(
            {
                username: prismaUser.username ?? '',
                password: '', // Not needed for cart display
                perksWalletAddress: '',
                isPremium: false,
                totalQuestCompleted: 0,
                totalTravelDistance: 0,
                role: 'USER' as any,
                registeredAt: new Date(),
                discordJoinedAt: new Date(),
                isBanned: false,
                delFlag: false,
                insUserId: '',
                insDateTime: new Date(),
                updUserId: '',
                updDateTime: new Date(),
                email: prismaUser.email,
            },
            prismaUser.user_id,
        );
    }

    private static prismaProductToOnchainItemCatalog(prismaProduct: any): OnchainItemCatalog {
        return new OnchainItemCatalog(
            {
                itemType: prismaProduct.item_type,
                blockchainType: prismaProduct.blockchain_type ?? 'UNKNOWN',
                nftName: prismaProduct.nft_name,
                nftDescription: prismaProduct.nft_description,
                imageUrl: prismaProduct.image_url,
                contractAddress: prismaProduct.contract_address ?? '',
                tokenId: prismaProduct.token_id,
                metadataUrl: prismaProduct.metadata_url,
                attributes: prismaProduct.attributes ?? [],
                releaseDate: prismaProduct.release_date,
                expiryDate: prismaProduct.expiry_date,
                maxSupply: prismaProduct.max_supply,
                delFlag: prismaProduct.del_flag,
                insUserId: prismaProduct.ins_user_id,
                insDateTime: prismaProduct.ins_date_time,
                updUserId: prismaProduct.upd_user_id,
                updDateTime: prismaProduct.upd_date_time,
                requestId: prismaProduct.request_id,
            },
            prismaProduct.onchain_item_id,
        );
    }
}
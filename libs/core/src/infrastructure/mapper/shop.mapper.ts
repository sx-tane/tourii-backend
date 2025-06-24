import { OnchainItemCatalog } from '@app/core/domain/catalog/onchain-item-catalog.entity';
import type { onchain_item_catalog } from '@prisma/client';

export class ShopMapper {
    static prismaModelToOnchainItemCatalog(prismaModel: onchain_item_catalog): OnchainItemCatalog {
        return new OnchainItemCatalog(
            {
                itemType: prismaModel.item_type,
                blockchainType: prismaModel.blockchain_type,
                nftName: prismaModel.nft_name,
                nftDescription: prismaModel.nft_description,
                imageUrl: prismaModel.image_url,
                contractAddress: prismaModel.contract_address,
                tokenId: prismaModel.token_id ?? undefined,
                metadataUrl: prismaModel.metadata_url ?? undefined,
                attributes: prismaModel.attributes || [],
                releaseDate: prismaModel.release_date ?? undefined,
                expiryDate: prismaModel.expiry_date ?? undefined,
                maxSupply: prismaModel.max_supply ?? undefined,
                delFlag: prismaModel.del_flag,
                insUserId: prismaModel.ins_user_id,
                insDateTime: prismaModel.ins_date_time,
                updUserId: prismaModel.upd_user_id,
                updDateTime: prismaModel.upd_date_time,
                requestId: prismaModel.request_id ?? undefined,
            },
            prismaModel.onchain_item_id,
        );
    }
}
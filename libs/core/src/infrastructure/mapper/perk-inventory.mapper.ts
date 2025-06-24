import { Injectable } from '@nestjs/common';
import type { user_perk_inventory, user, onchain_item_catalog, perk_reservation, Prisma } from '@prisma/client';
import { PerkInventoryEntity } from '../../domain/perks/perk-inventory.entity';
import { UserEntity } from '../../domain/user/user.entity';
import { OnchainItemCatalog } from '../../domain/catalog/onchain-item-catalog.entity';
import { PerkReservationEntity } from '../../domain/perks/perk-reservation.entity';

type PerkInventoryWithRelations = user_perk_inventory & {
    user?: Pick<user, 'user_id' | 'username' | 'email' | 'image_url'>;
    perk_catalog?: Pick<onchain_item_catalog, 'onchain_item_id' | 'nft_name' | 'nft_description' | 'image_url' | 'item_type' | 'blockchain_type' | 'attributes' | 'release_date' | 'expiry_date'>;
    reservations?: Pick<perk_reservation, 'reservation_id' | 'status' | 'reservation_date'>[];
};

@Injectable()
export class PerkInventoryMapper {
    toDomain(data: PerkInventoryWithRelations): PerkInventoryEntity {
        const props = {
            userId: data.user_id,
            onchainItemId: data.onchain_item_id,
            acquisitionType: data.acquisition_type,
            sourceId: data.source_id,
            quantity: data.quantity,
            expiryDate: data.expiry_date,
            status: data.status,
            acquiredAt: data.acquired_at,
            delFlag: data.del_flag,
            insUserId: data.ins_user_id,
            insDateTime: data.ins_date_time,
            updUserId: data.upd_user_id,
            updDateTime: data.upd_date_time,
            requestId: data.request_id,
            user: data.user ? this.mapUserSummary(data.user) : undefined,
            perkCatalog: data.perk_catalog ? this.mapPerkCatalog(data.perk_catalog) : undefined,
            reservations: data.reservations ? data.reservations.map(r => this.mapReservationSummary(r)) : undefined,
        };

        return new PerkInventoryEntity(props, data.perk_id);
    }

    toDatabase(entity: PerkInventoryEntity): Prisma.user_perk_inventoryCreateInput {
        return {
            perk_id: entity.perkId,
            user: { connect: { user_id: entity.userId } },
            perk_catalog: { connect: { onchain_item_id: entity.onchainItemId } },
            acquisition_type: entity.acquisitionType,
            source_id: entity.sourceId,
            quantity: entity.quantity,
            expiry_date: entity.expiryDate,
            status: entity.status,
            acquired_at: entity.acquiredAt,
            del_flag: entity.delFlag,
            ins_user_id: entity.insUserId,
            ins_date_time: entity.insDateTime,
            upd_user_id: entity.updUserId,
            upd_date_time: entity.updDateTime,
            request_id: entity.requestId,
        };
    }

    private mapUserSummary(userData: Pick<user, 'user_id' | 'username' | 'email' | 'image_url'>): UserEntity {
        // Create a minimal UserEntity for perk display purposes
        const userProps = {
            username: userData.username,
            email: userData.email,
            imageUrl: userData.image_url,
            passportType: null as any, // Not needed for perk display
            levelType: null as any, // Not needed for perk display
            digitalPassportNftId: '',
            publicAddress: '',
            privateKey: '',
            password: '', // Not needed for display
            discordId: null,
            discordUsername: null,
            discordImageUrl: null,
            discordAccessToken: null,
            discordRefreshToken: null,
            googleEmail: null,
            googleImageUrl: null,
            twitterId: null,
            twitterUsername: null,
            twitterImageUrl: null,
            twitterAccessToken: null,
            twitterRefreshToken: null,
            walletSignature: null,
            walletNonce: null,
            magatama: 0,
            refreshToken: null,
            refreshTokenExpiresAt: null,
            currentLocationLat: null,
            currentLocationLng: null,
            delFlag: false,
            insUserId: 'system',
            insDateTime: new Date(),
            updUserId: 'system',
            updDateTime: new Date(),
            requestId: null,
        };

        return new UserEntity(userProps, userData.user_id);
    }

    private mapPerkCatalog(catalogData: Pick<onchain_item_catalog, 'onchain_item_id' | 'nft_name' | 'nft_description' | 'image_url' | 'item_type' | 'blockchain_type' | 'attributes' | 'release_date' | 'expiry_date'>): OnchainItemCatalog {
        const catalogProps = {
            itemType: catalogData.item_type,
            blockchainType: catalogData.blockchain_type,
            nftName: catalogData.nft_name,
            nftDescription: catalogData.nft_description,
            imageUrl: catalogData.image_url,
            contractAddress: '', // Not needed for perk display
            tokenId: null,
            metadataUrl: null,
            attributes: catalogData.attributes as any[],
            releaseDate: catalogData.release_date,
            expiryDate: catalogData.expiry_date,
            maxSupply: null,
            delFlag: false,
            insUserId: 'system',
            insDateTime: new Date(),
            updUserId: 'system',
            updDateTime: new Date(),
            requestId: null,
        };

        return new OnchainItemCatalog(catalogProps, catalogData.onchain_item_id);
    }

    private mapReservationSummary(reservationData: Pick<perk_reservation, 'reservation_id' | 'status' | 'reservation_date'>): PerkReservationEntity {
        // Create a minimal PerkReservationEntity for perk display purposes
        const reservationProps = {
            perkId: '', // Will be set by parent
            userId: '', // Will be set by parent
            reservationDate: reservationData.reservation_date,
            partySize: 1,
            specialRequests: undefined,
            status: reservationData.status,
            qrCodeData: undefined,
            qrGeneratedAt: undefined,
            qrExpiresAt: undefined,
            redemptionLocation: undefined,
            redeemedAt: undefined,
            redeemedBy: undefined,
            delFlag: false,
            insUserId: 'system',
            insDateTime: new Date(),
            updUserId: 'system',
            updDateTime: new Date(),
            requestId: undefined,
        };

        return new PerkReservationEntity(reservationProps, reservationData.reservation_id);
    }
}
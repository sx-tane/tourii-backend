import { Injectable } from '@nestjs/common';
import type { perk_reservation, user, user_perk_inventory, onchain_item_catalog, Prisma } from '@prisma/client';
import { PerkReservationEntity } from '../../domain/perks/perk-reservation.entity';
import { PerkInventoryEntity } from '../../domain/perks/perk-inventory.entity';
import { UserEntity } from '../../domain/user/user.entity';
import { OnchainItemCatalog } from '../../domain/catalog/onchain-item-catalog.entity';

type PerkReservationWithRelations = perk_reservation & {
    user?: Pick<user, 'user_id' | 'username' | 'email' | 'image_url'>;
    perk?: user_perk_inventory & {
        user?: Pick<user, 'user_id' | 'username' | 'email'>;
        perk_catalog?: Pick<onchain_item_catalog, 'onchain_item_id' | 'nft_name' | 'nft_description' | 'image_url'>;
    };
};

@Injectable()
export class PerkReservationMapper {
    toDomain(data: PerkReservationWithRelations): PerkReservationEntity {
        const props = {
            perkId: data.perk_id,
            userId: data.user_id,
            reservationDate: data.reservation_date,
            partySize: data.party_size,
            specialRequests: data.special_requests,
            status: data.status,
            qrCodeData: data.qr_code_data,
            qrGeneratedAt: data.qr_generated_at,
            qrExpiresAt: data.qr_expires_at,
            redemptionLocation: data.redemption_location,
            redeemedAt: data.redeemed_at,
            redeemedBy: data.redeemed_by,
            delFlag: data.del_flag,
            insUserId: data.ins_user_id,
            insDateTime: data.ins_date_time,
            updUserId: data.upd_user_id,
            updDateTime: data.upd_date_time,
            requestId: data.request_id,
            user: data.user ? this.mapUserSummary(data.user) : undefined,
            perk: data.perk ? this.mapPerkSummary(data.perk) : undefined,
        };

        return new PerkReservationEntity(props, data.reservation_id);
    }

    toDatabase(entity: PerkReservationEntity): Prisma.perk_reservationCreateInput {
        return {
            reservation_id: entity.reservationId,
            perk: { connect: { perk_id: entity.perkId } },
            user: { connect: { user_id: entity.userId } },
            reservation_date: entity.reservationDate,
            party_size: entity.partySize,
            special_requests: entity.specialRequests,
            status: entity.status,
            qr_code_data: entity.qrCodeData,
            qr_generated_at: entity.qrGeneratedAt,
            qr_expires_at: entity.qrExpiresAt,
            redemption_location: entity.redemptionLocation,
            redeemed_at: entity.redeemedAt,
            redeemed_by: entity.redeemedBy,
            del_flag: entity.delFlag,
            ins_user_id: entity.insUserId,
            ins_date_time: entity.insDateTime,
            upd_user_id: entity.updUserId,
            upd_date_time: entity.updDateTime,
            request_id: entity.requestId,
        };
    }

    private mapUserSummary(userData: Pick<user, 'user_id' | 'username' | 'email' | 'image_url'>): UserEntity {
        // Create a minimal UserEntity for reservation display purposes
        const userProps = {
            username: userData.username,
            email: userData.email,
            imageUrl: userData.image_url,
            passportType: null as any, // Not needed for reservation display
            levelType: null as any, // Not needed for reservation display
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

    private mapPerkSummary(perkData: user_perk_inventory & {
        user?: Pick<user, 'user_id' | 'username' | 'email'>;
        perk_catalog?: Pick<onchain_item_catalog, 'onchain_item_id' | 'nft_name' | 'nft_description' | 'image_url'>;
    }): PerkInventoryEntity {
        const perkProps = {
            userId: perkData.user_id,
            onchainItemId: perkData.onchain_item_id,
            acquisitionType: perkData.acquisition_type,
            sourceId: perkData.source_id,
            quantity: perkData.quantity,
            expiryDate: perkData.expiry_date,
            status: perkData.status,
            acquiredAt: perkData.acquired_at,
            delFlag: perkData.del_flag,
            insUserId: perkData.ins_user_id,
            insDateTime: perkData.ins_date_time,
            updUserId: perkData.upd_user_id,
            updDateTime: perkData.upd_date_time,
            requestId: perkData.request_id,
            user: perkData.user ? this.mapUserSummary({
                user_id: perkData.user.user_id,
                username: perkData.user.username,
                email: perkData.user.email,
                image_url: null, // Not available in this relation
            }) : undefined,
            perkCatalog: perkData.perk_catalog ? this.mapPerkCatalogSummary(perkData.perk_catalog) : undefined,
        };

        return new PerkInventoryEntity(perkProps, perkData.perk_id);
    }

    private mapPerkCatalogSummary(catalogData: Pick<onchain_item_catalog, 'onchain_item_id' | 'nft_name' | 'nft_description' | 'image_url'>): OnchainItemCatalog {
        const catalogProps = {
            itemType: null as any, // Not needed for reservation display
            blockchainType: null as any, // Not needed for reservation display
            nftName: catalogData.nft_name,
            nftDescription: catalogData.nft_description,
            imageUrl: catalogData.image_url,
            contractAddress: '', // Not needed for display
            tokenId: null,
            metadataUrl: null,
            attributes: [],
            releaseDate: null,
            expiryDate: null,
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
}
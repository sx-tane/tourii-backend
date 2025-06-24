import { OrderEntity } from '@app/core/domain/ecommerce/order.entity';
import { OrderItemEntity } from '@app/core/domain/ecommerce/order-item.entity';
import { OnchainItemCatalog } from '@app/core/domain/catalog/onchain-item-catalog.entity';
import { UserEntity } from '@app/core/domain/user/user.entity';
import type { Prisma } from '@prisma/client';
import type { OrderRelationModel } from 'prisma/relation-model/order-relation-model';

export class OrderMapper {
    static orderEntityToPrismaInput(orderEntity: OrderEntity): Prisma.user_orderUncheckedCreateInput {
        return {
            user_id: orderEntity.userId,
            order_status: orderEntity.orderStatus,
            subtotal_amount: orderEntity.subtotalAmount,
            tax_amount: orderEntity.taxAmount,
            shipping_amount: orderEntity.shippingAmount,
            total_amount: orderEntity.totalAmount,
            currency: orderEntity.currency,
            payment_method: orderEntity.paymentMethod,
            payment_status: orderEntity.paymentStatus,
            payment_transaction_id: orderEntity.paymentTransactionId ?? null,
            payment_fees: orderEntity.paymentFees,
            order_date: orderEntity.orderDate,
            payment_completed_at: orderEntity.paymentCompletedAt ?? null,
            processing_started_at: orderEntity.processingStartedAt ?? null,
            fulfilled_at: orderEntity.fulfilledAt ?? null,
            completed_at: orderEntity.completedAt ?? null,
            fulfillment_notes: orderEntity.fulfillmentNotes ?? null,
            estimated_delivery_date: orderEntity.estimatedDeliveryDate ?? null,
            customer_email: orderEntity.customerEmail ?? null,
            customer_phone: orderEntity.customerPhone ?? null,
            billing_address: orderEntity.billingAddress ?? null,
            shipping_address: orderEntity.shippingAddress ?? null,
            customer_notes: orderEntity.customerNotes ?? null,
            del_flag: orderEntity.delFlag,
            ins_user_id: orderEntity.insUserId,
            ins_date_time: orderEntity.insDateTime,
            upd_user_id: orderEntity.updUserId,
            upd_date_time: orderEntity.updDateTime,
            request_id: orderEntity.requestId ?? null,
        };
    }

    static orderEntityToPrismaUpdateInput(orderEntity: OrderEntity): Prisma.user_orderUncheckedUpdateInput {
        return {
            order_status: orderEntity.orderStatus,
            subtotal_amount: orderEntity.subtotalAmount,
            tax_amount: orderEntity.taxAmount,
            shipping_amount: orderEntity.shippingAmount,
            total_amount: orderEntity.totalAmount,
            currency: orderEntity.currency,
            payment_method: orderEntity.paymentMethod,
            payment_status: orderEntity.paymentStatus,
            payment_transaction_id: orderEntity.paymentTransactionId ?? null,
            payment_fees: orderEntity.paymentFees,
            payment_completed_at: orderEntity.paymentCompletedAt ?? null,
            processing_started_at: orderEntity.processingStartedAt ?? null,
            fulfilled_at: orderEntity.fulfilledAt ?? null,
            completed_at: orderEntity.completedAt ?? null,
            fulfillment_notes: orderEntity.fulfillmentNotes ?? null,
            estimated_delivery_date: orderEntity.estimatedDeliveryDate ?? null,
            customer_email: orderEntity.customerEmail ?? null,
            customer_phone: orderEntity.customerPhone ?? null,
            billing_address: orderEntity.billingAddress ?? null,
            shipping_address: orderEntity.shippingAddress ?? null,
            customer_notes: orderEntity.customerNotes ?? null,
            upd_user_id: orderEntity.updUserId,
            upd_date_time: orderEntity.updDateTime,
            request_id: orderEntity.requestId ?? null,
        };
    }

    static prismaModelToOrderEntity(prismaModel: OrderRelationModel): OrderEntity {
        return new OrderEntity(
            {
                userId: prismaModel.user_id,
                orderStatus: prismaModel.order_status,
                subtotalAmount: Number(prismaModel.subtotal_amount),
                taxAmount: Number(prismaModel.tax_amount),
                shippingAmount: Number(prismaModel.shipping_amount),
                totalAmount: Number(prismaModel.total_amount),
                currency: prismaModel.currency,
                paymentMethod: prismaModel.payment_method,
                paymentStatus: prismaModel.payment_status,
                paymentTransactionId: prismaModel.payment_transaction_id ?? undefined,
                paymentFees: Number(prismaModel.payment_fees),
                orderDate: prismaModel.order_date,
                paymentCompletedAt: prismaModel.payment_completed_at ?? undefined,
                processingStartedAt: prismaModel.processing_started_at ?? undefined,
                fulfilledAt: prismaModel.fulfilled_at ?? undefined,
                completedAt: prismaModel.completed_at ?? undefined,
                fulfillmentNotes: prismaModel.fulfillment_notes ?? undefined,
                estimatedDeliveryDate: prismaModel.estimated_delivery_date ?? undefined,
                customerEmail: prismaModel.customer_email ?? undefined,
                customerPhone: prismaModel.customer_phone ?? undefined,
                billingAddress: prismaModel.billing_address ?? undefined,
                shippingAddress: prismaModel.shipping_address ?? undefined,
                customerNotes: prismaModel.customer_notes ?? undefined,
                delFlag: prismaModel.del_flag,
                insUserId: prismaModel.ins_user_id,
                insDateTime: prismaModel.ins_date_time,
                updUserId: prismaModel.upd_user_id,
                updDateTime: prismaModel.upd_date_time,
                requestId: prismaModel.request_id ?? undefined,
                user: prismaModel.user ? OrderMapper.prismaUserToUserEntity(prismaModel.user) : undefined,
                orderItems: prismaModel.order_items ? prismaModel.order_items.map(item => OrderMapper.prismaOrderItemToOrderItemEntity(item)) : undefined,
            },
            prismaModel.order_id,
        );
    }

    static orderItemEntityToPrismaInput(orderItemEntity: OrderItemEntity): Prisma.user_order_itemUncheckedCreateInput {
        return {
            order_id: orderItemEntity.orderId,
            product_id: orderItemEntity.productId,
            quantity: orderItemEntity.quantity,
            unit_price: orderItemEntity.unitPrice,
            total_price: orderItemEntity.totalPrice,
            product_name: orderItemEntity.productName,
            product_description: orderItemEntity.productDescription ?? null,
            product_image_url: orderItemEntity.productImageUrl ?? null,
            fulfilled_at: orderItemEntity.fulfilledAt ?? null,
            blockchain_txn_hash: orderItemEntity.blockchainTxnHash ?? null,
            item_status: orderItemEntity.itemStatus,
            fulfillment_notes: orderItemEntity.fulfillmentNotes ?? null,
            del_flag: orderItemEntity.delFlag,
            ins_user_id: orderItemEntity.insUserId,
            ins_date_time: orderItemEntity.insDateTime,
            upd_user_id: orderItemEntity.updUserId,
            upd_date_time: orderItemEntity.updDateTime,
            request_id: orderItemEntity.requestId ?? null,
        };
    }

    static prismaOrderItemToOrderItemEntity(prismaOrderItem: any): OrderItemEntity {
        return new OrderItemEntity(
            {
                orderId: prismaOrderItem.order_id,
                productId: prismaOrderItem.product_id,
                quantity: prismaOrderItem.quantity,
                unitPrice: Number(prismaOrderItem.unit_price),
                totalPrice: Number(prismaOrderItem.total_price),
                productName: prismaOrderItem.product_name,
                productDescription: prismaOrderItem.product_description ?? undefined,
                productImageUrl: prismaOrderItem.product_image_url ?? undefined,
                fulfilledAt: prismaOrderItem.fulfilled_at ?? undefined,
                blockchainTxnHash: prismaOrderItem.blockchain_txn_hash ?? undefined,
                itemStatus: prismaOrderItem.item_status,
                fulfillmentNotes: prismaOrderItem.fulfillment_notes ?? undefined,
                delFlag: prismaOrderItem.del_flag,
                insUserId: prismaOrderItem.ins_user_id,
                insDateTime: prismaOrderItem.ins_date_time,
                updUserId: prismaOrderItem.upd_user_id,
                updDateTime: prismaOrderItem.upd_date_time,
                requestId: prismaOrderItem.request_id ?? undefined,
                product: prismaOrderItem.product ? OrderMapper.prismaProductToOnchainItemCatalog(prismaOrderItem.product) : undefined,
            },
            prismaOrderItem.order_item_id,
        );
    }

    private static prismaUserToUserEntity(prismaUser: any): UserEntity {
        // Create a minimal user entity for order relations
        return new UserEntity(
            {
                username: prismaUser.username ?? '',
                password: '', // Not needed for order display
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
import type { CartEntity } from '@app/core/domain/ecommerce/cart.entity';
import type { CartRepository } from '@app/core/domain/ecommerce/cart.repository';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Injectable } from '@nestjs/common';
import { CartMapper } from '../mapper/cart.mapper';

@Injectable()
export class CartRepositoryDb implements CartRepository {
    constructor(private prisma: PrismaService) {}

    // Include related data for cart items
    private readonly cartInclude = {
        user: {
            select: {
                user_id: true,
                username: true,
                email: true,
            },
        },
        product: {
            select: {
                onchain_item_id: true,
                item_type: true,
                nft_name: true,
                nft_description: true,
                image_url: true,
                release_date: true,
                expiry_date: true,
                max_supply: true,
            },
        },
    };

    async getUserCart(userId: string): Promise<CartEntity[]> {
        const cartItems = await this.prisma.user_cart.findMany({
            where: {
                user_id: userId,
                del_flag: false,
            },
            include: this.cartInclude,
            orderBy: {
                added_at: 'desc',
            },
        });

        return cartItems.map((item) => CartMapper.prismaModelToCartEntity(item));
    }

    async addToCart(cartItem: CartEntity): Promise<CartEntity> {
        // Check if item already exists in cart
        const existingItem = await this.prisma.user_cart.findUnique({
            where: {
                unique_user_product_cart: {
                    user_id: cartItem.userId,
                    product_id: cartItem.productId,
                },
            },
        });

        let result;
        if (existingItem) {
            // Update existing item quantity
            result = await this.prisma.user_cart.update({
                where: {
                    cart_id: existingItem.cart_id,
                },
                data: {
                    quantity: existingItem.quantity + cartItem.quantity,
                    upd_date_time: new Date(),
                },
                include: this.cartInclude,
            });
        } else {
            // Create new cart item
            result = await this.prisma.user_cart.create({
                data: CartMapper.cartEntityToPrismaInput(cartItem),
                include: this.cartInclude,
            });
        }

        return CartMapper.prismaModelToCartEntity(result);
    }

    async updateCartItemQuantity(cartId: string, quantity: number): Promise<CartEntity> {
        const updatedItem = await this.prisma.user_cart.update({
            where: {
                cart_id: cartId,
            },
            data: {
                quantity,
                upd_date_time: new Date(),
            },
            include: this.cartInclude,
        });

        return CartMapper.prismaModelToCartEntity(updatedItem);
    }

    async removeFromCart(cartId: string): Promise<boolean> {
        try {
            await this.prisma.user_cart.delete({
                where: {
                    cart_id: cartId,
                },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async removeProductFromCart(userId: string, productId: string): Promise<boolean> {
        try {
            await this.prisma.user_cart.deleteMany({
                where: {
                    user_id: userId,
                    product_id: productId,
                },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async clearCart(userId: string): Promise<boolean> {
        try {
            await this.prisma.user_cart.deleteMany({
                where: {
                    user_id: userId,
                },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async getCartItem(userId: string, productId: string): Promise<CartEntity | undefined> {
        const cartItem = await this.prisma.user_cart.findUnique({
            where: {
                unique_user_product_cart: {
                    user_id: userId,
                    product_id: productId,
                },
            },
            include: this.cartInclude,
        });

        return cartItem ? CartMapper.prismaModelToCartEntity(cartItem) : undefined;
    }

    async getCartItemById(cartId: string): Promise<CartEntity | undefined> {
        const cartItem = await this.prisma.user_cart.findUnique({
            where: {
                cart_id: cartId,
            },
            include: this.cartInclude,
        });

        return cartItem ? CartMapper.prismaModelToCartEntity(cartItem) : undefined;
    }

    async getCartItemCount(userId: string): Promise<number> {
        const result = await this.prisma.user_cart.aggregate({
            where: {
                user_id: userId,
                del_flag: false,
            },
            _sum: {
                quantity: true,
            },
        });

        return result._sum.quantity || 0;
    }

    async hasProductInCart(userId: string, productId: string): Promise<boolean> {
        const count = await this.prisma.user_cart.count({
            where: {
                user_id: userId,
                product_id: productId,
                del_flag: false,
            },
        });

        return count > 0;
    }

    async getCartValue(userId: string): Promise<number> {
        // Note: This would require price information from onchain_item_catalog
        // For now, returning 0 as prices aren't stored in catalog
        // This method would need to be enhanced when pricing is added
        return 0;
    }

    async validateCartAvailability(userId: string): Promise<string[]> {
        const cartItems = await this.prisma.user_cart.findMany({
            where: {
                user_id: userId,
                del_flag: false,
            },
            include: {
                product: true,
            },
        });

        const unavailableProducts: string[] = [];
        const now = new Date();

        for (const item of cartItems) {
            const product = item.product;
            
            // Check if product is deleted
            if (product.del_flag) {
                unavailableProducts.push(product.onchain_item_id);
                continue;
            }

            // Check if product has expired
            if (product.expiry_date && product.expiry_date < now) {
                unavailableProducts.push(product.onchain_item_id);
                continue;
            }

            // Check if product is not yet released
            if (product.release_date && product.release_date > now) {
                unavailableProducts.push(product.onchain_item_id);
                continue;
            }
        }

        return unavailableProducts;
    }

    async mergeCart(guestCartItems: CartEntity[], userId: string): Promise<CartEntity[]> {
        const mergedItems: CartEntity[] = [];

        for (const guestItem of guestCartItems) {
            // Check if user already has this product in cart
            const existingItem = await this.getCartItem(userId, guestItem.productId);
            
            if (existingItem) {
                // Update quantity
                existingItem.updateQuantity(existingItem.quantity + guestItem.quantity);
                const updated = await this.updateCartItemQuantity(existingItem.cartId!, existingItem.quantity);
                mergedItems.push(updated);
            } else {
                // Add new item to user's cart
                const newCartItem = new (guestItem.constructor as any)({
                    ...guestItem,
                    userId,
                    insUserId: userId,
                    updUserId: userId,
                });
                const added = await this.addToCart(newCartItem);
                mergedItems.push(added);
            }
        }

        return mergedItems;
    }

    async getAbandonedCarts(days: number): Promise<CartEntity[]> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const abandonedItems = await this.prisma.user_cart.findMany({
            where: {
                added_at: {
                    lt: cutoffDate,
                },
                del_flag: false,
            },
            include: this.cartInclude,
            orderBy: {
                added_at: 'asc',
            },
        });

        return abandonedItems.map((item) => CartMapper.prismaModelToCartEntity(item));
    }

    async cleanupOldCartItems(days: number): Promise<number> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const result = await this.prisma.user_cart.deleteMany({
            where: {
                added_at: {
                    lt: cutoffDate,
                },
            },
        });

        return result.count;
    }
}
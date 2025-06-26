import type { CartEntity } from './cart.entity';

export interface CartRepository {
    /**
     * Get user's shopping cart
     * @param userId - User ID
     * @returns Array of cart items
     */
    getUserCart(userId: string): Promise<CartEntity[]>;

    /**
     * Add item to cart or update quantity if exists
     * @param cartItem - Cart item to add
     * @returns Created or updated cart item
     */
    addToCart(cartItem: CartEntity): Promise<CartEntity>;

    /**
     * Update cart item quantity
     * @param cartId - Cart item ID
     * @param quantity - New quantity
     * @returns Updated cart item
     */
    updateCartItemQuantity(cartId: string, quantity: number): Promise<CartEntity>;

    /**
     * Remove item from cart
     * @param cartId - Cart item ID
     * @returns True if removed successfully
     */
    removeFromCart(cartId: string): Promise<boolean>;

    /**
     * Remove specific product from user's cart
     * @param userId - User ID
     * @param productId - Product ID to remove
     * @returns True if removed successfully
     */
    removeProductFromCart(userId: string, productId: string): Promise<boolean>;

    /**
     * Clear all items from user's cart
     * @param userId - User ID
     * @returns True if cleared successfully
     */
    clearCart(userId: string): Promise<boolean>;

    /**
     * Get cart item by user and product
     * @param userId - User ID
     * @param productId - Product ID
     * @returns Cart item if exists
     */
    getCartItem(userId: string, productId: string): Promise<CartEntity | undefined>;

    /**
     * Get cart item by cart ID
     * @param cartId - Cart item ID
     * @returns Cart item if exists
     */
    getCartItemById(cartId: string): Promise<CartEntity | undefined>;

    /**
     * Get total item count in user's cart
     * @param userId - User ID
     * @returns Total number of items in cart
     */
    getCartItemCount(userId: string): Promise<number>;

    /**
     * Check if user has specific product in cart
     * @param userId - User ID
     * @param productId - Product ID
     * @returns True if product is in cart
     */
    hasProductInCart(userId: string, productId: string): Promise<boolean>;

    /**
     * Get cart value for user
     * @param userId - User ID
     * @returns Total value of items in cart
     */
    getCartValue(userId: string): Promise<number>;

    /**
     * Validate cart availability (check if all products are still available)
     * @param userId - User ID
     * @returns Array of unavailable product IDs
     */
    validateCartAvailability(userId: string): Promise<string[]>;

    /**
     * Merge guest cart with user cart after login
     * @param guestCartItems - Items from guest cart
     * @param userId - User ID to merge into
     * @returns Merged cart items
     */
    mergeCart(guestCartItems: CartEntity[], userId: string): Promise<CartEntity[]>;

    /**
     * Get abandoned carts (older than specified days)
     * @param days - Number of days to consider abandoned
     * @returns Array of abandoned cart items
     */
    getAbandonedCarts(days: number): Promise<CartEntity[]>;

    /**
     * Clean up old cart items
     * @param days - Number of days to keep cart items
     * @returns Number of cleaned up items
     */
    cleanupOldCartItems(days: number): Promise<number>;
}
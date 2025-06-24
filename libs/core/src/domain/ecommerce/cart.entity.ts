import { Entity } from '../entity';
import type { UserEntity } from '../user/user.entity';
import type { OnchainItemCatalog } from '../catalog/onchain-item-catalog.entity';

interface CartProps {
    userId: string;
    productId: string;
    quantity: number;
    addedAt: Date;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
    user?: UserEntity;
    product?: OnchainItemCatalog;
}

export class CartEntity extends Entity<CartProps> {
    constructor(props: CartProps, id?: string) {
        super(props, id);
    }

    get cartId(): string | undefined {
        return this.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get productId(): string {
        return this.props.productId;
    }

    get quantity(): number {
        return this.props.quantity;
    }

    get addedAt(): Date {
        return this.props.addedAt;
    }

    get delFlag(): boolean {
        return this.props.delFlag;
    }

    get insUserId(): string {
        return this.props.insUserId;
    }

    get insDateTime(): Date {
        return this.props.insDateTime;
    }

    get updUserId(): string {
        return this.props.updUserId;
    }

    get updDateTime(): Date {
        return this.props.updDateTime;
    }

    get requestId(): string | undefined {
        return this.props.requestId;
    }

    get user(): UserEntity | undefined {
        return this.props.user;
    }

    get product(): OnchainItemCatalog | undefined {
        return this.props.product;
    }

    /**
     * Update the quantity of the cart item
     * @param newQuantity - New quantity (must be > 0)
     */
    updateQuantity(newQuantity: number): void {
        if (newQuantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }
        this.props.quantity = newQuantity;
        this.props.updDateTime = new Date();
    }

    /**
     * Calculate total price for this cart item
     * @param unitPrice - Price per item
     * @returns Total price for this cart item
     */
    calculateTotalPrice(unitPrice: number): number {
        return this.props.quantity * unitPrice;
    }

    /**
     * Check if cart item is for the same product
     * @param productId - Product ID to compare
     * @returns True if same product
     */
    isForProduct(productId: string): boolean {
        return this.props.productId === productId;
    }

    /**
     * Check if cart item belongs to user
     * @param userId - User ID to compare
     * @returns True if belongs to user
     */
    belongsToUser(userId: string): boolean {
        return this.props.userId === userId;
    }
}
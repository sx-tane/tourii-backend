import { Entity } from '../entity';
import type { UserEntity } from '../user/user.entity';
import type { OnchainItemCatalog } from '../catalog/onchain-item-catalog.entity';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';
import { CART_CONSTANTS, VALIDATION_CONSTANTS } from '../../constants/ecommerce.constants';

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
     * @param newQuantity - New quantity (must be between 1 and 999)
     * @throws TouriiBackendAppException - When quantity is invalid
     */
    updateQuantity(newQuantity: number): void {
        // Validate quantity is a positive integer within allowed range
        if (!Number.isInteger(newQuantity) || 
            newQuantity < CART_CONSTANTS.MIN_QUANTITY || 
            newQuantity > CART_CONSTANTS.MAX_QUANTITY) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_CART_001);
        }
        
        this.props.quantity = newQuantity;
        this.props.updDateTime = new Date();
    }

    /**
     * Calculate total price for this cart item
     * @param unitPrice - Price per item (must be >= 0)
     * @returns Total price for this cart item
     * @throws TouriiBackendAppException - When unit price is invalid
     */
    calculateTotalPrice(unitPrice: number): number {
        if (typeof unitPrice !== 'number' || unitPrice < 0 || !Number.isFinite(unitPrice)) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_003);
        }
        
        return this.props.quantity * unitPrice;
    }

    /**
     * Check if cart item is for the same product
     * @param productId - Product ID to compare
     * @returns True if same product
     * @throws TouriiBackendAppException - When product ID is invalid
     */
    isForProduct(productId: string): boolean {
        if (!productId || typeof productId !== 'string' || productId.trim().length === 0) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_SHOP_001);
        }
        
        return this.props.productId === productId;
    }

    /**
     * Check if cart item belongs to user
     * @param userId - User ID to compare
     * @returns True if belongs to user
     * @throws TouriiBackendAppException - When user ID is invalid
     */
    belongsToUser(userId: string): boolean {
        if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
        }
        
        return this.props.userId === userId;
    }
}
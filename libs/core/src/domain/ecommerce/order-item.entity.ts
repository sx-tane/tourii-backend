import { OrderStatus } from '@prisma/client';
import { Entity } from '../entity';
import type { OrderEntity } from './order.entity';
import type { OnchainItemCatalog } from '../catalog/onchain-item-catalog.entity';

interface OrderItemProps {
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    productName: string;
    productDescription?: string;
    productImageUrl?: string;
    fulfilledAt?: Date;
    blockchainTxnHash?: string;
    itemStatus: OrderStatus;
    fulfillmentNotes?: string;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
    order?: OrderEntity;
    product?: OnchainItemCatalog;
}

export class OrderItemEntity extends Entity<OrderItemProps> {
    constructor(props: OrderItemProps, id?: string) {
        super(props, id);
    }

    get orderItemId(): string | undefined {
        return this.id;
    }

    get orderId(): string {
        return this.props.orderId;
    }

    get productId(): string {
        return this.props.productId;
    }

    get quantity(): number {
        return this.props.quantity;
    }

    get unitPrice(): number {
        return this.props.unitPrice;
    }

    get totalPrice(): number {
        return this.props.totalPrice;
    }

    get productName(): string {
        return this.props.productName;
    }

    get productDescription(): string | undefined {
        return this.props.productDescription;
    }

    get productImageUrl(): string | undefined {
        return this.props.productImageUrl;
    }

    get fulfilledAt(): Date | undefined {
        return this.props.fulfilledAt;
    }

    get blockchainTxnHash(): string | undefined {
        return this.props.blockchainTxnHash;
    }

    get itemStatus(): OrderStatus {
        return this.props.itemStatus;
    }

    get fulfillmentNotes(): string | undefined {
        return this.props.fulfillmentNotes;
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

    get order(): OrderEntity | undefined {
        return this.props.order;
    }

    get product(): OnchainItemCatalog | undefined {
        return this.props.product;
    }

    /**
     * Update item status and set appropriate timestamps
     * @param newStatus - New item status
     */
    updateStatus(newStatus: OrderStatus): void {
        this.props.itemStatus = newStatus;
        this.props.updDateTime = new Date();

        if (newStatus === OrderStatus.FULFILLED) {
            this.props.fulfilledAt = new Date();
        }
    }

    /**
     * Set blockchain transaction hash (for perk minting)
     * @param txnHash - Blockchain transaction hash
     */
    setBlockchainTransaction(txnHash: string): void {
        this.props.blockchainTxnHash = txnHash;
        this.props.updDateTime = new Date();
    }

    /**
     * Add fulfillment notes
     * @param notes - Fulfillment notes
     */
    addFulfillmentNotes(notes: string): void {
        this.props.fulfillmentNotes = notes;
        this.props.updDateTime = new Date();
    }

    /**
     * Calculate the total price based on quantity and unit price
     * @returns Calculated total price
     */
    calculateTotalPrice(): number {
        return this.props.quantity * this.props.unitPrice;
    }

    /**
     * Update the calculated total price
     */
    updateTotalPrice(): void {
        this.props.totalPrice = this.calculateTotalPrice();
        this.props.updDateTime = new Date();
    }

    /**
     * Check if item belongs to order
     * @param orderId - Order ID to compare
     * @returns True if belongs to order
     */
    belongsToOrder(orderId: string): boolean {
        return this.props.orderId === orderId;
    }

    /**
     * Check if item is for the same product
     * @param productId - Product ID to compare
     * @returns True if same product
     */
    isForProduct(productId: string): boolean {
        return this.props.productId === productId;
    }

    /**
     * Check if item has been fulfilled
     * @returns True if item has been fulfilled
     */
    isFulfilled(): boolean {
        return this.props.itemStatus === OrderStatus.FULFILLED || this.props.itemStatus === OrderStatus.COMPLETED;
    }

    /**
     * Check if item can be fulfilled
     * @returns True if item can be fulfilled
     */
    canBeFulfilled(): boolean {
        return [OrderStatus.PAID, OrderStatus.PROCESSING].includes(this.props.itemStatus);
    }

    /**
     * Check if item has blockchain transaction
     * @returns True if item has blockchain transaction hash
     */
    hasBlockchainTransaction(): boolean {
        return !!this.props.blockchainTxnHash;
    }

    /**
     * Get fulfillment age in days
     * @returns Number of days since fulfillment (null if not fulfilled)
     */
    getFulfillmentAgeInDays(): number | null {
        if (!this.props.fulfilledAt) return null;
        
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - this.props.fulfilledAt.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}
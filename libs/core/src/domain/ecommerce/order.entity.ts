import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { Entity } from '../entity';
import type { UserEntity } from '../user/user.entity';
import type { OrderItemEntity } from './order-item.entity';
import type { BillingAddressInterface, ShippingAddressInterface } from './types/address.types';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';
import { ORDER_CONSTANTS, VALIDATION_CONSTANTS, TIME_CONSTANTS, STATUS_CONSTANTS } from '../../constants/ecommerce.constants';
import { validateEmail, validatePhone, validateCurrency, validateBillingAddress, validateShippingAddress, validateOrderAmount } from './utils/validation.utils';

interface OrderProps {
    userId: string;
    orderStatus: OrderStatus;
    subtotalAmount: number;
    taxAmount: number;
    shippingAmount: number;
    totalAmount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    paymentTransactionId?: string;
    paymentFees: number;
    orderDate: Date;
    paymentCompletedAt?: Date;
    processingStartedAt?: Date;
    fulfilledAt?: Date;
    completedAt?: Date;
    fulfillmentNotes?: string;
    estimatedDeliveryDate?: Date;
    customerEmail?: string;
    customerPhone?: string;
    billingAddress?: BillingAddressInterface;
    shippingAddress?: ShippingAddressInterface;
    customerNotes?: string;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
    user?: UserEntity;
    orderItems?: OrderItemEntity[];
}

export class OrderEntity extends Entity<OrderProps> {
    constructor(props: OrderProps, id?: string) {
        super(props, id);
    }

    get orderId(): string | undefined {
        return this.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get orderStatus(): OrderStatus {
        return this.props.orderStatus;
    }

    get subtotalAmount(): number {
        return this.props.subtotalAmount;
    }

    get taxAmount(): number {
        return this.props.taxAmount;
    }

    get shippingAmount(): number {
        return this.props.shippingAmount;
    }

    get totalAmount(): number {
        return this.props.totalAmount;
    }

    get currency(): string {
        return this.props.currency;
    }

    get paymentMethod(): PaymentMethod {
        return this.props.paymentMethod;
    }

    get paymentStatus(): PaymentStatus {
        return this.props.paymentStatus;
    }

    get paymentTransactionId(): string | undefined {
        return this.props.paymentTransactionId;
    }

    get paymentFees(): number {
        return this.props.paymentFees;
    }

    get orderDate(): Date {
        return this.props.orderDate;
    }

    get paymentCompletedAt(): Date | undefined {
        return this.props.paymentCompletedAt;
    }

    get processingStartedAt(): Date | undefined {
        return this.props.processingStartedAt;
    }

    get fulfilledAt(): Date | undefined {
        return this.props.fulfilledAt;
    }

    get completedAt(): Date | undefined {
        return this.props.completedAt;
    }

    get fulfillmentNotes(): string | undefined {
        return this.props.fulfillmentNotes;
    }

    get estimatedDeliveryDate(): Date | undefined {
        return this.props.estimatedDeliveryDate;
    }

    get customerEmail(): string | undefined {
        return this.props.customerEmail;
    }

    get customerPhone(): string | undefined {
        return this.props.customerPhone;
    }

    get billingAddress(): BillingAddressInterface | undefined {
        return this.props.billingAddress;
    }

    get shippingAddress(): ShippingAddressInterface | undefined {
        return this.props.shippingAddress;
    }

    get customerNotes(): string | undefined {
        return this.props.customerNotes;
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

    get orderItems(): OrderItemEntity[] | undefined {
        return this.props.orderItems;
    }

    /**
     * Set and validate customer email
     * @param email - Customer email address
     * @throws TouriiBackendAppException - When email format is invalid
     */
    setCustomerEmail(email: string): void {
        validateEmail(email);
        this.props.customerEmail = email.trim();
        this.props.updDateTime = new Date();
    }

    /**
     * Set and validate customer phone
     * @param phone - Customer phone number (international format)
     * @throws TouriiBackendAppException - When phone format is invalid
     */
    setCustomerPhone(phone: string): void {
        validatePhone(phone);
        this.props.customerPhone = phone.trim();
        this.props.updDateTime = new Date();
    }

    /**
     * Set and validate currency
     * @param currency - Currency code (ISO 4217)
     * @throws TouriiBackendAppException - When currency is not supported
     */
    setCurrency(currency: string): void {
        validateCurrency(currency);
        this.props.currency = currency.toUpperCase();
        this.props.updDateTime = new Date();
    }

    /**
     * Set and validate billing address
     * @param address - Billing address information
     * @throws TouriiBackendAppException - When address is invalid
     */
    setBillingAddress(address: BillingAddressInterface): void {
        validateBillingAddress(address);
        this.props.billingAddress = address;
        this.props.updDateTime = new Date();
    }

    /**
     * Set and validate shipping address
     * @param address - Shipping address information
     * @throws TouriiBackendAppException - When address is invalid
     */
    setShippingAddress(address: ShippingAddressInterface): void {
        validateShippingAddress(address);
        this.props.shippingAddress = address;
        this.props.updDateTime = new Date();
    }

    /**
     * Validate order amounts
     * @throws TouriiBackendAppException - When any amount is invalid
     */
    validateOrderAmounts(): void {
        validateOrderAmount(this.props.subtotalAmount);
        validateOrderAmount(this.props.totalAmount);
        
        // Validate that tax and shipping amounts are not negative
        if (this.props.taxAmount < 0 || this.props.shippingAmount < 0 || this.props.paymentFees < 0) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_003);
        }

        // Validate that total equals subtotal + tax + shipping
        const calculatedTotal = this.props.subtotalAmount + this.props.taxAmount + this.props.shippingAmount;
        if (Math.abs(calculatedTotal - this.props.totalAmount) > 0.01) { // Allow for small rounding differences
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_ORDER_003);
        }
    }

    /**
     * Update order status and set appropriate timestamps
     * @param newStatus - New order status
     */
    updateStatus(newStatus: OrderStatus): void {
        this.props.orderStatus = newStatus;
        this.props.updDateTime = new Date();

        // Set timestamps based on status
        switch (newStatus) {
            case OrderStatus.PROCESSING:
                this.props.processingStartedAt = new Date();
                break;
            case OrderStatus.FULFILLED:
                this.props.fulfilledAt = new Date();
                break;
            case OrderStatus.COMPLETED:
                this.props.completedAt = new Date();
                break;
        }
    }

    /**
     * Update payment status and set payment completion timestamp
     * @param newStatus - New payment status
     * @param transactionId - Payment transaction ID
     */
    updatePaymentStatus(newStatus: PaymentStatus, transactionId?: string): void {
        this.props.paymentStatus = newStatus;
        this.props.updDateTime = new Date();

        if (transactionId) {
            this.props.paymentTransactionId = transactionId;
        }

        if (newStatus === PaymentStatus.COMPLETED) {
            this.props.paymentCompletedAt = new Date();
            // Automatically move to PAID status if payment completed
            if (this.props.orderStatus === OrderStatus.PENDING) {
                this.props.orderStatus = OrderStatus.PAID;
            }
        }
    }

    /**
     * Add fulfillment notes
     * @param notes - Fulfillment notes (max 1000 characters)
     * @throws TouriiBackendAppException - When notes exceed maximum length
     */
    addFulfillmentNotes(notes: string): void {
        if (notes && notes.length > VALIDATION_CONSTANTS.MAX_NOTES_LENGTH) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }
        
        this.props.fulfillmentNotes = notes;
        this.props.updDateTime = new Date();
    }

    /**
     * Set estimated delivery date
     * @param date - Estimated delivery date (must be in the future)
     * @throws TouriiBackendAppException - When date is invalid
     */
    setEstimatedDeliveryDate(date: Date): void {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }
        
        // Estimated delivery should be in the future
        if (date <= new Date()) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }
        
        this.props.estimatedDeliveryDate = date;
        this.props.updDateTime = new Date();
    }

    /**
     * Check if order can be cancelled
     * @returns True if order can be cancelled
     */
    canBeCancelled(): boolean {
        return [OrderStatus.PENDING, OrderStatus.PAID].includes(this.props.orderStatus) &&
               ![PaymentStatus.COMPLETED].includes(this.props.paymentStatus);
    }

    /**
     * Check if order can be refunded
     * @returns True if order can be refunded
     */
    canBeRefunded(): boolean {
        return [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.FULFILLED, OrderStatus.COMPLETED].includes(this.props.orderStatus) &&
               this.props.paymentStatus === PaymentStatus.COMPLETED;
    }

    /**
     * Calculate total item count in order
     * @returns Total number of items
     */
    getTotalItemCount(): number {
        if (!this.props.orderItems) return 0;
        return this.props.orderItems.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Check if order belongs to user
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

    /**
     * Check if order is in final state
     * @returns True if order is in final state
     */
    isInFinalState(): boolean {
        return [OrderStatus.COMPLETED, OrderStatus.CANCELLED, OrderStatus.REFUNDED, OrderStatus.FAILED].includes(this.props.orderStatus);
    }

    /**
     * Get order age in days
     * @returns Number of days since order was placed
     */
    getAgeInDays(): number {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - this.props.orderDate.getTime());
        return Math.ceil(diffTime / TIME_CONSTANTS.DAY);
    }
}
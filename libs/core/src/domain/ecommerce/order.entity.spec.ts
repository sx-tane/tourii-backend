import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { OrderEntity } from './order.entity';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';

describe('OrderEntity', () => {
    let orderEntity: OrderEntity;
    const validProps = {
        userId: 'user123',
        orderStatus: OrderStatus.PENDING,
        subtotalAmount: 100.00,
        taxAmount: 10.00,
        shippingAmount: 5.00,
        totalAmount: 115.00,
        currency: 'USD',
        paymentMethod: PaymentMethod.STRIPE,
        paymentStatus: PaymentStatus.PENDING,
        paymentFees: 3.50,
        orderDate: new Date(),
        delFlag: false,
        insUserId: 'admin123',
        insDateTime: new Date(),
        updUserId: 'admin123',
        updDateTime: new Date(),
    };

    beforeEach(() => {
        orderEntity = new OrderEntity(validProps);
    });

    describe('constructor', () => {
        it('should create an order entity with valid props', () => {
            expect(orderEntity.userId).toBe(validProps.userId);
            expect(orderEntity.orderStatus).toBe(validProps.orderStatus);
            expect(orderEntity.totalAmount).toBe(validProps.totalAmount);
            expect(orderEntity.currency).toBe(validProps.currency);
            expect(orderEntity.paymentMethod).toBe(validProps.paymentMethod);
            expect(orderEntity.paymentStatus).toBe(validProps.paymentStatus);
        });
    });

    describe('addFulfillmentNotes', () => {
        it('should add fulfillment notes', () => {
            const notes = 'Order processed successfully';
            orderEntity.addFulfillmentNotes(notes);
            
            expect(orderEntity.fulfillmentNotes).toBe(notes);
        });

        it('should allow empty notes', () => {
            orderEntity.addFulfillmentNotes('');
            expect(orderEntity.fulfillmentNotes).toBe('');
        });

        it('should throw error for notes exceeding maximum length', () => {
            const longNotes = 'a'.repeat(1001); // Exceeds MAX_NOTES_LENGTH (1000)
            
            expect(() => orderEntity.addFulfillmentNotes(longNotes))
                .toThrow(TouriiBackendAppException);
        });

        it('should accept notes at maximum length', () => {
            const maxLengthNotes = 'a'.repeat(1000); // Exactly MAX_NOTES_LENGTH
            
            orderEntity.addFulfillmentNotes(maxLengthNotes);
            expect(orderEntity.fulfillmentNotes).toBe(maxLengthNotes);
        });
    });

    describe('setEstimatedDeliveryDate', () => {
        it('should set future delivery date', () => {
            const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
            
            orderEntity.setEstimatedDeliveryDate(futureDate);
            expect(orderEntity.estimatedDeliveryDate).toBe(futureDate);
        });

        it('should throw error for past date', () => {
            const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
            
            expect(() => orderEntity.setEstimatedDeliveryDate(pastDate))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for current date', () => {
            const now = new Date();
            
            expect(() => orderEntity.setEstimatedDeliveryDate(now))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for invalid date', () => {
            const invalidDate = new Date('invalid-date');
            
            expect(() => orderEntity.setEstimatedDeliveryDate(invalidDate))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for null date', () => {
            expect(() => orderEntity.setEstimatedDeliveryDate(null as any))
                .toThrow(TouriiBackendAppException);
        });
    });

    describe('belongsToUser', () => {
        it('should return true for matching user ID', () => {
            const result = orderEntity.belongsToUser(validProps.userId);
            expect(result).toBe(true);
        });

        it('should return false for different user ID', () => {
            const result = orderEntity.belongsToUser('different-user');
            expect(result).toBe(false);
        });

        it('should throw error for empty user ID', () => {
            expect(() => orderEntity.belongsToUser(''))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for null user ID', () => {
            expect(() => orderEntity.belongsToUser(null as any))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for undefined user ID', () => {
            expect(() => orderEntity.belongsToUser(undefined as any))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for whitespace-only user ID', () => {
            expect(() => orderEntity.belongsToUser('   '))
                .toThrow(TouriiBackendAppException);
        });
    });

    describe('canBeCancelled', () => {
        it('should return true for PENDING order with PENDING payment', () => {
            const order = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.PENDING,
                paymentStatus: PaymentStatus.PENDING,
            });
            
            expect(order.canBeCancelled()).toBe(true);
        });

        it('should return true for PAID order with non-COMPLETED payment', () => {
            const order = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.PAID,
                paymentStatus: PaymentStatus.PENDING,
            });
            
            expect(order.canBeCancelled()).toBe(true);
        });

        it('should return false for order with COMPLETED payment', () => {
            const order = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.PENDING,
                paymentStatus: PaymentStatus.COMPLETED,
            });
            
            expect(order.canBeCancelled()).toBe(false);
        });

        it('should return false for PROCESSING order', () => {
            const order = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.PROCESSING,
                paymentStatus: PaymentStatus.PENDING,
            });
            
            expect(order.canBeCancelled()).toBe(false);
        });

        it('should return false for COMPLETED order', () => {
            const order = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.COMPLETED,
                paymentStatus: PaymentStatus.COMPLETED,
            });
            
            expect(order.canBeCancelled()).toBe(false);
        });
    });

    describe('canBeRefunded', () => {
        it('should return true for COMPLETED order with COMPLETED payment', () => {
            const order = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.COMPLETED,
                paymentStatus: PaymentStatus.COMPLETED,
            });
            
            expect(order.canBeRefunded()).toBe(true);
        });

        it('should return true for PAID order with COMPLETED payment', () => {
            const order = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.PAID,
                paymentStatus: PaymentStatus.COMPLETED,
            });
            
            expect(order.canBeRefunded()).toBe(true);
        });

        it('should return false for order with PENDING payment', () => {
            const order = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.COMPLETED,
                paymentStatus: PaymentStatus.PENDING,
            });
            
            expect(order.canBeRefunded()).toBe(false);
        });

        it('should return false for PENDING order', () => {
            const order = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.PENDING,
                paymentStatus: PaymentStatus.COMPLETED,
            });
            
            expect(order.canBeRefunded()).toBe(false);
        });
    });

    describe('isInFinalState', () => {
        it('should return true for COMPLETED order', () => {
            const order = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.COMPLETED,
            });
            
            expect(order.isInFinalState()).toBe(true);
        });

        it('should return true for CANCELLED order', () => {
            const order = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.CANCELLED,
            });
            
            expect(order.isInFinalState()).toBe(true);
        });

        it('should return true for REFUNDED order', () => {
            const order = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.REFUNDED,
            });
            
            expect(order.isInFinalState()).toBe(true);
        });

        it('should return true for FAILED order', () => {
            const order = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.FAILED,
            });
            
            expect(order.isInFinalState()).toBe(true);
        });

        it('should return false for PENDING order', () => {
            const order = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.PENDING,
            });
            
            expect(order.isInFinalState()).toBe(false);
        });

        it('should return false for PROCESSING order', () => {
            const order = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.PROCESSING,
            });
            
            expect(order.isInFinalState()).toBe(false);
        });
    });

    describe('getAgeInDays', () => {
        it('should calculate age correctly for recent order', () => {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const order = new OrderEntity({
                ...validProps,
                orderDate: oneDayAgo,
            });
            
            const age = order.getAgeInDays();
            expect(age).toBe(1);
        });

        it('should calculate age correctly for week-old order', () => {
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const order = new OrderEntity({
                ...validProps,
                orderDate: sevenDaysAgo,
            });
            
            const age = order.getAgeInDays();
            expect(age).toBe(7);
        });

        it('should handle current date order', () => {
            const order = new OrderEntity({
                ...validProps,
                orderDate: new Date(),
            });
            
            const age = order.getAgeInDays();
            expect(age).toBe(0);
        });
    });

    describe('getTotalItemCount', () => {
        it('should return 0 when no order items', () => {
            const count = orderEntity.getTotalItemCount();
            expect(count).toBe(0);
        });

        it('should calculate total from order items', () => {
            // Mock order items with quantities
            const mockOrderItems = [
                { quantity: 2 } as any,
                { quantity: 3 } as any,
                { quantity: 1 } as any,
            ];
            
            // Set order items directly (normally done through proper entity construction)
            (orderEntity as any).props.orderItems = mockOrderItems;
            
            const count = orderEntity.getTotalItemCount();
            expect(count).toBe(6); // 2 + 3 + 1
        });
    });

    describe('updatePaymentStatus', () => {
        it('should update payment status', () => {
            orderEntity.updatePaymentStatus(PaymentStatus.COMPLETED, 'txn123');
            
            expect(orderEntity.paymentStatus).toBe(PaymentStatus.COMPLETED);
            expect(orderEntity.paymentTransactionId).toBe('txn123');
            expect(orderEntity.paymentCompletedAt).toBeInstanceOf(Date);
        });

        it('should update payment status without transaction ID', () => {
            orderEntity.updatePaymentStatus(PaymentStatus.FAILED);
            
            expect(orderEntity.paymentStatus).toBe(PaymentStatus.FAILED);
            expect(orderEntity.paymentTransactionId).toBeUndefined();
        });

        it('should automatically update order status when payment completed', () => {
            const pendingOrder = new OrderEntity({
                ...validProps,
                orderStatus: OrderStatus.PENDING,
                paymentStatus: PaymentStatus.PENDING,
            });
            
            pendingOrder.updatePaymentStatus(PaymentStatus.COMPLETED, 'txn123');
            
            expect(pendingOrder.orderStatus).toBe(OrderStatus.PAID);
            expect(pendingOrder.paymentCompletedAt).toBeInstanceOf(Date);
        });
    });

    describe('getters', () => {
        it('should return correct order properties', () => {
            expect(orderEntity.userId).toBe(validProps.userId);
            expect(orderEntity.orderStatus).toBe(validProps.orderStatus);
            expect(orderEntity.subtotalAmount).toBe(validProps.subtotalAmount);
            expect(orderEntity.taxAmount).toBe(validProps.taxAmount);
            expect(orderEntity.shippingAmount).toBe(validProps.shippingAmount);
            expect(orderEntity.totalAmount).toBe(validProps.totalAmount);
            expect(orderEntity.currency).toBe(validProps.currency);
            expect(orderEntity.paymentMethod).toBe(validProps.paymentMethod);
            expect(orderEntity.paymentStatus).toBe(validProps.paymentStatus);
            expect(orderEntity.paymentFees).toBe(validProps.paymentFees);
            expect(orderEntity.orderDate).toBe(validProps.orderDate);
        });

        it('should return undefined for order ID when not set', () => {
            expect(orderEntity.orderId).toBeUndefined();
        });

        it('should return order ID when entity has ID', () => {
            const orderWithId = new OrderEntity(validProps, 'order123');
            expect(orderWithId.orderId).toBe('order123');
        });
    });
});
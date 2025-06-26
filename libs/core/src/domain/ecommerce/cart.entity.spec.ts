import { CartEntity } from './cart.entity';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';
import { CART_CONSTANTS } from '../../constants/ecommerce.constants';

describe('CartEntity', () => {
    let cartEntity: CartEntity;
    const validProps = {
        userId: 'user123',
        productId: 'product456',
        quantity: 2,
        addedAt: new Date(),
        delFlag: false,
        insUserId: 'admin123',
        insDateTime: new Date(),
        updUserId: 'admin123',
        updDateTime: new Date(),
    };

    beforeEach(() => {
        cartEntity = new CartEntity(validProps);
    });

    describe('constructor', () => {
        it('should create a cart entity with valid props', () => {
            expect(cartEntity.userId).toBe(validProps.userId);
            expect(cartEntity.productId).toBe(validProps.productId);
            expect(cartEntity.quantity).toBe(validProps.quantity);
            expect(cartEntity.delFlag).toBe(validProps.delFlag);
        });
    });

    describe('updateQuantity', () => {
        it('should update quantity with valid value', () => {
            const newQuantity = 5;
            cartEntity.updateQuantity(newQuantity);
            
            expect(cartEntity.quantity).toBe(newQuantity);
        });

        it('should throw error for zero quantity', () => {
            expect(() => cartEntity.updateQuantity(0))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for negative quantity', () => {
            expect(() => cartEntity.updateQuantity(-1))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for quantity exceeding maximum', () => {
            expect(() => cartEntity.updateQuantity(CART_CONSTANTS.MAX_QUANTITY + 1))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for non-integer quantity', () => {
            expect(() => cartEntity.updateQuantity(2.5))
                .toThrow(TouriiBackendAppException);
        });

        it('should accept maximum allowed quantity', () => {
            cartEntity.updateQuantity(CART_CONSTANTS.MAX_QUANTITY);
            expect(cartEntity.quantity).toBe(CART_CONSTANTS.MAX_QUANTITY);
        });

        it('should accept minimum allowed quantity', () => {
            cartEntity.updateQuantity(CART_CONSTANTS.MIN_QUANTITY);
            expect(cartEntity.quantity).toBe(CART_CONSTANTS.MIN_QUANTITY);
        });
    });

    describe('calculateTotalPrice', () => {
        it('should calculate total price correctly', () => {
            const unitPrice = 10.50;
            const expectedTotal = cartEntity.quantity * unitPrice;
            
            const actualTotal = cartEntity.calculateTotalPrice(unitPrice);
            
            expect(actualTotal).toBe(expectedTotal);
        });

        it('should handle zero price', () => {
            const total = cartEntity.calculateTotalPrice(0);
            expect(total).toBe(0);
        });

        it('should throw error for negative price', () => {
            expect(() => cartEntity.calculateTotalPrice(-1))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for invalid price (NaN)', () => {
            expect(() => cartEntity.calculateTotalPrice(NaN))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for infinite price', () => {
            expect(() => cartEntity.calculateTotalPrice(Infinity))
                .toThrow(TouriiBackendAppException);
        });

        it('should handle decimal prices correctly', () => {
            const unitPrice = 9.99;
            const expectedTotal = cartEntity.quantity * unitPrice;
            
            const actualTotal = cartEntity.calculateTotalPrice(unitPrice);
            
            expect(actualTotal).toBeCloseTo(expectedTotal, 2);
        });
    });

    describe('isForProduct', () => {
        it('should return true for matching product ID', () => {
            const result = cartEntity.isForProduct(validProps.productId);
            expect(result).toBe(true);
        });

        it('should return false for different product ID', () => {
            const result = cartEntity.isForProduct('different-product');
            expect(result).toBe(false);
        });

        it('should throw error for empty product ID', () => {
            expect(() => cartEntity.isForProduct(''))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for null product ID', () => {
            expect(() => cartEntity.isForProduct(null as any))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for undefined product ID', () => {
            expect(() => cartEntity.isForProduct(undefined as any))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for whitespace-only product ID', () => {
            expect(() => cartEntity.isForProduct('   '))
                .toThrow(TouriiBackendAppException);
        });
    });

    describe('belongsToUser', () => {
        it('should return true for matching user ID', () => {
            const result = cartEntity.belongsToUser(validProps.userId);
            expect(result).toBe(true);
        });

        it('should return false for different user ID', () => {
            const result = cartEntity.belongsToUser('different-user');
            expect(result).toBe(false);
        });

        it('should throw error for empty user ID', () => {
            expect(() => cartEntity.belongsToUser(''))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for null user ID', () => {
            expect(() => cartEntity.belongsToUser(null as any))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for undefined user ID', () => {
            expect(() => cartEntity.belongsToUser(undefined as any))
                .toThrow(TouriiBackendAppException);
        });

        it('should throw error for whitespace-only user ID', () => {
            expect(() => cartEntity.belongsToUser('   '))
                .toThrow(TouriiBackendAppException);
        });
    });

    describe('getters', () => {
        it('should return correct user ID', () => {
            expect(cartEntity.userId).toBe(validProps.userId);
        });

        it('should return correct product ID', () => {
            expect(cartEntity.productId).toBe(validProps.productId);
        });

        it('should return correct quantity', () => {
            expect(cartEntity.quantity).toBe(validProps.quantity);
        });

        it('should return correct added date', () => {
            expect(cartEntity.addedAt).toBe(validProps.addedAt);
        });

        it('should return correct delete flag', () => {
            expect(cartEntity.delFlag).toBe(validProps.delFlag);
        });

        it('should return undefined for cart ID when not set', () => {
            expect(cartEntity.cartId).toBeUndefined();
        });

        it('should return cart ID when entity has ID', () => {
            const cartWithId = new CartEntity(validProps, 'cart123');
            expect(cartWithId.cartId).toBe('cart123');
        });
    });

    describe('business logic', () => {
        it('should allow quantity updates that maintain business rules', () => {
            // Start with minimum quantity
            cartEntity.updateQuantity(CART_CONSTANTS.MIN_QUANTITY);
            expect(cartEntity.quantity).toBe(CART_CONSTANTS.MIN_QUANTITY);

            // Update to middle value
            const middleQuantity = Math.floor(CART_CONSTANTS.MAX_QUANTITY / 2);
            cartEntity.updateQuantity(middleQuantity);
            expect(cartEntity.quantity).toBe(middleQuantity);

            // Update to maximum
            cartEntity.updateQuantity(CART_CONSTANTS.MAX_QUANTITY);
            expect(cartEntity.quantity).toBe(CART_CONSTANTS.MAX_QUANTITY);
        });

        it('should correctly calculate total for various price scenarios', () => {
            cartEntity.updateQuantity(3);

            // Test various price points
            const testCases = [
                { price: 0.01, expected: 0.03 },
                { price: 1.00, expected: 3.00 },
                { price: 9.99, expected: 29.97 },
                { price: 100.00, expected: 300.00 },
            ];

            testCases.forEach(({ price, expected }) => {
                const total = cartEntity.calculateTotalPrice(price);
                expect(total).toBeCloseTo(expected, 2);
            });
        });
    });
});
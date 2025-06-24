import { Test, TestingModule } from '@nestjs/testing';
import { CartRepositoryDb } from './cart.repository-db';
import { PrismaService } from '@app/core/provider/prisma.service';
import { CartEntity } from '@app/core/domain/ecommerce/cart.entity';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';
import { CART_CONSTANTS } from '../../constants/ecommerce.constants';

describe('CartRepositoryDb', () => {
    let repository: CartRepositoryDb;
    let prismaService: jest.Mocked<PrismaService>;

    const mockCartData = {
        cart_id: 'cart123',
        user_id: 'user123',
        product_id: 'product456',
        quantity: 2,
        added_at: new Date(),
        del_flag: false,
        ins_user_id: 'admin123',
        ins_date_time: new Date(),
        upd_user_id: 'admin123',
        upd_date_time: new Date(),
        user: {
            user_id: 'user123',
            username: 'testuser',
            email: 'test@example.com',
        },
        product: {
            onchain_item_id: 'product456',
            item_type: 'PERK',
            nft_name: 'Test Product',
            nft_description: 'Test Description',
            image_url: 'https://example.com/image.jpg',
            release_date: new Date(),
            expiry_date: null,
            max_supply: 1000,
        },
    };

    beforeEach(async () => {
        const mockPrismaService = {
            user_cart: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                deleteMany: jest.fn(),
                count: jest.fn(),
            },
            $queryRaw: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CartRepositoryDb,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        repository = module.get<CartRepositoryDb>(CartRepositoryDb);
        prismaService = module.get(PrismaService);
    });

    describe('getUserCart', () => {
        it('should return cart items for valid user ID', async () => {
            prismaService.user_cart.findMany.mockResolvedValue([mockCartData]);

            const result = await repository.getUserCart('user123');

            expect(prismaService.user_cart.findMany).toHaveBeenCalledWith({
                where: {
                    user_id: 'user123',
                    del_flag: false,
                },
                include: expect.any(Object),
                orderBy: {
                    added_at: 'desc',
                },
            });
            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(CartEntity);
        });

        it('should throw error for empty user ID', async () => {
            await expect(repository.getUserCart(''))
                .rejects.toThrow(TouriiBackendAppException);

            expect(prismaService.user_cart.findMany).not.toHaveBeenCalled();
        });

        it('should throw error for null user ID', async () => {
            await expect(repository.getUserCart(null as any))
                .rejects.toThrow(TouriiBackendAppException);

            expect(prismaService.user_cart.findMany).not.toHaveBeenCalled();
        });

        it('should throw error for whitespace-only user ID', async () => {
            await expect(repository.getUserCart('   '))
                .rejects.toThrow(TouriiBackendAppException);

            expect(prismaService.user_cart.findMany).not.toHaveBeenCalled();
        });

        it('should return empty array when no cart items found', async () => {
            prismaService.user_cart.findMany.mockResolvedValue([]);

            const result = await repository.getUserCart('user123');

            expect(result).toEqual([]);
        });
    });

    describe('addToCart', () => {
        let cartEntity: CartEntity;

        beforeEach(() => {
            cartEntity = new CartEntity({
                userId: 'user123',
                productId: 'product456',
                quantity: 2,
                addedAt: new Date(),
                delFlag: false,
                insUserId: 'admin123',
                insDateTime: new Date(),
                updUserId: 'admin123',
                updDateTime: new Date(),
            });
        });

        it('should create new cart item when not exists', async () => {
            prismaService.user_cart.findUnique.mockResolvedValue(null);
            prismaService.user_cart.create.mockResolvedValue(mockCartData);

            const result = await repository.addToCart(cartEntity);

            expect(prismaService.user_cart.findUnique).toHaveBeenCalledWith({
                where: {
                    unique_user_product_cart: {
                        user_id: 'user123',
                        product_id: 'product456',
                    },
                },
            });
            expect(prismaService.user_cart.create).toHaveBeenCalled();
            expect(result).toBeInstanceOf(CartEntity);
        });

        it('should update existing cart item when already exists', async () => {
            const existingItem = { ...mockCartData, quantity: 3 };
            prismaService.user_cart.findUnique.mockResolvedValue(existingItem);
            prismaService.user_cart.update.mockResolvedValue({
                ...mockCartData,
                quantity: 5, // 3 + 2
            });

            const result = await repository.addToCart(cartEntity);

            expect(prismaService.user_cart.update).toHaveBeenCalledWith({
                where: {
                    cart_id: 'cart123',
                },
                data: {
                    quantity: 5,
                    upd_date_time: expect.any(Date),
                },
                include: expect.any(Object),
            });
            expect(result).toBeInstanceOf(CartEntity);
        });

        it('should throw error when adding would exceed maximum quantity', async () => {
            const existingItem = { ...mockCartData, quantity: CART_CONSTANTS.MAX_QUANTITY - 1 };
            prismaService.user_cart.findUnique.mockResolvedValue(existingItem);

            // Cart entity with quantity 2, which would make total exceed max
            const invalidCartEntity = new CartEntity({
                ...cartEntity['props'],
                quantity: 2,
            });

            await expect(repository.addToCart(invalidCartEntity))
                .rejects.toThrow(TouriiBackendAppException);

            expect(prismaService.user_cart.update).not.toHaveBeenCalled();
        });

        it('should throw error for invalid cart item', async () => {
            await expect(repository.addToCart(null as any))
                .rejects.toThrow(TouriiBackendAppException);

            expect(prismaService.user_cart.findUnique).not.toHaveBeenCalled();
        });

        it('should throw error for cart item with invalid quantity', async () => {
            const invalidCartEntity = new CartEntity({
                userId: 'user123',
                productId: 'product456',
                quantity: CART_CONSTANTS.MAX_QUANTITY + 1, // Exceeds max
                addedAt: new Date(),
                delFlag: false,
                insUserId: 'admin123',
                insDateTime: new Date(),
                updUserId: 'admin123',
                updDateTime: new Date(),
            });

            await expect(repository.addToCart(invalidCartEntity))
                .rejects.toThrow(TouriiBackendAppException);

            expect(prismaService.user_cart.findUnique).not.toHaveBeenCalled();
        });

        it('should throw error for cart item with zero quantity', async () => {
            const invalidCartEntity = new CartEntity({
                userId: 'user123',
                productId: 'product456',
                quantity: 0,
                addedAt: new Date(),
                delFlag: false,
                insUserId: 'admin123',
                insDateTime: new Date(),
                updUserId: 'admin123',
                updDateTime: new Date(),
            });

            await expect(repository.addToCart(invalidCartEntity))
                .rejects.toThrow(TouriiBackendAppException);

            expect(prismaService.user_cart.findUnique).not.toHaveBeenCalled();
        });
    });

    describe('updateCartItemQuantity', () => {
        it('should update cart item quantity successfully', async () => {
            prismaService.user_cart.update.mockResolvedValue(mockCartData);

            const result = await repository.updateCartItemQuantity('cart123', 5);

            expect(prismaService.user_cart.update).toHaveBeenCalledWith({
                where: {
                    cart_id: 'cart123',
                },
                data: {
                    quantity: 5,
                    upd_date_time: expect.any(Date),
                },
                include: expect.any(Object),
            });
            expect(result).toBeInstanceOf(CartEntity);
        });

        it('should throw error for empty cart ID', async () => {
            await expect(repository.updateCartItemQuantity('', 5))
                .rejects.toThrow(TouriiBackendAppException);

            expect(prismaService.user_cart.update).not.toHaveBeenCalled();
        });

        it('should throw error for invalid quantity', async () => {
            await expect(repository.updateCartItemQuantity('cart123', 0))
                .rejects.toThrow(TouriiBackendAppException);

            await expect(repository.updateCartItemQuantity('cart123', CART_CONSTANTS.MAX_QUANTITY + 1))
                .rejects.toThrow(TouriiBackendAppException);

            expect(prismaService.user_cart.update).not.toHaveBeenCalled();
        });

        it('should throw error for non-integer quantity', async () => {
            await expect(repository.updateCartItemQuantity('cart123', 2.5))
                .rejects.toThrow(TouriiBackendAppException);

            expect(prismaService.user_cart.update).not.toHaveBeenCalled();
        });
    });

    describe('getCartValue', () => {
        it('should return calculated cart value using SQL aggregation', async () => {
            const mockResult = [{ total_value: 125.50 }];
            prismaService.$queryRaw.mockResolvedValue(mockResult);

            const result = await repository.getCartValue('user123');

            expect(prismaService.$queryRaw).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.stringContaining('SELECT COALESCE(SUM(uc.quantity * COALESCE(oic.price, 0)), 0) as total_value'),
                    'user123',
                ])
            );
            expect(result).toBe(125.50);
        });

        it('should return 0 when no cart items or prices', async () => {
            const mockResult = [{ total_value: null }];
            prismaService.$queryRaw.mockResolvedValue(mockResult);

            const result = await repository.getCartValue('user123');

            expect(result).toBe(0);
        });

        it('should throw error for invalid user ID', async () => {
            await expect(repository.getCartValue(''))
                .rejects.toThrow(TouriiBackendAppException);

            await expect(repository.getCartValue(null as any))
                .rejects.toThrow(TouriiBackendAppException);

            expect(prismaService.$queryRaw).not.toHaveBeenCalled();
        });

        it('should handle empty result from query', async () => {
            prismaService.$queryRaw.mockResolvedValue([]);

            const result = await repository.getCartValue('user123');

            expect(result).toBe(0);
        });
    });

    describe('validateCartAvailability', () => {
        it('should return empty array when all items available', async () => {
            const availableCartItems = [
                {
                    ...mockCartData,
                    product: {
                        ...mockCartData.product,
                        expiry_date: new Date(Date.now() + 86400000), // Future date
                    },
                },
            ];
            prismaService.user_cart.findMany.mockResolvedValue(availableCartItems);

            const result = await repository.validateCartAvailability('user123');

            expect(result).toEqual([]);
        });

        it('should return product IDs for expired items', async () => {
            const expiredCartItems = [
                {
                    ...mockCartData,
                    product: {
                        ...mockCartData.product,
                        expiry_date: new Date(Date.now() - 86400000), // Past date
                    },
                },
            ];
            prismaService.user_cart.findMany.mockResolvedValue(expiredCartItems);

            const result = await repository.validateCartAvailability('user123');

            expect(result).toContain('product456');
        });

        it('should throw error for invalid user ID', async () => {
            await expect(repository.validateCartAvailability(''))
                .rejects.toThrow(TouriiBackendAppException);

            expect(prismaService.user_cart.findMany).not.toHaveBeenCalled();
        });
    });

    describe('removeFromCart', () => {
        it('should soft delete cart item', async () => {
            prismaService.user_cart.update.mockResolvedValue({ ...mockCartData, del_flag: true });

            const result = await repository.removeFromCart('cart123');

            expect(prismaService.user_cart.update).toHaveBeenCalledWith({
                where: {
                    cart_id: 'cart123',
                },
                data: {
                    del_flag: true,
                    upd_date_time: expect.any(Date),
                },
            });
            expect(result).toBe(true);
        });

        it('should handle non-existent cart item', async () => {
            prismaService.user_cart.update.mockRejectedValue(new Error('Cart item not found'));

            const result = await repository.removeFromCart('nonexistent');

            expect(result).toBe(false);
        });
    });

    describe('clearUserCart', () => {
        it('should soft delete all user cart items', async () => {
            prismaService.user_cart.updateMany.mockResolvedValue({ count: 3 });

            const result = await repository.clearUserCart('user123');

            expect(prismaService.user_cart.updateMany).toHaveBeenCalledWith({
                where: {
                    user_id: 'user123',
                    del_flag: false,
                },
                data: {
                    del_flag: true,
                    upd_date_time: expect.any(Date),
                },
            });
            expect(result).toBe(true);
        });

        it('should return false when no items to clear', async () => {
            prismaService.user_cart.updateMany.mockResolvedValue({ count: 0 });

            const result = await repository.clearUserCart('user123');

            expect(result).toBe(false);
        });
    });

    describe('getCartItemCount', () => {
        it('should return cart item count', async () => {
            prismaService.user_cart.count.mockResolvedValue(5);

            const result = await repository.getCartItemCount('user123');

            expect(prismaService.user_cart.count).toHaveBeenCalledWith({
                where: {
                    user_id: 'user123',
                    del_flag: false,
                },
            });
            expect(result).toBe(5);
        });

        it('should return 0 for empty cart', async () => {
            prismaService.user_cart.count.mockResolvedValue(0);

            const result = await repository.getCartItemCount('user123');

            expect(result).toBe(0);
        });
    });
});
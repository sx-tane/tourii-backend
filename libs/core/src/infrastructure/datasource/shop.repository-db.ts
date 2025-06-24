import type { OnchainItemCatalog } from '@app/core/domain/catalog/onchain-item-catalog.entity';
import type {
    ShopRepository,
    ProductCatalogOptions,
    ProductCatalogResult,
    PaginationOptions,
    ProductSearchOptions,
    ProductCategory,
    ProductAvailability,
    ProductSalesStats,
    TopSellingProduct,
    ProductPriceHistory,
} from '@app/core/domain/ecommerce/shop.repository';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Injectable } from '@nestjs/common';
import { OnchainItemType, RewardType } from '@prisma/client';
import { ShopMapper } from '../mapper/shop.mapper';

@Injectable()
export class ShopRepositoryDb implements ShopRepository {
    constructor(private prisma: PrismaService) {}

    async getProductCatalog(options: ProductCatalogOptions): Promise<ProductCatalogResult> {
        const {
            page = 1,
            limit = 20,
            category,
            itemType,
            minPrice,
            maxPrice,
            searchTerm,
            sortBy = 'release_date',
            sortOrder = 'desc',
            includeExpired = false,
            availableOnly = true,
        } = options;

        const finalLimit = Math.min(Math.max(limit, 1), 100);
        const skip = (page - 1) * finalLimit;

        const whereClause: any = {
            del_flag: false,
            item_type: OnchainItemType.PERK, // Only show perks in shop
        };

        if (!includeExpired) {
            whereClause.AND = [
                {
                    OR: [
                        { expiry_date: null },
                        { expiry_date: { gte: new Date() } },
                    ],
                },
            ];
        }

        if (availableOnly) {
            whereClause.AND = whereClause.AND || [];
            whereClause.AND.push({
                OR: [
                    { release_date: null },
                    { release_date: { lte: new Date() } },
                ],
            });
        }

        if (category && category !== RewardType.UNKNOWN) {
            // Note: We'd need to add a reward_type field to onchain_item_catalog
            // or create a relationship to map items to reward types
            // For now, filtering by attributes that might contain the category
            whereClause.attributes = {
                path: ['category'],
                equals: category,
            };
        }

        if (itemType) {
            whereClause.item_type = itemType;
        }

        if (searchTerm) {
            whereClause.OR = [
                { nft_name: { contains: searchTerm, mode: 'insensitive' } },
                { nft_description: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }

        // Note: Price filtering would require a price field in onchain_item_catalog
        // This is commented out for now as the schema doesn't include pricing
        // if (minPrice || maxPrice) {
        //     whereClause.price = {};
        //     if (minPrice) whereClause.price.gte = minPrice;
        //     if (maxPrice) whereClause.price.lte = maxPrice;
        // }

        const orderBy: any = {};
        orderBy[sortBy] = sortOrder;

        const [products, totalCount, categories] = await Promise.all([
            this.prisma.onchain_item_catalog.findMany({
                where: whereClause,
                skip,
                take: finalLimit,
                orderBy,
            }),
            this.prisma.onchain_item_catalog.count({
                where: whereClause,
            }),
            this.getProductCategories(),
        ]);

        const totalPages = Math.ceil(totalCount / finalLimit);

        return {
            products: products.map((product) => ShopMapper.prismaModelToOnchainItemCatalog(product)),
            totalCount,
            page,
            limit: finalLimit,
            totalPages,
            filters: {
                categories,
                priceRange: { min: 0, max: 1000 }, // Default range - would be calculated from actual prices
                itemTypes: [OnchainItemType.PERK], // Currently only showing perks
            },
        };
    }

    async getProductById(productId: string): Promise<OnchainItemCatalog | undefined> {
        const product = await this.prisma.onchain_item_catalog.findFirst({
            where: {
                onchain_item_id: productId,
                del_flag: false,
                item_type: OnchainItemType.PERK,
            },
        });

        if (!product) return undefined;

        const entity = ShopMapper.prismaModelToOnchainItemCatalog(product);
        
        // Check if product is available
        if (!entity.isAvailable()) {
            return undefined;
        }

        return entity;
    }

    async getProductsByIds(productIds: string[]): Promise<OnchainItemCatalog[]> {
        const products = await this.prisma.onchain_item_catalog.findMany({
            where: {
                onchain_item_id: { in: productIds },
                del_flag: false,
                item_type: OnchainItemType.PERK,
            },
        });

        return products
            .map((product) => ShopMapper.prismaModelToOnchainItemCatalog(product))
            .filter((entity) => entity.isAvailable());
    }

    async getProductsByCategory(rewardType: RewardType, options: PaginationOptions): Promise<ProductCatalogResult> {
        return this.getProductCatalog({
            ...options,
            category: rewardType,
        });
    }

    async searchProducts(searchTerm: string, options: ProductSearchOptions): Promise<ProductCatalogResult> {
        return this.getProductCatalog({
            ...options,
            searchTerm,
        });
    }

    async getFeaturedProducts(limit: number): Promise<OnchainItemCatalog[]> {
        // For now, return newest available products as "featured"
        // This could be enhanced with a featured flag in the database
        const products = await this.prisma.onchain_item_catalog.findMany({
            where: {
                del_flag: false,
                item_type: OnchainItemType.PERK,
                OR: [
                    { release_date: null },
                    { release_date: { lte: new Date() } },
                ],
            },
            orderBy: {
                release_date: 'desc',
            },
            take: limit,
        });

        return products
            .map((product) => ShopMapper.prismaModelToOnchainItemCatalog(product))
            .filter((entity) => entity.isAvailable());
    }

    async getNewestProducts(limit: number): Promise<OnchainItemCatalog[]> {
        const products = await this.prisma.onchain_item_catalog.findMany({
            where: {
                del_flag: false,
                item_type: OnchainItemType.PERK,
                OR: [
                    { release_date: null },
                    { release_date: { lte: new Date() } },
                ],
            },
            orderBy: {
                release_date: 'desc',
            },
            take: limit,
        });

        return products
            .map((product) => ShopMapper.prismaModelToOnchainItemCatalog(product))
            .filter((entity) => entity.isAvailable());
    }

    async getProductsByPriceRange(minPrice: number, maxPrice: number, options: PaginationOptions): Promise<ProductCatalogResult> {
        // Price filtering not implemented yet as schema doesn't include price field
        return this.getProductCatalog({
            ...options,
            minPrice,
            maxPrice,
        });
    }

    async getProductCategories(): Promise<ProductCategory[]> {
        // For now, return static categories based on RewardType enum
        // This could be enhanced by analyzing actual product attributes
        const categories: ProductCategory[] = Object.values(RewardType)
            .filter(type => type !== RewardType.UNKNOWN)
            .map(type => ({
                rewardType: type,
                name: type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
                description: `Perks and experiences related to ${type.replace(/_/g, ' ').toLowerCase()}`,
                productCount: 0, // Would need to count actual products per category
                imageUrl: undefined,
            }));

        return categories;
    }

    async getProductRecommendations(userId: string, limit: number): Promise<OnchainItemCatalog[]> {
        // Basic recommendation: return popular/newest products
        // This could be enhanced with user behavior analysis
        return this.getFeaturedProducts(limit);
    }

    async getRelatedProducts(productId: string, limit: number): Promise<OnchainItemCatalog[]> {
        const product = await this.getProductById(productId);
        if (!product) return [];

        // Find products with similar attributes or same item type
        const relatedProducts = await this.prisma.onchain_item_catalog.findMany({
            where: {
                onchain_item_id: { not: productId },
                del_flag: false,
                item_type: OnchainItemType.PERK,
                OR: [
                    { release_date: null },
                    { release_date: { lte: new Date() } },
                ],
            },
            orderBy: {
                release_date: 'desc',
            },
            take: limit,
        });

        return relatedProducts
            .map((product) => ShopMapper.prismaModelToOnchainItemCatalog(product))
            .filter((entity) => entity.isAvailable());
    }

    async checkProductAvailability(productId: string, quantity: number): Promise<ProductAvailability> {
        const product = await this.getProductById(productId);
        
        if (!product) {
            return {
                isAvailable: false,
                maxQuantityAvailable: 0,
                hasSupplyLimit: false,
                isExpired: false,
                message: 'Product not found',
            };
        }

        const isExpired = product.expiryDate ? product.expiryDate < new Date() : false;
        const hasSupplyLimit = product.hasSupplyLimit();
        const maxQuantityAvailable = hasSupplyLimit ? (product.maxSupply || 0) : 999999;

        return {
            isAvailable: product.isAvailable() && quantity <= maxQuantityAvailable,
            maxQuantityAvailable,
            hasSupplyLimit,
            isExpired,
            message: !product.isAvailable() 
                ? 'Product is not available' 
                : quantity > maxQuantityAvailable 
                    ? `Only ${maxQuantityAvailable} items available`
                    : 'Product is available',
        };
    }

    async getProductsExpiringSoon(days: number, options: PaginationOptions): Promise<ProductCatalogResult> {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + days);

        return this.getProductCatalog({
            ...options,
            // This would require additional filtering logic
        });
    }

    async getLimitedSupplyProducts(options: PaginationOptions): Promise<ProductCatalogResult> {
        const { page = 1, limit = 20, sortBy = 'max_supply', sortOrder = 'asc' } = options;

        const finalLimit = Math.min(Math.max(limit, 1), 100);
        const skip = (page - 1) * finalLimit;

        const whereClause = {
            del_flag: false,
            item_type: OnchainItemType.PERK,
            max_supply: { not: null, gt: 0 },
            OR: [
                { release_date: null },
                { release_date: { lte: new Date() } },
            ],
        };

        const orderBy: any = {};
        orderBy[sortBy] = sortOrder;

        const [products, totalCount, categories] = await Promise.all([
            this.prisma.onchain_item_catalog.findMany({
                where: whereClause,
                skip,
                take: finalLimit,
                orderBy,
            }),
            this.prisma.onchain_item_catalog.count({
                where: whereClause,
            }),
            this.getProductCategories(),
        ]);

        const totalPages = Math.ceil(totalCount / finalLimit);

        return {
            products: products.map((product) => ShopMapper.prismaModelToOnchainItemCatalog(product)),
            totalCount,
            page,
            limit: finalLimit,
            totalPages,
            filters: {
                categories,
                priceRange: { min: 0, max: 1000 },
                itemTypes: [OnchainItemType.PERK],
            },
        };
    }

    async getProductSalesStats(productId: string, startDate: Date, endDate: Date): Promise<ProductSalesStats> {
        // This would require querying order_items table
        const salesData = await this.prisma.user_order_item.aggregate({
            where: {
                product_id: productId,
                order: {
                    order_date: {
                        gte: startDate,
                        lte: endDate,
                    },
                    order_status: { in: ['COMPLETED', 'FULFILLED'] },
                },
            },
            _sum: {
                quantity: true,
                total_price: true,
            },
            _avg: {
                total_price: true,
            },
        });

        return {
            productId,
            totalSales: salesData._sum.quantity || 0,
            totalRevenue: Number(salesData._sum.total_price) || 0,
            averageOrderValue: Number(salesData._avg.total_price) || 0,
            salesByPeriod: {},
            topBuyingCountries: [],
        };
    }

    async getTopSellingProducts(period: 'week' | 'month' | 'year', limit: number): Promise<TopSellingProduct[]> {
        const startDate = new Date();
        
        switch (period) {
            case 'week':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
        }

        const topSelling = await this.prisma.user_order_item.groupBy({
            by: ['product_id'],
            where: {
                order: {
                    order_date: { gte: startDate },
                    order_status: { in: ['COMPLETED', 'FULFILLED'] },
                },
            },
            _sum: {
                quantity: true,
                total_price: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: limit,
        });

        const products = await this.getProductsByIds(
            topSelling.map(item => item.product_id)
        );

        return topSelling.map((item, index) => {
            const product = products.find(p => p.onchainItemId === item.product_id);
            return {
                product: product!,
                salesCount: item._sum.quantity || 0,
                totalRevenue: Number(item._sum.total_price) || 0,
                rank: index + 1,
            };
        }).filter(item => item.product);
    }

    async getProductsByItemType(itemType: OnchainItemType, options: PaginationOptions): Promise<ProductCatalogResult> {
        return this.getProductCatalog({
            ...options,
            itemType,
        });
    }

    async updateProductAvailability(productId: string, isAvailable: boolean): Promise<OnchainItemCatalog> {
        const updatedProduct = await this.prisma.onchain_item_catalog.update({
            where: {
                onchain_item_id: productId,
            },
            data: {
                del_flag: !isAvailable,
                upd_date_time: new Date(),
            },
        });

        return ShopMapper.prismaModelToOnchainItemCatalog(updatedProduct);
    }

    async getProductPricingHistory(productId: string, days: number): Promise<ProductPriceHistory[]> {
        // Price history not implemented yet as schema doesn't include price tracking
        // Would require a separate price_history table
        return [];
    }
}
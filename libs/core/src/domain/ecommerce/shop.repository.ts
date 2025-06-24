import type { OnchainItemType, RewardType } from '@prisma/client';
import type { OnchainItemCatalog } from '../catalog/onchain-item-catalog.entity';

export interface ShopRepository {
    /**
     * Get product catalog with filtering and pagination
     * @param options - Filter and pagination options
     * @returns Paginated product catalog
     */
    getProductCatalog(options: ProductCatalogOptions): Promise<ProductCatalogResult>;

    /**
     * Get product by ID
     * @param productId - Product ID
     * @returns Product if exists and available
     */
    getProductById(productId: string): Promise<OnchainItemCatalog | undefined>;

    /**
     * Get multiple products by IDs
     * @param productIds - Array of product IDs
     * @returns Array of products
     */
    getProductsByIds(productIds: string[]): Promise<OnchainItemCatalog[]>;

    /**
     * Get products by category (reward type)
     * @param rewardType - Reward type category
     * @param options - Pagination options
     * @returns Products in category
     */
    getProductsByCategory(rewardType: RewardType, options: PaginationOptions): Promise<ProductCatalogResult>;

    /**
     * Search products by name or description
     * @param searchTerm - Search term
     * @param options - Search and pagination options
     * @returns Matching products
     */
    searchProducts(searchTerm: string, options: ProductSearchOptions): Promise<ProductCatalogResult>;

    /**
     * Get featured products
     * @param limit - Number of featured products to return
     * @returns Featured products
     */
    getFeaturedProducts(limit: number): Promise<OnchainItemCatalog[]>;

    /**
     * Get newest products
     * @param limit - Number of newest products to return
     * @returns Newest products
     */
    getNewestProducts(limit: number): Promise<OnchainItemCatalog[]>;

    /**
     * Get products by price range
     * @param minPrice - Minimum price
     * @param maxPrice - Maximum price
     * @param options - Pagination options
     * @returns Products in price range
     */
    getProductsByPriceRange(minPrice: number, maxPrice: number, options: PaginationOptions): Promise<ProductCatalogResult>;

    /**
     * Get available product categories
     * @returns List of available reward types with product counts
     */
    getProductCategories(): Promise<ProductCategory[]>;

    /**
     * Get product recommendations for user
     * @param userId - User ID
     * @param limit - Number of recommendations
     * @returns Recommended products
     */
    getProductRecommendations(userId: string, limit: number): Promise<OnchainItemCatalog[]>;

    /**
     * Get related products
     * @param productId - Product ID
     * @param limit - Number of related products
     * @returns Related products
     */
    getRelatedProducts(productId: string, limit: number): Promise<OnchainItemCatalog[]>;

    /**
     * Check product availability
     * @param productId - Product ID
     * @param quantity - Desired quantity
     * @returns Availability information
     */
    checkProductAvailability(productId: string, quantity: number): Promise<ProductAvailability>;

    /**
     * Get products expiring soon
     * @param days - Number of days to look ahead
     * @param options - Pagination options
     * @returns Products expiring soon
     */
    getProductsExpiringSoon(days: number, options: PaginationOptions): Promise<ProductCatalogResult>;

    /**
     * Get products with limited supply
     * @param options - Pagination options
     * @returns Products with limited supply
     */
    getLimitedSupplyProducts(options: PaginationOptions): Promise<ProductCatalogResult>;

    /**
     * Get product sales statistics
     * @param productId - Product ID
     * @param startDate - Start date for statistics
     * @param endDate - End date for statistics
     * @returns Product sales statistics
     */
    getProductSalesStats(productId: string, startDate: Date, endDate: Date): Promise<ProductSalesStats>;

    /**
     * Get top-selling products
     * @param period - Time period ('week' | 'month' | 'year')
     * @param limit - Number of products to return
     * @returns Top-selling products
     */
    getTopSellingProducts(period: 'week' | 'month' | 'year', limit: number): Promise<TopSellingProduct[]>;

    /**
     * Get products by item type
     * @param itemType - Onchain item type
     * @param options - Pagination options
     * @returns Products of specified type
     */
    getProductsByItemType(itemType: OnchainItemType, options: PaginationOptions): Promise<ProductCatalogResult>;

    /**
     * Update product availability
     * @param productId - Product ID
     * @param isAvailable - Availability status
     * @returns Updated product
     */
    updateProductAvailability(productId: string, isAvailable: boolean): Promise<OnchainItemCatalog>;

    /**
     * Get product pricing history
     * @param productId - Product ID
     * @param days - Number of days of history
     * @returns Pricing history
     */
    getProductPricingHistory(productId: string, days: number): Promise<ProductPriceHistory[]>;
}

export interface ProductCatalogOptions {
    page: number;
    limit: number;
    category?: RewardType;
    itemType?: OnchainItemType;
    minPrice?: number;
    maxPrice?: number;
    searchTerm?: string;
    sortBy?: 'name' | 'price' | 'release_date' | 'popularity';
    sortOrder?: 'asc' | 'desc';
    includeExpired?: boolean;
    availableOnly?: boolean;
}

export interface ProductCatalogResult {
    products: OnchainItemCatalog[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
    filters: {
        categories: ProductCategory[];
        priceRange: { min: number; max: number };
        itemTypes: OnchainItemType[];
    };
}

export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface ProductSearchOptions extends PaginationOptions {
    category?: RewardType;
    itemType?: OnchainItemType;
    minPrice?: number;
    maxPrice?: number;
    includeExpired?: boolean;
}

export interface ProductCategory {
    rewardType: RewardType;
    name: string;
    description?: string;
    productCount: number;
    imageUrl?: string;
}

export interface ProductAvailability {
    isAvailable: boolean;
    maxQuantityAvailable: number;
    hasSupplyLimit: boolean;
    isExpired: boolean;
    message?: string;
}

export interface ProductSalesStats {
    productId: string;
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    salesByPeriod: Record<string, number>;
    topBuyingCountries: Array<{ country: string; sales: number }>;
}

export interface TopSellingProduct {
    product: OnchainItemCatalog;
    salesCount: number;
    totalRevenue: number;
    rank: number;
}

export interface ProductPriceHistory {
    date: Date;
    price: number;
    currency: string;
}
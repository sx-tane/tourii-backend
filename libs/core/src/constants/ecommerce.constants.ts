/**
 * E-commerce system constants
 * Contains all magic numbers and configuration values used throughout the e-commerce system
 */

// Cart constants
export const CART_CONSTANTS = {
    /** Maximum quantity per cart item */
    MAX_QUANTITY: 999,
    /** Minimum quantity per cart item */
    MIN_QUANTITY: 1,
    /** Maximum cart items per user */
    MAX_CART_ITEMS: 100,
    /** Days to keep abandoned cart items before cleanup */
    ABANDONED_CART_CLEANUP_DAYS: 30,
} as const;

// Order constants
export const ORDER_CONSTANTS = {
    /** Maximum orders per user query */
    MAX_ORDERS_PER_QUERY: 100,
    /** Default orders per page */
    DEFAULT_ORDERS_PER_PAGE: 20,
    /** Minimum order amount (in cents) */
    MIN_ORDER_AMOUNT: 1,
    /** Maximum order amount (in cents) */
    MAX_ORDER_AMOUNT: 1000000000, // $10M
    /** Days to auto-cancel unpaid orders */
    AUTO_CANCEL_DAYS: 7,
    /** Days to automatically complete orders */
    AUTO_COMPLETE_DAYS: 30,
} as const;

// Shop constants
export const SHOP_CONSTANTS = {
    /** Maximum products per query */
    MAX_PRODUCTS_PER_QUERY: 100,
    /** Default products per page */
    DEFAULT_PRODUCTS_PER_PAGE: 20,
    /** Default price range for search */
    DEFAULT_PRICE_RANGE: {
        min: 0,
        max: 1000000, // $10,000
    },
    /** Unlimited stock indicator */
    UNLIMITED_STOCK: 999999,
    /** Maximum search query length */
    MAX_SEARCH_QUERY_LENGTH: 255,
} as const;

// Payment constants
export const PAYMENT_CONSTANTS = {
    /** Default payment processing fee percentage */
    DEFAULT_PROCESSING_FEE_PERCENT: 2.9,
    /** Fixed payment processing fee (in cents) */
    FIXED_PROCESSING_FEE: 30,
    /** Maximum payment amount (in cents) */
    MAX_PAYMENT_AMOUNT: 1000000000, // $10M
    /** Minimum payment amount (in cents) */
    MIN_PAYMENT_AMOUNT: 50, // $0.50
    /** Payment timeout in minutes */
    PAYMENT_TIMEOUT_MINUTES: 30,
    /** Supported currencies */
    SUPPORTED_CURRENCIES: ['USD', 'EUR', 'JPY', 'GBP'] as const,
    /** Default currency */
    DEFAULT_CURRENCY: 'USD',
} as const;

// Pagination constants
export const PAGINATION_CONSTANTS = {
    /** Maximum items per page for any query */
    MAX_LIMIT: 100,
    /** Default items per page */
    DEFAULT_LIMIT: 20,
    /** Minimum items per page */
    MIN_LIMIT: 1,
    /** Maximum page number */
    MAX_PAGE: 10000,
    /** Default page number */
    DEFAULT_PAGE: 1,
} as const;

// Validation constants
export const VALIDATION_CONSTANTS = {
    /** Maximum string length for names/descriptions */
    MAX_NAME_LENGTH: 255,
    /** Maximum string length for addresses */
    MAX_ADDRESS_LENGTH: 500,
    /** Maximum string length for notes/comments */
    MAX_NOTES_LENGTH: 1000,
    /** Minimum string length for required fields */
    MIN_REQUIRED_LENGTH: 1,
    /** UUID regex pattern */
    UUID_PATTERN: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    /** Email regex pattern */
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    /** Phone number regex pattern (international) */
    PHONE_PATTERN: /^\+?[1-9]\d{1,14}$/,
} as const;

// Time constants (in milliseconds)
export const TIME_CONSTANTS = {
    /** Milliseconds in a second */
    SECOND: 1000,
    /** Milliseconds in a minute */
    MINUTE: 60 * 1000,
    /** Milliseconds in an hour */
    HOUR: 60 * 60 * 1000,
    /** Milliseconds in a day */
    DAY: 24 * 60 * 60 * 1000,
    /** Milliseconds in a week */
    WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

// Status constants
export const STATUS_CONSTANTS = {
    /** Valid order statuses for transitions */
    CANCELLABLE_ORDER_STATUSES: ['PENDING', 'PROCESSING'] as const,
    /** Valid order statuses for refunds */
    REFUNDABLE_ORDER_STATUSES: ['COMPLETED', 'DELIVERED'] as const,
    /** Final order statuses that cannot be changed */
    FINAL_ORDER_STATUSES: ['CANCELLED', 'REFUNDED'] as const,
} as const;
import type { OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import type { OrderEntity } from './order.entity';
import type { OrderItemEntity } from './order-item.entity';

export interface OrderRepository {
    /**
     * Create a new order
     * @param order - Order to create
     * @returns Created order
     */
    createOrder(order: OrderEntity): Promise<OrderEntity>;

    /**
     * Get order by ID
     * @param orderId - Order ID
     * @returns Order if exists
     */
    getOrderById(orderId: string): Promise<OrderEntity | undefined>;

    /**
     * Get order by ID with items
     * @param orderId - Order ID
     * @returns Order with items if exists
     */
    getOrderWithItems(orderId: string): Promise<OrderEntity | undefined>;

    /**
     * Update order
     * @param order - Order to update
     * @returns Updated order
     */
    updateOrder(order: OrderEntity): Promise<OrderEntity>;

    /**
     * Update order status
     * @param orderId - Order ID
     * @param status - New order status
     * @returns Updated order
     */
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderEntity>;

    /**
     * Update payment status
     * @param orderId - Order ID
     * @param paymentStatus - New payment status
     * @param transactionId - Payment transaction ID
     * @returns Updated order
     */
    updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus, transactionId?: string): Promise<OrderEntity>;

    /**
     * Get user's orders with pagination
     * @param userId - User ID
     * @param options - Pagination and filter options
     * @returns Paginated list of orders
     */
    getUserOrders(userId: string, options: GetUserOrdersOptions): Promise<GetUserOrdersResult>;

    /**
     * Get user's order by ID
     * @param userId - User ID
     * @param orderId - Order ID
     * @returns Order if exists and belongs to user
     */
    getUserOrderById(userId: string, orderId: string): Promise<OrderEntity | undefined>;

    /**
     * Get orders by status
     * @param status - Order status
     * @param options - Pagination options
     * @returns Paginated list of orders
     */
    getOrdersByStatus(status: OrderStatus, options: PaginationOptions): Promise<GetOrdersResult>;

    /**
     * Get orders by payment status
     * @param paymentStatus - Payment status
     * @param options - Pagination options
     * @returns Paginated list of orders
     */
    getOrdersByPaymentStatus(paymentStatus: PaymentStatus, options: PaginationOptions): Promise<GetOrdersResult>;

    /**
     * Get orders requiring fulfillment
     * @param options - Pagination options
     * @returns Orders that need fulfillment
     */
    getOrdersRequiringFulfillment(options: PaginationOptions): Promise<GetOrdersResult>;

    /**
     * Get user's order statistics
     * @param userId - User ID
     * @returns Order statistics for the user
     */
    getUserOrderStats(userId: string): Promise<UserOrderStats>;

    /**
     * Search orders by criteria
     * @param criteria - Search criteria
     * @param options - Pagination options
     * @returns Matching orders
     */
    searchOrders(criteria: OrderSearchCriteria, options: PaginationOptions): Promise<GetOrdersResult>;

    /**
     * Get orders within date range
     * @param startDate - Start date
     * @param endDate - End date
     * @param options - Pagination options
     * @returns Orders within date range
     */
    getOrdersByDateRange(startDate: Date, endDate: Date, options: PaginationOptions): Promise<GetOrdersResult>;

    /**
     * Get order by payment transaction ID
     * @param transactionId - Payment transaction ID
     * @returns Order if exists
     */
    getOrderByPaymentTransaction(transactionId: string): Promise<OrderEntity | undefined>;

    /**
     * Get daily order summary
     * @param date - Date to get summary for
     * @returns Daily order summary
     */
    getDailyOrderSummary(date: Date): Promise<DailyOrderSummary>;

    /**
     * Get monthly order summary
     * @param year - Year
     * @param month - Month (1-12)
     * @returns Monthly order summary
     */
    getMonthlyOrderSummary(year: number, month: number): Promise<MonthlyOrderSummary>;

    /**
     * Cancel order
     * @param orderId - Order ID
     * @param reason - Cancellation reason
     * @returns Updated order
     */
    cancelOrder(orderId: string, reason: string): Promise<OrderEntity>;

    /**
     * Refund order
     * @param orderId - Order ID
     * @param refundAmount - Amount to refund
     * @param reason - Refund reason
     * @returns Updated order
     */
    refundOrder(orderId: string, refundAmount: number, reason: string): Promise<OrderEntity>;
}

export interface GetUserOrdersOptions {
    page: number;
    limit: number;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    startDate?: Date;
    endDate?: Date;
    sortBy?: 'order_date' | 'total_amount' | 'order_status';
    sortOrder?: 'asc' | 'desc';
}

export interface GetUserOrdersResult {
    orders: OrderEntity[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface GetOrdersResult {
    orders: OrderEntity[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface UserOrderStats {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    ordersByStatus: Record<OrderStatus, number>;
    firstOrderDate?: Date;
    lastOrderDate?: Date;
    favoritePaymentMethod?: PaymentMethod;
}

export interface OrderSearchCriteria {
    userId?: string;
    customerEmail?: string;
    paymentTransactionId?: string;
    totalAmountMin?: number;
    totalAmountMax?: number;
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
}

export interface DailyOrderSummary {
    date: Date;
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: Record<OrderStatus, number>;
    ordersByPaymentMethod: Record<PaymentMethod, number>;
}

export interface MonthlyOrderSummary {
    year: number;
    month: number;
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: Record<OrderStatus, number>;
    ordersByPaymentMethod: Record<PaymentMethod, number>;
    dailySummaries: DailyOrderSummary[];
}
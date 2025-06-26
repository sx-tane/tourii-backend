import type { OrderEntity } from '@app/core/domain/ecommerce/order.entity';
import type {
    OrderRepository,
    GetUserOrdersOptions,
    GetUserOrdersResult,
    PaginationOptions,
    GetOrdersResult,
    UserOrderStats,
    OrderSearchCriteria,
    DailyOrderSummary,
    MonthlyOrderSummary,
} from '@app/core/domain/ecommerce/order.repository';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Injectable } from '@nestjs/common';
import { OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { OrderMapper } from '../mapper/order.mapper';
import { PAGINATION_CONSTANTS, TIME_CONSTANTS } from '../../constants/ecommerce.constants';

@Injectable()
export class OrderRepositoryDb implements OrderRepository {
    constructor(private prisma: PrismaService) {}

    // Include related data for orders
    private readonly orderInclude = {
        user: {
            select: {
                user_id: true,
                username: true,
                email: true,
            },
        },
        order_items: {
            include: {
                product: {
                    select: {
                        onchain_item_id: true,
                        item_type: true,
                        nft_name: true,
                        nft_description: true,
                        image_url: true,
                    },
                },
            },
        },
    };

    private readonly orderBasicInclude = {
        user: {
            select: {
                user_id: true,
                username: true,
                email: true,
            },
        },
    };

    async createOrder(order: OrderEntity): Promise<OrderEntity> {
        const createdOrder = await this.prisma.user_order.create({
            data: OrderMapper.orderEntityToPrismaInput(order),
            include: this.orderInclude,
        });

        return OrderMapper.prismaModelToOrderEntity(createdOrder as any);
    }

    async getOrderById(orderId: string): Promise<OrderEntity | undefined> {
        const order = await this.prisma.user_order.findUnique({
            where: {
                order_id: orderId,
            },
            include: this.orderBasicInclude,
        });

        return order ? OrderMapper.prismaModelToOrderEntity(order as any) : undefined;
    }

    async getOrderWithItems(orderId: string): Promise<OrderEntity | undefined> {
        const order = await this.prisma.user_order.findUnique({
            where: {
                order_id: orderId,
            },
            include: this.orderInclude,
        });

        return order ? OrderMapper.prismaModelToOrderEntity(order as any) : undefined;
    }

    async updateOrder(order: OrderEntity): Promise<OrderEntity> {
        const updatedOrder = await this.prisma.user_order.update({
            where: {
                order_id: order.orderId!,
            },
            data: OrderMapper.orderEntityToPrismaUpdateInput(order),
            include: this.orderInclude,
        });

        return OrderMapper.prismaModelToOrderEntity(updatedOrder as any);
    }

    async updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderEntity> {
        const updatedOrder = await this.prisma.user_order.update({
            where: {
                order_id: orderId,
            },
            data: {
                order_status: status,
                upd_date_time: new Date(),
            },
            include: this.orderInclude,
        });

        return OrderMapper.prismaModelToOrderEntity(updatedOrder as any);
    }

    async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus, transactionId?: string): Promise<OrderEntity> {
        const updateData: any = {
            payment_status: paymentStatus,
            upd_date_time: new Date(),
        };

        if (transactionId) {
            updateData.payment_transaction_id = transactionId;
        }

        if (paymentStatus === PaymentStatus.COMPLETED) {
            updateData.payment_completed_at = new Date();
        }

        const updatedOrder = await this.prisma.user_order.update({
            where: {
                order_id: orderId,
            },
            data: updateData,
            include: this.orderInclude,
        });

        return OrderMapper.prismaModelToOrderEntity(updatedOrder as any);
    }

    async getUserOrders(userId: string, options: GetUserOrdersOptions): Promise<GetUserOrdersResult> {
        const {
            page = 1,
            limit = 20,
            status,
            paymentStatus,
            startDate,
            endDate,
            sortBy = 'order_date',
            sortOrder = 'desc',
        } = options;

        const finalLimit = Math.min(Math.max(limit, PAGINATION_CONSTANTS.MIN_LIMIT), PAGINATION_CONSTANTS.MAX_LIMIT);
        const skip = (page - 1) * finalLimit;

        const whereClause: any = {
            user_id: userId,
            del_flag: false,
        };

        if (status) {
            whereClause.order_status = status;
        }

        if (paymentStatus) {
            whereClause.payment_status = paymentStatus;
        }

        if (startDate || endDate) {
            whereClause.order_date = {};
            if (startDate) {
                whereClause.order_date.gte = startDate;
            }
            if (endDate) {
                whereClause.order_date.lte = endDate;
            }
        }

        const orderBy: any = {};
        orderBy[sortBy] = sortOrder;

        const [orders, totalCount] = await Promise.all([
            this.prisma.user_order.findMany({
                where: whereClause,
                include: this.orderInclude,
                skip,
                take: finalLimit,
                orderBy,
            }),
            this.prisma.user_order.count({
                where: whereClause,
            }),
        ]);

        const totalPages = Math.ceil(totalCount / finalLimit);

        return {
            orders: orders.map((order) => OrderMapper.prismaModelToOrderEntity(order as any)),
            totalCount,
            page,
            limit: finalLimit,
            totalPages,
        };
    }

    async getUserOrderById(userId: string, orderId: string): Promise<OrderEntity | undefined> {
        const order = await this.prisma.user_order.findFirst({
            where: {
                order_id: orderId,
                user_id: userId,
            },
            include: this.orderInclude,
        });

        return order ? OrderMapper.prismaModelToOrderEntity(order as any) : undefined;
    }

    async getOrdersByStatus(status: OrderStatus, options: PaginationOptions): Promise<GetOrdersResult> {
        const { page = 1, limit = 20, sortBy = 'order_date', sortOrder = 'desc' } = options;

        const finalLimit = Math.min(Math.max(limit, PAGINATION_CONSTANTS.MIN_LIMIT), PAGINATION_CONSTANTS.MAX_LIMIT);
        const skip = (page - 1) * finalLimit;

        const orderBy: any = {};
        orderBy[sortBy] = sortOrder;

        const [orders, totalCount] = await Promise.all([
            this.prisma.user_order.findMany({
                where: {
                    order_status: status,
                    del_flag: false,
                },
                include: this.orderInclude,
                skip,
                take: finalLimit,
                orderBy,
            }),
            this.prisma.user_order.count({
                where: {
                    order_status: status,
                    del_flag: false,
                },
            }),
        ]);

        const totalPages = Math.ceil(totalCount / finalLimit);

        return {
            orders: orders.map((order) => OrderMapper.prismaModelToOrderEntity(order as any)),
            totalCount,
            page,
            limit: finalLimit,
            totalPages,
        };
    }

    async getOrdersByPaymentStatus(paymentStatus: PaymentStatus, options: PaginationOptions): Promise<GetOrdersResult> {
        const { page = 1, limit = 20, sortBy = 'order_date', sortOrder = 'desc' } = options;

        const finalLimit = Math.min(Math.max(limit, PAGINATION_CONSTANTS.MIN_LIMIT), PAGINATION_CONSTANTS.MAX_LIMIT);
        const skip = (page - 1) * finalLimit;

        const orderBy: any = {};
        orderBy[sortBy] = sortOrder;

        const [orders, totalCount] = await Promise.all([
            this.prisma.user_order.findMany({
                where: {
                    payment_status: paymentStatus,
                    del_flag: false,
                },
                include: this.orderInclude,
                skip,
                take: finalLimit,
                orderBy,
            }),
            this.prisma.user_order.count({
                where: {
                    payment_status: paymentStatus,
                    del_flag: false,
                },
            }),
        ]);

        const totalPages = Math.ceil(totalCount / finalLimit);

        return {
            orders: orders.map((order) => OrderMapper.prismaModelToOrderEntity(order as any)),
            totalCount,
            page,
            limit: finalLimit,
            totalPages,
        };
    }

    async getOrdersRequiringFulfillment(options: PaginationOptions): Promise<GetOrdersResult> {
        return this.getOrdersByStatus(OrderStatus.PAID, options);
    }

    async getUserOrderStats(userId: string): Promise<UserOrderStats> {
        const stats = await this.prisma.user_order.aggregate({
            where: {
                user_id: userId,
                del_flag: false,
            },
            _count: {
                order_id: true,
            },
            _sum: {
                total_amount: true,
            },
            _avg: {
                total_amount: true,
            },
            _min: {
                order_date: true,
            },
            _max: {
                order_date: true,
            },
        });

        // Get orders by status
        const ordersByStatus = await this.prisma.user_order.groupBy({
            by: ['order_status'],
            where: {
                user_id: userId,
                del_flag: false,
            },
            _count: {
                order_id: true,
            },
        });

        // Get most used payment method
        const paymentMethods = await this.prisma.user_order.groupBy({
            by: ['payment_method'],
            where: {
                user_id: userId,
                del_flag: false,
            },
            _count: {
                order_id: true,
            },
            orderBy: {
                _count: {
                    order_id: 'desc',
                },
            },
            take: 1,
        });

        const statusCounts: Record<OrderStatus, number> = {} as any;
        for (const status of Object.values(OrderStatus)) {
            statusCounts[status] = 0;
        }
        for (const group of ordersByStatus) {
            statusCounts[group.order_status] = group._count.order_id;
        }

        return {
            totalOrders: stats._count.order_id,
            totalSpent: Number(stats._sum.total_amount) || 0,
            averageOrderValue: Number(stats._avg.total_amount) || 0,
            ordersByStatus: statusCounts,
            firstOrderDate: stats._min.order_date,
            lastOrderDate: stats._max.order_date,
            favoritePaymentMethod: paymentMethods[0]?.payment_method,
        };
    }

    async searchOrders(criteria: OrderSearchCriteria, options: PaginationOptions): Promise<GetOrdersResult> {
        const { page = 1, limit = 20, sortBy = 'order_date', sortOrder = 'desc' } = options;

        const finalLimit = Math.min(Math.max(limit, PAGINATION_CONSTANTS.MIN_LIMIT), PAGINATION_CONSTANTS.MAX_LIMIT);
        const skip = (page - 1) * finalLimit;

        const whereClause: any = {
            del_flag: false,
        };

        if (criteria.userId) {
            whereClause.user_id = criteria.userId;
        }

        if (criteria.customerEmail) {
            whereClause.customer_email = {
                contains: criteria.customerEmail,
                mode: 'insensitive',
            };
        }

        if (criteria.paymentTransactionId) {
            whereClause.payment_transaction_id = criteria.paymentTransactionId;
        }

        if (criteria.totalAmountMin || criteria.totalAmountMax) {
            whereClause.total_amount = {};
            if (criteria.totalAmountMin) {
                whereClause.total_amount.gte = criteria.totalAmountMin;
            }
            if (criteria.totalAmountMax) {
                whereClause.total_amount.lte = criteria.totalAmountMax;
            }
        }

        if (criteria.orderStatus) {
            whereClause.order_status = criteria.orderStatus;
        }

        if (criteria.paymentStatus) {
            whereClause.payment_status = criteria.paymentStatus;
        }

        if (criteria.paymentMethod) {
            whereClause.payment_method = criteria.paymentMethod;
        }

        const orderBy: any = {};
        orderBy[sortBy] = sortOrder;

        const [orders, totalCount] = await Promise.all([
            this.prisma.user_order.findMany({
                where: whereClause,
                include: this.orderInclude,
                skip,
                take: finalLimit,
                orderBy,
            }),
            this.prisma.user_order.count({
                where: whereClause,
            }),
        ]);

        const totalPages = Math.ceil(totalCount / finalLimit);

        return {
            orders: orders.map((order) => OrderMapper.prismaModelToOrderEntity(order as any)),
            totalCount,
            page,
            limit: finalLimit,
            totalPages,
        };
    }

    async getOrdersByDateRange(startDate: Date, endDate: Date, options: PaginationOptions): Promise<GetOrdersResult> {
        const { page = 1, limit = 20, sortBy = 'order_date', sortOrder = 'desc' } = options;

        const finalLimit = Math.min(Math.max(limit, PAGINATION_CONSTANTS.MIN_LIMIT), PAGINATION_CONSTANTS.MAX_LIMIT);
        const skip = (page - 1) * finalLimit;

        const orderBy: any = {};
        orderBy[sortBy] = sortOrder;

        const [orders, totalCount] = await Promise.all([
            this.prisma.user_order.findMany({
                where: {
                    order_date: {
                        gte: startDate,
                        lte: endDate,
                    },
                    del_flag: false,
                },
                include: this.orderInclude,
                skip,
                take: finalLimit,
                orderBy,
            }),
            this.prisma.user_order.count({
                where: {
                    order_date: {
                        gte: startDate,
                        lte: endDate,
                    },
                    del_flag: false,
                },
            }),
        ]);

        const totalPages = Math.ceil(totalCount / finalLimit);

        return {
            orders: orders.map((order) => OrderMapper.prismaModelToOrderEntity(order as any)),
            totalCount,
            page,
            limit: finalLimit,
            totalPages,
        };
    }

    async getOrderByPaymentTransaction(transactionId: string): Promise<OrderEntity | undefined> {
        const order = await this.prisma.user_order.findFirst({
            where: {
                payment_transaction_id: transactionId,
            },
            include: this.orderInclude,
        });

        return order ? OrderMapper.prismaModelToOrderEntity(order as any) : undefined;
    }

    async getDailyOrderSummary(date: Date): Promise<DailyOrderSummary> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const [stats, ordersByStatus, ordersByPaymentMethod] = await Promise.all([
            this.prisma.user_order.aggregate({
                where: {
                    order_date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                    del_flag: false,
                },
                _count: {
                    order_id: true,
                },
                _sum: {
                    total_amount: true,
                },
                _avg: {
                    total_amount: true,
                },
            }),
            this.prisma.user_order.groupBy({
                by: ['order_status'],
                where: {
                    order_date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                    del_flag: false,
                },
                _count: {
                    order_id: true,
                },
            }),
            this.prisma.user_order.groupBy({
                by: ['payment_method'],
                where: {
                    order_date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                    del_flag: false,
                },
                _count: {
                    order_id: true,
                },
            }),
        ]);

        const statusCounts: Record<OrderStatus, number> = {} as any;
        for (const status of Object.values(OrderStatus)) {
            statusCounts[status] = 0;
        }
        for (const group of ordersByStatus) {
            statusCounts[group.order_status] = group._count.order_id;
        }

        const paymentMethodCounts: Record<PaymentMethod, number> = {} as any;
        for (const method of Object.values(PaymentMethod)) {
            paymentMethodCounts[method] = 0;
        }
        for (const group of ordersByPaymentMethod) {
            paymentMethodCounts[group.payment_method] = group._count.order_id;
        }

        return {
            date,
            totalOrders: stats._count.order_id,
            totalRevenue: Number(stats._sum.total_amount) || 0,
            averageOrderValue: Number(stats._avg.total_amount) || 0,
            ordersByStatus: statusCounts,
            ordersByPaymentMethod: paymentMethodCounts,
        };
    }

    async getMonthlyOrderSummary(year: number, month: number): Promise<MonthlyOrderSummary> {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

        const dailySummaries: DailyOrderSummary[] = [];
        const currentDate = new Date(startOfMonth);

        while (currentDate <= endOfMonth) {
            const dailySummary = await this.getDailyOrderSummary(new Date(currentDate));
            dailySummaries.push(dailySummary);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Aggregate monthly totals
        const totalOrders = dailySummaries.reduce((sum, day) => sum + day.totalOrders, 0);
        const totalRevenue = dailySummaries.reduce((sum, day) => sum + day.totalRevenue, 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const ordersByStatus: Record<OrderStatus, number> = {} as any;
        const ordersByPaymentMethod: Record<PaymentMethod, number> = {} as any;

        for (const status of Object.values(OrderStatus)) {
            ordersByStatus[status] = dailySummaries.reduce((sum, day) => sum + day.ordersByStatus[status], 0);
        }

        for (const method of Object.values(PaymentMethod)) {
            ordersByPaymentMethod[method] = dailySummaries.reduce((sum, day) => sum + day.ordersByPaymentMethod[method], 0);
        }

        return {
            year,
            month,
            totalOrders,
            totalRevenue,
            averageOrderValue,
            ordersByStatus,
            ordersByPaymentMethod,
            dailySummaries,
        };
    }

    async cancelOrder(orderId: string, reason: string): Promise<OrderEntity> {
        const updatedOrder = await this.prisma.user_order.update({
            where: {
                order_id: orderId,
            },
            data: {
                order_status: OrderStatus.CANCELLED,
                fulfillment_notes: reason,
                upd_date_time: new Date(),
            },
            include: this.orderInclude,
        });

        return OrderMapper.prismaModelToOrderEntity(updatedOrder as any);
    }

    async refundOrder(orderId: string, refundAmount: number, reason: string): Promise<OrderEntity> {
        const updatedOrder = await this.prisma.user_order.update({
            where: {
                order_id: orderId,
            },
            data: {
                order_status: OrderStatus.REFUNDED,
                payment_status: PaymentStatus.REFUNDED,
                fulfillment_notes: `Refunded: ${refundAmount}. Reason: ${reason}`,
                upd_date_time: new Date(),
            },
            include: this.orderInclude,
        });

        return OrderMapper.prismaModelToOrderEntity(updatedOrder as any);
    }
}
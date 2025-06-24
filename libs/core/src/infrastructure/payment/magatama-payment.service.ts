import type {
    PaymentRepository,
    PaymentRequest,
    PaymentResult,
    PaymentVerificationResult,
    RefundRequest,
    RefundResult,
    CancellationResult,
    PaymentDetails,
    PaymentIntentRequest,
    PaymentIntent,
    PaymentConfirmationData,
    PaymentMethodInfo,
    PaymentFeeCalculation,
    PaymentMethodData,
    PaymentMethodValidation,
    PaymentWebhook,
    WebhookResult,
    PaymentAnalytics,
    SubscriptionPaymentRequest,
    SubscriptionPaymentResult,
    PaymentGatewayConfig,
} from '@app/core/domain/ecommerce/payment.repository';
import { Injectable, Logger } from '@nestjs/common';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import type { UserRepository } from '@app/core/domain/user/user.repository';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';

interface MagatamaTransaction {
    transactionId: string;
    userId: string;
    orderId: string;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
    status: PaymentStatus;
    balanceBefore: number;
    balanceAfter: number;
    createdAt: Date;
    completedAt?: Date;
    metadata?: Record<string, any>;
}

@Injectable()
export class MagatamaPaymentService implements PaymentRepository {
    private readonly logger = new Logger(MagatamaPaymentService.name);
    private readonly transactionHistory = new Map<string, MagatamaTransaction>();

    constructor(private readonly userRepository: UserRepository) {}

    async processPayment(request: PaymentRequest): Promise<PaymentResult> {
        this.logger.log(`Processing Magatama payment for order ${request.orderId}`);

        try {
            if (request.paymentMethod !== PaymentMethod.MAGATAMA_POINTS) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_PAYMENT_001,
                    'This service only handles Magatama point payments'
                );
            }

            // Get user to check current balance
            const user = await this.userRepository.findById(request.userId);
            if (!user) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_USER_001,
                    'User not found'
                );
            }

            const currentBalance = user.userInfo?.magatamaPoints || 0;
            const requiredPoints = Math.round(request.amount); // Convert to whole points

            // Check if user has sufficient balance
            if (currentBalance < requiredPoints) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_PAYMENT_002,
                    `Insufficient Magatama points. Required: ${requiredPoints}, Available: ${currentBalance}`
                );
            }

            // Generate transaction ID
            const transactionId = `magatama_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Deduct points from user balance
            const newBalance = currentBalance - requiredPoints;
            
            // Update user balance (this would typically be done through a service method)
            // For now, we'll simulate this operation
            
            // Create transaction record
            const transaction: MagatamaTransaction = {
                transactionId,
                userId: request.userId,
                orderId: request.orderId,
                amount: requiredPoints,
                type: 'DEBIT',
                status: PaymentStatus.COMPLETED,
                balanceBefore: currentBalance,
                balanceAfter: newBalance,
                createdAt: new Date(),
                completedAt: new Date(),
                metadata: {
                    description: `Payment for order ${request.orderId}`,
                    originalAmount: request.amount,
                },
            };

            // Store transaction
            this.transactionHistory.set(transactionId, transaction);

            const fees = await this.calculateFees(request.amount, PaymentMethod.MAGATAMA_POINTS);

            this.logger.log(`Magatama payment completed: ${requiredPoints} points deducted from user ${request.userId}`);

            return {
                success: true,
                transactionId,
                status: PaymentStatus.COMPLETED,
                amount: request.amount,
                currency: 'MAGATAMA',
                fees,
                gatewayData: {
                    balanceBefore: currentBalance,
                    balanceAfter: newBalance,
                    pointsDeducted: requiredPoints,
                    transactionType: 'DEBIT',
                },
                processedAt: new Date(),
            };
        } catch (error) {
            this.logger.error(`Magatama payment failed for order ${request.orderId}:`, error);
            
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }

            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_002,
                `Magatama payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
        const transaction = this.transactionHistory.get(transactionId);
        
        if (!transaction) {
            return {
                isValid: false,
                transactionId,
                status: PaymentStatus.FAILED,
                amount: 0,
                currency: 'MAGATAMA',
                verifiedAt: new Date(),
                gatewayData: { error: 'Transaction not found' },
            };
        }

        return {
            isValid: transaction.status === PaymentStatus.COMPLETED,
            transactionId,
            status: transaction.status,
            amount: transaction.amount,
            currency: 'MAGATAMA',
            verifiedAt: new Date(),
            gatewayData: {
                balanceBefore: transaction.balanceBefore,
                balanceAfter: transaction.balanceAfter,
                transactionType: transaction.type,
            },
        };
    }

    async refundPayment(request: RefundRequest): Promise<RefundResult> {
        try {
            const originalTransaction = this.transactionHistory.get(request.transactionId);
            
            if (!originalTransaction) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_PAYMENT_003,
                    'Original transaction not found'
                );
            }

            if (originalTransaction.status !== PaymentStatus.COMPLETED) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_PAYMENT_004,
                    'Cannot refund incomplete transaction'
                );
            }

            const refundAmount = request.amount || originalTransaction.amount;
            const refundId = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Get current user balance
            const user = await this.userRepository.findById(originalTransaction.userId);
            if (!user) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_USER_001,
                    'User not found for refund'
                );
            }

            const currentBalance = user.userInfo?.magatamaPoints || 0;
            const newBalance = currentBalance + refundAmount;

            // Create refund transaction record
            const refundTransaction: MagatamaTransaction = {
                transactionId: refundId,
                userId: originalTransaction.userId,
                orderId: originalTransaction.orderId,
                amount: refundAmount,
                type: 'CREDIT',
                status: PaymentStatus.COMPLETED,
                balanceBefore: currentBalance,
                balanceAfter: newBalance,
                createdAt: new Date(),
                completedAt: new Date(),
                metadata: {
                    description: `Refund for transaction ${request.transactionId}`,
                    originalTransactionId: request.transactionId,
                    refundReason: request.reason,
                },
            };

            // Store refund transaction
            this.transactionHistory.set(refundId, refundTransaction);

            this.logger.log(`Magatama refund completed: ${refundAmount} points refunded to user ${originalTransaction.userId}`);

            return {
                success: true,
                refundId,
                refundedAmount: refundAmount,
                currency: 'MAGATAMA',
                status: PaymentStatus.REFUNDED,
                processedAt: new Date(),
                gatewayData: {
                    balanceBefore: currentBalance,
                    balanceAfter: newBalance,
                    pointsRefunded: refundAmount,
                    originalTransactionId: request.transactionId,
                },
            };
        } catch (error) {
            this.logger.error(`Magatama refund failed for ${request.transactionId}:`, error);
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_004,
                `Refund failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async cancelPayment(transactionId: string): Promise<CancellationResult> {
        const transaction = this.transactionHistory.get(transactionId);
        
        if (!transaction) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_003,
                'Transaction not found'
            );
        }

        if (transaction.status === PaymentStatus.COMPLETED) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_005,
                'Cannot cancel completed transaction'
            );
        }

        // Update transaction status
        transaction.status = PaymentStatus.CANCELLED;
        this.transactionHistory.set(transactionId, transaction);

        return {
            success: true,
            transactionId,
            status: PaymentStatus.CANCELLED,
            cancelledAt: new Date(),
            gatewayData: {
                originalStatus: transaction.status,
                transactionType: transaction.type,
            },
        };
    }

    async getPaymentDetails(transactionId: string): Promise<PaymentDetails> {
        const transaction = this.transactionHistory.get(transactionId);
        
        if (!transaction) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_003,
                'Transaction not found'
            );
        }

        const fees = await this.calculateFees(transaction.amount, PaymentMethod.MAGATAMA_POINTS);

        return {
            transactionId,
            orderId: transaction.orderId,
            amount: transaction.amount,
            currency: 'MAGATAMA',
            status: transaction.status,
            paymentMethod: PaymentMethod.MAGATAMA_POINTS,
            fees,
            createdAt: transaction.createdAt,
            completedAt: transaction.completedAt,
            gatewayData: {
                balanceBefore: transaction.balanceBefore,
                balanceAfter: transaction.balanceAfter,
                transactionType: transaction.type,
                metadata: transaction.metadata,
            },
        };
    }

    async createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntent> {
        // Check user balance first
        const user = await this.userRepository.findById(request.userId);
        if (!user) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_USER_001,
                'User not found'
            );
        }

        const currentBalance = user.userInfo?.magatamaPoints || 0;
        const requiredPoints = Math.round(request.amount);

        return {
            intentId: `magatama_intent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            clientSecret: '', // Not applicable for Magatama points
            amount: request.amount,
            currency: 'MAGATAMA',
            status: currentBalance >= requiredPoints ? PaymentStatus.PENDING : PaymentStatus.FAILED,
            createdAt: new Date(),
            gatewayData: {
                currentBalance,
                requiredPoints,
                hasSufficientBalance: currentBalance >= requiredPoints,
            },
        };
    }

    async confirmPayment(intentId: string, confirmationData: PaymentConfirmationData): Promise<PaymentResult> {
        // For Magatama points, confirmation is immediate upon processing
        // This method would extract the payment details from the intent and process immediately
        
        throw new TouriiBackendAppException(
            TouriiBackendAppErrorType.E_PAYMENT_001,
            'Use processPayment directly for Magatama point payments'
        );
    }

    async getSupportedPaymentMethods(): Promise<PaymentMethodInfo[]> {
        return [
            {
                method: PaymentMethod.MAGATAMA_POINTS,
                displayName: 'Magatama Points',
                isEnabled: true,
                configuration: {
                    currency: 'MAGATAMA',
                    exchangeRate: 1, // 1 point = 1 unit
                    minAmount: 1,
                    maxAmount: 999999,
                },
            },
        ];
    }

    async calculateFees(amount: number, paymentMethod: PaymentMethod): Promise<PaymentFeeCalculation> {
        // No fees for Magatama point transactions
        return {
            paymentMethod,
            amount,
            processingFee: 0,
            platformFee: 0,
            totalFees: 0,
            netAmount: amount,
            currency: 'MAGATAMA',
        };
    }

    async validatePaymentMethod(methodData: PaymentMethodData): Promise<PaymentMethodValidation> {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validate user ID is provided
        if (!methodData.userId) {
            errors.push('User ID is required for Magatama point payments');
        }

        // Additional validation could include checking user account status
        if (methodData.userId) {
            try {
                const user = await this.userRepository.findById(methodData.userId);
                if (!user) {
                    errors.push('User not found');
                } else if (user.isBanned) {
                    errors.push('User account is banned');
                } else {
                    const balance = user.userInfo?.magatamaPoints || 0;
                    if (balance < 1) {
                        warnings.push('User has very low Magatama point balance');
                    }
                }
            } catch (error) {
                errors.push('Failed to validate user account');
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }

    async handleWebhook(webhookData: PaymentWebhook): Promise<WebhookResult> {
        // Magatama point payments don't use external webhooks
        this.logger.log('Magatama webhook received (not applicable)');
        
        return {
            success: true,
            eventType: 'magatama_internal',
            processedAt: new Date(),
            data: { message: 'Magatama payments are processed internally' },
        };
    }

    async getPaymentAnalytics(startDate: Date, endDate: Date): Promise<PaymentAnalytics> {
        const transactions = Array.from(this.transactionHistory.values()).filter(
            (tx) => tx.createdAt >= startDate && tx.createdAt <= endDate
        );

        const totalTransactions = transactions.length;
        const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        const successfulTransactions = transactions.filter(tx => tx.status === PaymentStatus.COMPLETED).length;
        const failedTransactions = totalTransactions - successfulTransactions;
        const averageTransactionAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

        return {
            totalTransactions,
            totalAmount,
            successfulTransactions,
            failedTransactions,
            averageTransactionAmount,
            topPaymentMethods: [{ method: PaymentMethod.MAGATAMA_POINTS, count: totalTransactions }],
            currency: 'MAGATAMA',
            period: { startDate, endDate },
        };
    }

    async processSubscriptionPayment(request: SubscriptionPaymentRequest): Promise<SubscriptionPaymentResult> {
        // Magatama point subscriptions could be implemented
        // For now, process as a regular payment
        
        const paymentRequest: PaymentRequest = {
            orderId: `subscription_${request.userId}_${Date.now()}`,
            userId: request.userId,
            amount: request.amount,
            currency: 'MAGATAMA',
            paymentMethod: PaymentMethod.MAGATAMA_POINTS,
            paymentMethodData: { userId: request.userId },
        };

        const result = await this.processPayment(paymentRequest);

        return {
            success: result.success,
            subscriptionId: `magatama_sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            status: result.status,
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            gatewayData: result.gatewayData,
        };
    }

    async getGatewayConfig(): Promise<PaymentGatewayConfig> {
        return {
            gatewayName: 'MagatamaPoints',
            version: '1.0.0',
            supportedPaymentMethods: [PaymentMethod.MAGATAMA_POINTS],
            supportedCurrencies: ['MAGATAMA'],
            maxTransactionAmount: 999999,
            minTransactionAmount: 1,
            configuration: {
                currency: 'MAGATAMA',
                exchangeRate: 1,
                internalPaymentSystem: true,
            },
        };
    }

    // Helper methods specific to Magatama points

    async getUserBalance(userId: string): Promise<number> {
        const user = await this.userRepository.findById(userId);
        return user?.userInfo?.magatamaPoints || 0;
    }

    async getTransactionHistory(userId: string, limit = 50): Promise<MagatamaTransaction[]> {
        return Array.from(this.transactionHistory.values())
            .filter(tx => tx.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, limit);
    }

    async awardPoints(userId: string, amount: number, description: string): Promise<string> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_USER_001,
                'User not found'
            );
        }

        const currentBalance = user.userInfo?.magatamaPoints || 0;
        const newBalance = currentBalance + amount;
        const transactionId = `award_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const transaction: MagatamaTransaction = {
            transactionId,
            userId,
            orderId: 'SYSTEM_AWARD',
            amount,
            type: 'CREDIT',
            status: PaymentStatus.COMPLETED,
            balanceBefore: currentBalance,
            balanceAfter: newBalance,
            createdAt: new Date(),
            completedAt: new Date(),
            metadata: { description },
        };

        this.transactionHistory.set(transactionId, transaction);
        
        this.logger.log(`Awarded ${amount} Magatama points to user ${userId}: ${description}`);
        
        return transactionId;
    }
}
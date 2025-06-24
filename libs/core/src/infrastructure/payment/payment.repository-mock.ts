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

@Injectable()
export class PaymentRepositoryMock implements PaymentRepository {
    private readonly logger = new Logger(PaymentRepositoryMock.name);
    private readonly mockTransactions = new Map<string, PaymentDetails>();

    async processPayment(request: PaymentRequest): Promise<PaymentResult> {
        this.logger.log(`Processing payment for order ${request.orderId}`);

        // Mock payment processing - always succeed for demo
        const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const mockFees = this.calculateMockFees(request.amount, request.paymentMethod);

        // Store mock transaction
        this.mockTransactions.set(transactionId, {
            transactionId,
            orderId: request.orderId,
            amount: request.amount,
            currency: request.currency,
            status: PaymentStatus.COMPLETED,
            paymentMethod: request.paymentMethod,
            fees: mockFees,
            createdAt: new Date(),
            completedAt: new Date(),
            gatewayData: {
                mockGateway: true,
                simulatedProcessing: true,
            },
        });

        return {
            success: true,
            transactionId,
            status: PaymentStatus.COMPLETED,
            amount: request.amount,
            currency: request.currency,
            fees: mockFees,
            message: 'Payment processed successfully (mock)',
            gatewayResponse: {
                mockResponse: true,
                transactionId,
            },
        };
    }

    async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
        const transaction = this.mockTransactions.get(transactionId);
        
        if (!transaction) {
            return {
                isValid: false,
                status: PaymentStatus.FAILED,
                amount: 0,
                currency: 'USD',
                verifiedAt: new Date(),
            };
        }

        return {
            isValid: true,
            status: transaction.status,
            amount: transaction.amount,
            currency: transaction.currency,
            verifiedAt: new Date(),
            gatewayData: transaction.gatewayData,
        };
    }

    async refundPayment(request: RefundRequest): Promise<RefundResult> {
        this.logger.log(`Processing refund for transaction ${request.transactionId}`);

        const transaction = this.mockTransactions.get(request.transactionId);
        if (!transaction) {
            return {
                success: false,
                amount: request.amount,
                status: 'failed',
                errorCode: 'TRANSACTION_NOT_FOUND',
            };
        }

        const refundId = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return {
            success: true,
            refundId,
            amount: request.amount,
            status: 'completed',
            message: 'Refund processed successfully (mock)',
        };
    }

    async cancelPayment(transactionId: string): Promise<CancellationResult> {
        this.logger.log(`Cancelling payment ${transactionId}`);

        const transaction = this.mockTransactions.get(transactionId);
        if (!transaction) {
            return {
                success: false,
                errorCode: 'TRANSACTION_NOT_FOUND',
            };
        }

        // Update mock transaction
        transaction.status = PaymentStatus.CANCELLED;

        return {
            success: true,
            message: 'Payment cancelled successfully (mock)',
        };
    }

    async getPaymentDetails(transactionId: string): Promise<PaymentDetails | undefined> {
        return this.mockTransactions.get(transactionId);
    }

    async createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntent> {
        const intentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const clientSecret = `${intentId}_secret_${Math.random().toString(36).substr(2, 16)}`;

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

        return {
            intentId,
            clientSecret,
            amount: request.amount,
            currency: request.currency,
            status: 'requires_payment_method',
            paymentMethods: request.paymentMethods,
            expiresAt,
        };
    }

    async confirmPaymentIntent(intentId: string, confirmationData: PaymentConfirmationData): Promise<PaymentResult> {
        this.logger.log(`Confirming payment intent ${intentId}`);

        const transactionId = `txn_${intentId}_confirmed`;

        return {
            success: true,
            transactionId,
            status: PaymentStatus.COMPLETED,
            amount: 100, // Mock amount
            currency: 'USD',
            fees: 3.5,
            message: 'Payment intent confirmed successfully (mock)',
        };
    }

    async getSupportedPaymentMethods(country?: string): Promise<PaymentMethodInfo[]> {
        const methods: PaymentMethodInfo[] = [
            {
                method: PaymentMethod.STRIPE,
                name: 'Credit/Debit Card',
                description: 'Pay with credit or debit card via Stripe',
                isAvailable: true,
                minimumAmount: 0.5,
                maximumAmount: 10000,
                supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY'],
                processingTime: 'Instant',
                fees: { fixed: 0.30, percentage: 2.9 },
            },
            {
                method: PaymentMethod.PAYPAL,
                name: 'PayPal',
                description: 'Pay with your PayPal account',
                isAvailable: true,
                minimumAmount: 1,
                maximumAmount: 10000,
                supportedCurrencies: ['USD', 'EUR', 'GBP'],
                processingTime: 'Instant',
                fees: { fixed: 0.49, percentage: 3.49 },
            },
            {
                method: PaymentMethod.APPLE_PAY,
                name: 'Apple Pay',
                description: 'Pay securely with Touch ID or Face ID',
                isAvailable: true,
                minimumAmount: 0.5,
                maximumAmount: 10000,
                supportedCurrencies: ['USD', 'EUR', 'GBP'],
                processingTime: 'Instant',
                fees: { fixed: 0.30, percentage: 2.9 },
            },
            {
                method: PaymentMethod.GOOGLE_PAY,
                name: 'Google Pay',
                description: 'Pay with your Google account',
                isAvailable: true,
                minimumAmount: 0.5,
                maximumAmount: 10000,
                supportedCurrencies: ['USD', 'EUR', 'GBP'],
                processingTime: 'Instant',
                fees: { fixed: 0.30, percentage: 2.9 },
            },
            {
                method: PaymentMethod.MAGATAMA_POINTS,
                name: 'Magatama Points',
                description: 'Pay with your in-app currency',
                isAvailable: true,
                minimumAmount: 1,
                supportedCurrencies: ['MAGATAMA'],
                processingTime: 'Instant',
                fees: { fixed: 0, percentage: 0 },
            },
        ];

        return methods;
    }

    async calculatePaymentFees(amount: number, paymentMethod: PaymentMethod, country?: string): Promise<PaymentFeeCalculation> {
        const fees = this.getMockFeeStructure(paymentMethod);
        
        const fixedFee = fees.fixed;
        const percentageFee = (amount * fees.percentage) / 100;
        const totalFees = fixedFee + percentageFee;
        const netAmount = amount - totalFees;

        return {
            baseAmount: amount,
            fixedFee,
            percentageFee,
            totalFees,
            netAmount,
            breakdown: [
                {
                    type: 'Fixed Fee',
                    amount: fixedFee,
                    description: 'Processing fee',
                },
                {
                    type: 'Percentage Fee',
                    amount: percentageFee,
                    description: `${fees.percentage}% of transaction amount`,
                },
            ],
        };
    }

    async validatePaymentMethod(paymentMethodData: PaymentMethodData): Promise<PaymentMethodValidation> {
        const errors: Array<{ field: string; message: string; code: string }> = [];

        if (!paymentMethodData.type) {
            errors.push({
                field: 'type',
                message: 'Payment method type is required',
                code: 'REQUIRED',
            });
        }

        if (paymentMethodData.type === PaymentMethod.STRIPE && paymentMethodData.cardData) {
            const { cardData } = paymentMethodData;
            
            if (!cardData.number || cardData.number.length < 13) {
                errors.push({
                    field: 'cardData.number',
                    message: 'Invalid card number',
                    code: 'INVALID_CARD_NUMBER',
                });
            }

            if (!cardData.cvc || cardData.cvc.length < 3) {
                errors.push({
                    field: 'cardData.cvc',
                    message: 'Invalid CVC',
                    code: 'INVALID_CVC',
                });
            }

            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            
            if (cardData.expiryYear < currentYear || 
                (cardData.expiryYear === currentYear && cardData.expiryMonth < currentMonth)) {
                errors.push({
                    field: 'cardData.expiry',
                    message: 'Card has expired',
                    code: 'CARD_EXPIRED',
                });
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    async handleWebhook(webhook: PaymentWebhook): Promise<WebhookResult> {
        this.logger.log(`Handling webhook: ${webhook.eventType} from ${webhook.gateway}`);

        // Mock webhook processing
        const action = this.determineWebhookAction(webhook.eventType);
        
        return {
            processed: true,
            action,
            transactionId: webhook.data?.transactionId,
            message: 'Webhook processed successfully (mock)',
        };
    }

    async getPaymentAnalytics(startDate: Date, endDate: Date): Promise<PaymentAnalytics> {
        // Mock analytics data
        return {
            totalTransactions: 150,
            totalVolume: 45000,
            successRate: 0.95,
            averageTransactionValue: 300,
            transactionsByMethod: {
                [PaymentMethod.STRIPE]: 100,
                [PaymentMethod.PAYPAL]: 30,
                [PaymentMethod.APPLE_PAY]: 15,
                [PaymentMethod.GOOGLE_PAY]: 5,
                [PaymentMethod.MAGATAMA_POINTS]: 0,
                [PaymentMethod.CREDIT_CARD]: 0,
                [PaymentMethod.CRYPTO]: 0,
            },
            volumeByMethod: {
                [PaymentMethod.STRIPE]: 30000,
                [PaymentMethod.PAYPAL]: 9000,
                [PaymentMethod.APPLE_PAY]: 4500,
                [PaymentMethod.GOOGLE_PAY]: 1500,
                [PaymentMethod.MAGATAMA_POINTS]: 0,
                [PaymentMethod.CREDIT_CARD]: 0,
                [PaymentMethod.CRYPTO]: 0,
            },
            dailyVolume: [],
            topFailureReasons: [
                { reason: 'Insufficient funds', count: 5 },
                { reason: 'Invalid card', count: 3 },
            ],
        };
    }

    async processSubscriptionPayment(request: SubscriptionPaymentRequest): Promise<SubscriptionPaymentResult> {
        const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const currentPeriodStart = new Date();
        const currentPeriodEnd = new Date();
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

        return {
            subscriptionId,
            status: 'active',
            currentPeriodStart,
            currentPeriodEnd,
            nextPaymentDate: currentPeriodEnd,
        };
    }

    async setupPaymentGateway(gateway: PaymentMethod, config: PaymentGatewayConfig): Promise<boolean> {
        this.logger.log(`Setting up payment gateway: ${gateway}`);
        
        // Mock gateway setup - always successful
        return true;
    }

    private calculateMockFees(amount: number, paymentMethod: PaymentMethod): number {
        const feeStructure = this.getMockFeeStructure(paymentMethod);
        return feeStructure.fixed + (amount * feeStructure.percentage) / 100;
    }

    private getMockFeeStructure(paymentMethod: PaymentMethod) {
        const feeStructures = {
            [PaymentMethod.STRIPE]: { fixed: 0.30, percentage: 2.9 },
            [PaymentMethod.PAYPAL]: { fixed: 0.49, percentage: 3.49 },
            [PaymentMethod.APPLE_PAY]: { fixed: 0.30, percentage: 2.9 },
            [PaymentMethod.GOOGLE_PAY]: { fixed: 0.30, percentage: 2.9 },
            [PaymentMethod.CREDIT_CARD]: { fixed: 0.30, percentage: 2.9 },
            [PaymentMethod.CRYPTO]: { fixed: 0, percentage: 1.0 },
            [PaymentMethod.MAGATAMA_POINTS]: { fixed: 0, percentage: 0 },
        };

        return feeStructures[paymentMethod] || { fixed: 0.30, percentage: 2.9 };
    }

    private determineWebhookAction(eventType: string): WebhookResult['action'] {
        const actionMap: Record<string, WebhookResult['action']> = {
            'payment.succeeded': 'payment_completed',
            'payment.failed': 'payment_failed',
            'refund.created': 'refund_processed',
            'dispute.created': 'dispute_created',
        };

        return actionMap[eventType] || 'unknown';
    }
}
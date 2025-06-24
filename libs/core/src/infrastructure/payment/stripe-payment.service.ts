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
import Stripe from 'stripe';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';

@Injectable()
export class StripePaymentService implements PaymentRepository {
    private readonly logger = new Logger(StripePaymentService.name);
    private readonly stripe: Stripe;

    constructor() {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_040,
                'STRIPE_SECRET_KEY environment variable is required'
            );
        }

        this.stripe = new Stripe(secretKey, {
            apiVersion: '2024-06-20',
        });
    }

    async processPayment(request: PaymentRequest): Promise<PaymentResult> {
        this.logger.log(`Processing Stripe payment for order ${request.orderId}`);

        try {
            // Only handle Stripe payments
            if (request.paymentMethod !== PaymentMethod.STRIPE) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_PAYMENT_001,
                    'This service only handles Stripe payments'
                );
            }

            // Create payment intent
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(request.amount * 100), // Convert to cents
                currency: request.currency.toLowerCase(),
                payment_method: request.paymentMethodData?.stripePaymentMethodId,
                confirm: true,
                metadata: {
                    orderId: request.orderId,
                    userId: request.userId,
                },
                return_url: request.returnUrl,
            });

            // Calculate fees
            const fees = await this.calculateFees(request.amount, request.paymentMethod);

            return {
                success: paymentIntent.status === 'succeeded',
                transactionId: paymentIntent.id,
                status: this.mapStripeStatus(paymentIntent.status),
                amount: request.amount,
                currency: request.currency,
                fees,
                gatewayData: {
                    stripePaymentIntentId: paymentIntent.id,
                    stripeClientSecret: paymentIntent.client_secret,
                },
                processedAt: new Date(),
            };
        } catch (error) {
            this.logger.error(`Stripe payment failed for order ${request.orderId}:`, error);
            
            if (error instanceof Stripe.errors.StripeError) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_PAYMENT_002,
                    `Stripe payment failed: ${error.message}`
                );
            }

            throw error;
        }
    }

    async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(transactionId);

            return {
                isValid: paymentIntent.status === 'succeeded',
                transactionId,
                status: this.mapStripeStatus(paymentIntent.status),
                amount: paymentIntent.amount / 100, // Convert from cents
                currency: paymentIntent.currency.toUpperCase(),
                verifiedAt: new Date(),
                gatewayData: {
                    stripePaymentIntentId: paymentIntent.id,
                    stripeStatus: paymentIntent.status,
                },
            };
        } catch (error) {
            this.logger.error(`Failed to verify Stripe payment ${transactionId}:`, error);
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_003,
                `Failed to verify payment: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async refundPayment(request: RefundRequest): Promise<RefundResult> {
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: request.transactionId,
                amount: request.amount ? Math.round(request.amount * 100) : undefined,
                reason: request.reason === 'CUSTOMER_REQUEST' ? 'requested_by_customer' : 'duplicate',
                metadata: {
                    orderId: request.orderId,
                    refundReason: request.reason,
                },
            });

            return {
                success: refund.status === 'succeeded',
                refundId: refund.id,
                refundedAmount: refund.amount / 100,
                currency: refund.currency.toUpperCase(),
                status: refund.status === 'succeeded' ? PaymentStatus.REFUNDED : PaymentStatus.PENDING,
                processedAt: new Date(),
                gatewayData: {
                    stripeRefundId: refund.id,
                    stripeStatus: refund.status,
                },
            };
        } catch (error) {
            this.logger.error(`Stripe refund failed for ${request.transactionId}:`, error);
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_004,
                `Refund failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async cancelPayment(transactionId: string): Promise<CancellationResult> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.cancel(transactionId);

            return {
                success: paymentIntent.status === 'canceled',
                transactionId,
                status: this.mapStripeStatus(paymentIntent.status),
                cancelledAt: new Date(),
                gatewayData: {
                    stripePaymentIntentId: paymentIntent.id,
                    stripeStatus: paymentIntent.status,
                },
            };
        } catch (error) {
            this.logger.error(`Failed to cancel Stripe payment ${transactionId}:`, error);
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_005,
                `Cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async getPaymentDetails(transactionId: string): Promise<PaymentDetails> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(transactionId);
            const fees = await this.calculateFees(paymentIntent.amount / 100, PaymentMethod.STRIPE);

            return {
                transactionId,
                orderId: paymentIntent.metadata.orderId || '',
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency.toUpperCase(),
                status: this.mapStripeStatus(paymentIntent.status),
                paymentMethod: PaymentMethod.STRIPE,
                fees,
                createdAt: new Date(paymentIntent.created * 1000),
                completedAt: paymentIntent.status === 'succeeded' ? new Date() : undefined,
                gatewayData: {
                    stripePaymentIntentId: paymentIntent.id,
                    stripeStatus: paymentIntent.status,
                    stripeClientSecret: paymentIntent.client_secret,
                },
            };
        } catch (error) {
            this.logger.error(`Failed to get Stripe payment details ${transactionId}:`, error);
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_003,
                `Failed to get payment details: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(request.amount * 100),
                currency: request.currency.toLowerCase(),
                metadata: {
                    orderId: request.orderId,
                    userId: request.userId,
                },
            });

            return {
                intentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret!,
                amount: request.amount,
                currency: request.currency,
                status: this.mapStripeStatus(paymentIntent.status),
                createdAt: new Date(),
                gatewayData: {
                    stripePaymentIntentId: paymentIntent.id,
                },
            };
        } catch (error) {
            this.logger.error(`Failed to create Stripe payment intent:`, error);
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_001,
                `Failed to create payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async confirmPayment(intentId: string, confirmationData: PaymentConfirmationData): Promise<PaymentResult> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.confirm(intentId, {
                payment_method: confirmationData.paymentMethodId,
                return_url: confirmationData.returnUrl,
            });

            const fees = await this.calculateFees(paymentIntent.amount / 100, PaymentMethod.STRIPE);

            return {
                success: paymentIntent.status === 'succeeded',
                transactionId: paymentIntent.id,
                status: this.mapStripeStatus(paymentIntent.status),
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency.toUpperCase(),
                fees,
                gatewayData: {
                    stripePaymentIntentId: paymentIntent.id,
                    stripeClientSecret: paymentIntent.client_secret,
                },
                processedAt: new Date(),
            };
        } catch (error) {
            this.logger.error(`Failed to confirm Stripe payment ${intentId}:`, error);
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_002,
                `Payment confirmation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async getSupportedPaymentMethods(): Promise<PaymentMethodInfo[]> {
        return [
            {
                method: PaymentMethod.STRIPE,
                displayName: 'Credit/Debit Card',
                isEnabled: true,
                configuration: {
                    acceptedCards: ['visa', 'mastercard', 'amex', 'discover'],
                    supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY'],
                },
            },
        ];
    }

    async calculateFees(amount: number, paymentMethod: PaymentMethod): Promise<PaymentFeeCalculation> {
        // Stripe standard fees: 2.9% + $0.30 per transaction
        const percentageFee = amount * 0.029;
        const fixedFee = 0.30;
        const totalFees = percentageFee + fixedFee;

        return {
            paymentMethod,
            amount,
            processingFee: totalFees,
            platformFee: 0,
            totalFees,
            netAmount: amount - totalFees,
            currency: 'USD',
        };
    }

    async validatePaymentMethod(methodData: PaymentMethodData): Promise<PaymentMethodValidation> {
        // Basic validation for Stripe payment methods
        const isValid = !!(methodData.stripePaymentMethodId && methodData.stripePaymentMethodId.startsWith('pm_'));

        return {
            isValid,
            errors: isValid ? [] : ['Invalid Stripe payment method ID'],
            warnings: [],
        };
    }

    async handleWebhook(webhookData: PaymentWebhook): Promise<WebhookResult> {
        try {
            // Verify webhook signature
            const sig = webhookData.headers['stripe-signature'];
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

            if (!webhookSecret) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_TB_041,
                    'Stripe webhook secret not configured'
                );
            }

            const event = this.stripe.webhooks.constructEvent(
                webhookData.payload,
                sig!,
                webhookSecret
            );

            this.logger.log(`Received Stripe webhook: ${event.type}`);

            return {
                success: true,
                eventType: event.type,
                processedAt: new Date(),
                data: event.data,
            };
        } catch (error) {
            this.logger.error('Stripe webhook verification failed:', error);
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_006,
                `Webhook verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async getPaymentAnalytics(startDate: Date, endDate: Date): Promise<PaymentAnalytics> {
        // Note: This would require additional Stripe API calls to get analytics
        // For now, return basic structure
        return {
            totalTransactions: 0,
            totalAmount: 0,
            successfulTransactions: 0,
            failedTransactions: 0,
            averageTransactionAmount: 0,
            topPaymentMethods: [],
            currency: 'USD',
            period: { startDate, endDate },
        };
    }

    async processSubscriptionPayment(request: SubscriptionPaymentRequest): Promise<SubscriptionPaymentResult> {
        try {
            const subscription = await this.stripe.subscriptions.create({
                customer: request.customerId,
                items: [{ price: request.priceId }],
                metadata: {
                    userId: request.userId,
                    planType: request.planType,
                },
            });

            return {
                success: subscription.status === 'active',
                subscriptionId: subscription.id,
                status: subscription.status === 'active' ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
                nextBillingDate: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : undefined,
                gatewayData: {
                    stripeSubscriptionId: subscription.id,
                    stripeCustomerId: subscription.customer as string,
                },
            };
        } catch (error) {
            this.logger.error('Stripe subscription creation failed:', error);
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_007,
                `Subscription creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async getGatewayConfig(): Promise<PaymentGatewayConfig> {
        return {
            gatewayName: 'Stripe',
            version: '2024-06-20',
            supportedPaymentMethods: [PaymentMethod.STRIPE],
            supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY'],
            maxTransactionAmount: 999999.99,
            minTransactionAmount: 0.50,
            configuration: {
                publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
                webhookEndpoint: '/webhooks/stripe',
            },
        };
    }

    private mapStripeStatus(stripeStatus: string): PaymentStatus {
        switch (stripeStatus) {
            case 'succeeded':
                return PaymentStatus.COMPLETED;
            case 'requires_payment_method':
            case 'requires_confirmation':
            case 'requires_action':
                return PaymentStatus.PENDING;
            case 'processing':
                return PaymentStatus.PROCESSING;
            case 'canceled':
                return PaymentStatus.CANCELLED;
            case 'requires_capture':
                return PaymentStatus.PENDING;
            default:
                return PaymentStatus.FAILED;
        }
    }
}
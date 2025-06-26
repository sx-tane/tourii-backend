import type { PaymentMethod, PaymentStatus } from '@prisma/client';

export interface PaymentRepository {
    /**
     * Process payment for an order
     * @param request - Payment processing request
     * @returns Payment result
     */
    processPayment(request: PaymentRequest): Promise<PaymentResult>;

    /**
     * Verify payment status
     * @param transactionId - Payment transaction ID
     * @returns Payment verification result
     */
    verifyPayment(transactionId: string): Promise<PaymentVerificationResult>;

    /**
     * Refund payment
     * @param request - Refund request
     * @returns Refund result
     */
    refundPayment(request: RefundRequest): Promise<RefundResult>;

    /**
     * Cancel payment
     * @param transactionId - Payment transaction ID
     * @returns Cancellation result
     */
    cancelPayment(transactionId: string): Promise<CancellationResult>;

    /**
     * Get payment details
     * @param transactionId - Payment transaction ID
     * @returns Payment details
     */
    getPaymentDetails(transactionId: string): Promise<PaymentDetails | undefined>;

    /**
     * Create payment intent (for client-side processing)
     * @param request - Payment intent request
     * @returns Payment intent
     */
    createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntent>;

    /**
     * Confirm payment intent
     * @param intentId - Payment intent ID
     * @param confirmationData - Confirmation data
     * @returns Payment confirmation result
     */
    confirmPaymentIntent(intentId: string, confirmationData: PaymentConfirmationData): Promise<PaymentResult>;

    /**
     * Get supported payment methods
     * @param country - Country code (optional)
     * @returns Supported payment methods
     */
    getSupportedPaymentMethods(country?: string): Promise<PaymentMethodInfo[]>;

    /**
     * Calculate payment fees
     * @param amount - Payment amount
     * @param paymentMethod - Payment method
     * @param country - Country code (optional)
     * @returns Fee calculation
     */
    calculatePaymentFees(amount: number, paymentMethod: PaymentMethod, country?: string): Promise<PaymentFeeCalculation>;

    /**
     * Validate payment method
     * @param paymentMethodData - Payment method data
     * @returns Validation result
     */
    validatePaymentMethod(paymentMethodData: PaymentMethodData): Promise<PaymentMethodValidation>;

    /**
     * Handle webhook notifications from payment gateways
     * @param webhook - Webhook data
     * @returns Webhook processing result
     */
    handleWebhook(webhook: PaymentWebhook): Promise<WebhookResult>;

    /**
     * Get payment analytics
     * @param startDate - Start date
     * @param endDate - End date
     * @returns Payment analytics
     */
    getPaymentAnalytics(startDate: Date, endDate: Date): Promise<PaymentAnalytics>;

    /**
     * Process subscription payment
     * @param request - Subscription payment request
     * @returns Subscription payment result
     */
    processSubscriptionPayment(request: SubscriptionPaymentRequest): Promise<SubscriptionPaymentResult>;

    /**
     * Setup payment gateway configuration
     * @param gateway - Payment gateway type
     * @param config - Configuration data
     * @returns Configuration result
     */
    setupPaymentGateway(gateway: PaymentMethod, config: PaymentGatewayConfig): Promise<boolean>;
}

export interface PaymentRequest {
    orderId: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    paymentMethodData?: any;
    customerData: CustomerData;
    metadata?: Record<string, any>;
}

export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
    fees: number;
    message?: string;
    errorCode?: string;
    errorDetails?: any;
    gatewayResponse?: any;
}

export interface PaymentVerificationResult {
    isValid: boolean;
    status: PaymentStatus;
    amount: number;
    currency: string;
    verifiedAt: Date;
    gatewayData?: any;
}

export interface RefundRequest {
    transactionId: string;
    amount: number;
    reason: string;
    metadata?: Record<string, any>;
}

export interface RefundResult {
    success: boolean;
    refundId?: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    message?: string;
    errorCode?: string;
}

export interface CancellationResult {
    success: boolean;
    message?: string;
    errorCode?: string;
}

export interface PaymentDetails {
    transactionId: string;
    orderId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    fees: number;
    createdAt: Date;
    completedAt?: Date;
    gatewayData?: any;
}

export interface PaymentIntentRequest {
    amount: number;
    currency: string;
    paymentMethods: PaymentMethod[];
    customerData: CustomerData;
    metadata?: Record<string, any>;
}

export interface PaymentIntent {
    intentId: string;
    clientSecret?: string;
    amount: number;
    currency: string;
    status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
    paymentMethods: PaymentMethod[];
    expiresAt: Date;
}

export interface PaymentConfirmationData {
    paymentMethodData?: any;
    returnUrl?: string;
    metadata?: Record<string, any>;
}

export interface CustomerData {
    userId?: string;
    email: string;
    name?: string;
    phone?: string;
    address?: {
        line1: string;
        line2?: string;
        city: string;
        state?: string;
        postalCode: string;
        country: string;
    };
}

export interface PaymentMethodInfo {
    method: PaymentMethod;
    name: string;
    description: string;
    isAvailable: boolean;
    minimumAmount?: number;
    maximumAmount?: number;
    supportedCurrencies: string[];
    processingTime: string;
    fees: {
        fixed: number;
        percentage: number;
    };
}

export interface PaymentFeeCalculation {
    baseAmount: number;
    fixedFee: number;
    percentageFee: number;
    totalFees: number;
    netAmount: number;
    breakdown: Array<{
        type: string;
        amount: number;
        description: string;
    }>;
}

export interface PaymentMethodData {
    type: PaymentMethod;
    cardData?: {
        number: string;
        expiryMonth: number;
        expiryYear: number;
        cvc: string;
        holderName: string;
    };
    walletData?: any;
    bankData?: any;
}

export interface PaymentMethodValidation {
    isValid: boolean;
    errors: Array<{
        field: string;
        message: string;
        code: string;
    }>;
}

export interface PaymentWebhook {
    gateway: PaymentMethod;
    eventType: string;
    data: any;
    signature?: string;
    timestamp: Date;
}

export interface WebhookResult {
    processed: boolean;
    transactionId?: string;
    action: 'payment_completed' | 'payment_failed' | 'refund_processed' | 'dispute_created' | 'unknown';
    message?: string;
}

export interface PaymentAnalytics {
    totalTransactions: number;
    totalVolume: number;
    successRate: number;
    averageTransactionValue: number;
    transactionsByMethod: Record<PaymentMethod, number>;
    volumeByMethod: Record<PaymentMethod, number>;
    dailyVolume: Array<{
        date: Date;
        transactions: number;
        volume: number;
    }>;
    topFailureReasons: Array<{
        reason: string;
        count: number;
    }>;
}

export interface SubscriptionPaymentRequest {
    customerId: string;
    planId: string;
    paymentMethodId: string;
    trialPeriodDays?: number;
    metadata?: Record<string, any>;
}

export interface SubscriptionPaymentResult {
    subscriptionId: string;
    status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    nextPaymentDate?: Date;
}

export interface PaymentGatewayConfig {
    apiKey: string;
    secretKey: string;
    webhookSecret?: string;
    environment: 'sandbox' | 'production';
    additionalSettings?: Record<string, any>;
}
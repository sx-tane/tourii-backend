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
import { ethers } from 'ethers';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';

@Injectable()
export class CryptoPaymentService implements PaymentRepository {
    private readonly logger = new Logger(CryptoPaymentService.name);
    private readonly ethProvider: ethers.JsonRpcProvider;
    private readonly ethWallet: ethers.Wallet;

    constructor() {
        // Initialize Ethereum provider
        const ethRpcUrl = process.env.ETH_RPC_URL || 'https://mainnet.infura.io/v3/your-project-id';
        this.ethProvider = new ethers.JsonRpcProvider(ethRpcUrl);

        // Initialize wallet for receiving payments
        const privateKey = process.env.CRYPTO_WALLET_PRIVATE_KEY;
        if (!privateKey) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_040,
                'CRYPTO_WALLET_PRIVATE_KEY environment variable is required'
            );
        }

        this.ethWallet = new ethers.Wallet(privateKey, this.ethProvider);
    }

    async processPayment(request: PaymentRequest): Promise<PaymentResult> {
        this.logger.log(`Processing crypto payment for order ${request.orderId}`);

        try {
            if (request.paymentMethod === PaymentMethod.CRYPTO_ETH) {
                return await this.processEthPayment(request);
            } else if (request.paymentMethod === PaymentMethod.CRYPTO_BTC) {
                return await this.processBtcPayment(request);
            } else {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_PAYMENT_001,
                    'This service only handles crypto payments (ETH/BTC)'
                );
            }
        } catch (error) {
            this.logger.error(`Crypto payment failed for order ${request.orderId}:`, error);
            throw error;
        }
    }

    private async processEthPayment(request: PaymentRequest): Promise<PaymentResult> {
        try {
            const { txHash, fromAddress } = request.paymentMethodData as any;

            if (!txHash || !fromAddress) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_PAYMENT_002,
                    'Transaction hash and from address are required for ETH payments'
                );
            }

            // Get transaction details
            const tx = await this.ethProvider.getTransaction(txHash);
            if (!tx) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_PAYMENT_003,
                    'Transaction not found'
                );
            }

            // Wait for confirmation
            const receipt = await tx.wait();
            if (!receipt) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_PAYMENT_002,
                    'Transaction failed or not confirmed'
                );
            }

            // Verify transaction details
            const expectedAmount = ethers.parseEther(request.amount.toString());
            if (tx.value < expectedAmount) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_PAYMENT_004,
                    'Insufficient payment amount'
                );
            }

            // Verify recipient address
            const receivingAddress = process.env.ETH_RECEIVING_ADDRESS || this.ethWallet.address;
            if (tx.to?.toLowerCase() !== receivingAddress.toLowerCase()) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_PAYMENT_004,
                    'Payment sent to incorrect address'
                );
            }

            const fees = await this.calculateFees(request.amount, PaymentMethod.CRYPTO_ETH);

            return {
                success: receipt.status === 1,
                transactionId: txHash,
                status: receipt.status === 1 ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
                amount: request.amount,
                currency: 'ETH',
                fees,
                gatewayData: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    gasUsed: receipt.gasUsed.toString(),
                    fromAddress,
                    toAddress: tx.to,
                },
                processedAt: new Date(),
            };
        } catch (error) {
            this.logger.error('ETH payment processing failed:', error);
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_002,
                `ETH payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    private async processBtcPayment(request: PaymentRequest): Promise<PaymentResult> {
        // Bitcoin payment processing would require a different library and setup
        // For now, this is a placeholder implementation
        this.logger.warn('BTC payment processing not fully implemented');
        
        throw new TouriiBackendAppException(
            TouriiBackendAppErrorType.E_PAYMENT_001,
            'Bitcoin payment processing not yet implemented'
        );
    }

    async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
        try {
            // Check if it's an Ethereum transaction
            if (transactionId.startsWith('0x')) {
                return await this.verifyEthPayment(transactionId);
            }

            // For Bitcoin, we'd need different verification logic
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_003,
                'Unsupported transaction format for verification'
            );
        } catch (error) {
            this.logger.error(`Failed to verify crypto payment ${transactionId}:`, error);
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_003,
                `Payment verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    private async verifyEthPayment(txHash: string): Promise<PaymentVerificationResult> {
        const tx = await this.ethProvider.getTransaction(txHash);
        if (!tx) {
            return {
                isValid: false,
                transactionId: txHash,
                status: PaymentStatus.FAILED,
                amount: 0,
                currency: 'ETH',
                verifiedAt: new Date(),
                gatewayData: { error: 'Transaction not found' },
            };
        }

        const receipt = await tx.wait();
        const amount = parseFloat(ethers.formatEther(tx.value));

        return {
            isValid: receipt?.status === 1,
            transactionId: txHash,
            status: receipt?.status === 1 ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
            amount,
            currency: 'ETH',
            verifiedAt: new Date(),
            gatewayData: {
                blockHash: receipt?.blockHash,
                blockNumber: receipt?.blockNumber,
                gasUsed: receipt?.gasUsed.toString(),
                fromAddress: tx.from,
                toAddress: tx.to,
            },
        };
    }

    async refundPayment(request: RefundRequest): Promise<RefundResult> {
        // Crypto payments are generally irreversible
        // This would require manual intervention
        throw new TouriiBackendAppException(
            TouriiBackendAppErrorType.E_PAYMENT_004,
            'Crypto payments cannot be automatically refunded'
        );
    }

    async cancelPayment(transactionId: string): Promise<CancellationResult> {
        // Crypto payments cannot be cancelled once confirmed
        throw new TouriiBackendAppException(
            TouriiBackendAppErrorType.E_PAYMENT_005,
            'Crypto payments cannot be cancelled once confirmed'
        );
    }

    async getPaymentDetails(transactionId: string): Promise<PaymentDetails> {
        try {
            if (transactionId.startsWith('0x')) {
                return await this.getEthPaymentDetails(transactionId);
            }

            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_003,
                'Unsupported transaction format'
            );
        } catch (error) {
            this.logger.error(`Failed to get crypto payment details ${transactionId}:`, error);
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_003,
                `Failed to get payment details: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    private async getEthPaymentDetails(txHash: string): Promise<PaymentDetails> {
        const tx = await this.ethProvider.getTransaction(txHash);
        if (!tx) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_003,
                'Transaction not found'
            );
        }

        const receipt = await tx.wait();
        const amount = parseFloat(ethers.formatEther(tx.value));
        const fees = await this.calculateFees(amount, PaymentMethod.CRYPTO_ETH);

        // Get block details for timestamp
        const block = await this.ethProvider.getBlock(tx.blockNumber || 'latest');

        return {
            transactionId: txHash,
            orderId: '', // Would need to extract from transaction data or metadata
            amount,
            currency: 'ETH',
            status: receipt?.status === 1 ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
            paymentMethod: PaymentMethod.CRYPTO_ETH,
            fees,
            createdAt: new Date((block?.timestamp || 0) * 1000),
            completedAt: receipt?.status === 1 ? new Date((block?.timestamp || 0) * 1000) : undefined,
            gatewayData: {
                blockHash: receipt?.blockHash,
                blockNumber: receipt?.blockNumber,
                gasUsed: receipt?.gasUsed.toString(),
                fromAddress: tx.from,
                toAddress: tx.to,
            },
        };
    }

    async createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntent> {
        // Generate a receiving address and expected amount
        const receivingAddress = process.env.ETH_RECEIVING_ADDRESS || this.ethWallet.address;
        
        return {
            intentId: `crypto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            clientSecret: '', // Not applicable for crypto
            amount: request.amount,
            currency: 'ETH',
            status: PaymentStatus.PENDING,
            createdAt: new Date(),
            gatewayData: {
                receivingAddress,
                expectedAmount: request.amount,
                network: 'ethereum',
            },
        };
    }

    async confirmPayment(intentId: string, confirmationData: PaymentConfirmationData): Promise<PaymentResult> {
        // For crypto, confirmation is done by verifying the transaction hash
        const txHash = confirmationData.transactionHash;
        if (!txHash) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_PAYMENT_002,
                'Transaction hash required for crypto payment confirmation'
            );
        }

        const verification = await this.verifyPayment(txHash);
        
        return {
            success: verification.isValid,
            transactionId: txHash,
            status: verification.status,
            amount: verification.amount,
            currency: verification.currency,
            fees: await this.calculateFees(verification.amount, PaymentMethod.CRYPTO_ETH),
            gatewayData: verification.gatewayData,
            processedAt: new Date(),
        };
    }

    async getSupportedPaymentMethods(): Promise<PaymentMethodInfo[]> {
        return [
            {
                method: PaymentMethod.CRYPTO_ETH,
                displayName: 'Ethereum (ETH)',
                isEnabled: true,
                configuration: {
                    network: 'ethereum',
                    receivingAddress: process.env.ETH_RECEIVING_ADDRESS || this.ethWallet.address,
                    minAmount: 0.001,
                    maxAmount: 100,
                },
            },
            {
                method: PaymentMethod.CRYPTO_BTC,
                displayName: 'Bitcoin (BTC)',
                isEnabled: false, // Not fully implemented
                configuration: {
                    network: 'bitcoin',
                    minAmount: 0.0001,
                    maxAmount: 10,
                },
            },
        ];
    }

    async calculateFees(amount: number, paymentMethod: PaymentMethod): Promise<PaymentFeeCalculation> {
        let processingFee = 0;
        let currency = '';

        if (paymentMethod === PaymentMethod.CRYPTO_ETH) {
            // ETH network fees vary, estimate based on current gas prices
            processingFee = 0.001; // Rough estimate
            currency = 'ETH';
        } else if (paymentMethod === PaymentMethod.CRYPTO_BTC) {
            // BTC network fees
            processingFee = 0.0001; // Rough estimate
            currency = 'BTC';
        }

        return {
            paymentMethod,
            amount,
            processingFee,
            platformFee: 0,
            totalFees: processingFee,
            netAmount: amount - processingFee,
            currency,
        };
    }

    async validatePaymentMethod(methodData: PaymentMethodData): Promise<PaymentMethodValidation> {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validate Ethereum address format
        if (methodData.fromAddress && !ethers.isAddress(methodData.fromAddress)) {
            errors.push('Invalid Ethereum address format');
        }

        // Validate transaction hash format
        if (methodData.txHash && !methodData.txHash.match(/^0x[a-fA-F0-9]{64}$/)) {
            errors.push('Invalid transaction hash format');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }

    async handleWebhook(webhookData: PaymentWebhook): Promise<WebhookResult> {
        // Crypto payments don't typically use webhooks
        // This could be used for monitoring blockchain events
        this.logger.log('Crypto webhook received (not implemented)');
        
        return {
            success: true,
            eventType: 'crypto_transaction',
            processedAt: new Date(),
            data: webhookData.payload,
        };
    }

    async getPaymentAnalytics(startDate: Date, endDate: Date): Promise<PaymentAnalytics> {
        // Would require blockchain analytics or local transaction tracking
        return {
            totalTransactions: 0,
            totalAmount: 0,
            successfulTransactions: 0,
            failedTransactions: 0,
            averageTransactionAmount: 0,
            topPaymentMethods: [],
            currency: 'ETH',
            period: { startDate, endDate },
        };
    }

    async processSubscriptionPayment(request: SubscriptionPaymentRequest): Promise<SubscriptionPaymentResult> {
        // Crypto subscriptions would require a different approach
        throw new TouriiBackendAppException(
            TouriiBackendAppErrorType.E_PAYMENT_007,
            'Crypto subscription payments not supported'
        );
    }

    async getGatewayConfig(): Promise<PaymentGatewayConfig> {
        return {
            gatewayName: 'CryptoPayment',
            version: '1.0.0',
            supportedPaymentMethods: [PaymentMethod.CRYPTO_ETH, PaymentMethod.CRYPTO_BTC],
            supportedCurrencies: ['ETH', 'BTC'],
            maxTransactionAmount: 100, // ETH
            minTransactionAmount: 0.001, // ETH
            configuration: {
                ethReceivingAddress: process.env.ETH_RECEIVING_ADDRESS || this.ethWallet.address,
                btcReceivingAddress: process.env.BTC_RECEIVING_ADDRESS,
                network: 'mainnet',
            },
        };
    }
}
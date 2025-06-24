import type { PerkReservationEntity } from './perk-reservation.entity';

/**
 * Service interface for QR code generation and validation
 * Handles secure QR code creation for perk redemption
 */

// --- Types ---

export interface QRCodeData {
    reservationId: string;
    userId: string;
    perkId: string;
    expiresAt: Date;
    locationCode: string;
    validationType: 'BOOKING' | 'DISCOUNT';
    signature: string;
    metadata?: Record<string, any>;
}

export interface QRGenerationOptions {
    size?: number; // QR code size in pixels
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    format?: 'png' | 'svg' | 'jpeg';
    margin?: number;
    color?: {
        dark?: string;
        light?: string;
    };
}

export interface QRValidationResult {
    isValid: boolean;
    isExpired: boolean;
    reservationId?: string;
    userId?: string;
    perkId?: string;
    locationCode?: string;
    validationType?: 'BOOKING' | 'DISCOUNT';
    expiresAt?: Date;
    errorMessage?: string;
    metadata?: Record<string, any>;
}

export interface QRCodeSecurityConfig {
    secretKey: string;
    algorithm: 'HS256' | 'HS384' | 'HS512';
    issuer: string;
    audience: string;
}

export interface QRCodeService {
    /**
     * Generates a QR code for perk reservation
     * @param reservation - reservation entity
     * @param locationCode - location where perk can be redeemed
     * @param expiryHours - hours until QR expires (default 2)
     * @param options - QR generation options
     * @returns QR code data and image
     */
    generateReservationQR(
        reservation: PerkReservationEntity,
        locationCode: string,
        expiryHours?: number,
        options?: QRGenerationOptions
    ): Promise<{
        qrCodeData: string;
        qrImageBase64: string;
        qrImageUrl?: string;
        expiresAt: Date;
    }>;

    /**
     * Generates a QR code for discount application
     * @param userId - user identifier
     * @param perkId - perk identifier
     * @param discountAmount - discount amount or percentage
     * @param locationCode - location where discount can be used
     * @param expiryHours - hours until QR expires (default 24)
     * @param options - QR generation options
     * @returns QR code data and image
     */
    generateDiscountQR(
        userId: string,
        perkId: string,
        discountAmount: number,
        locationCode: string,
        expiryHours?: number,
        options?: QRGenerationOptions
    ): Promise<{
        qrCodeData: string;
        qrImageBase64: string;
        qrImageUrl?: string;
        expiresAt: Date;
    }>;

    /**
     * Validates a QR code and extracts data
     * @param qrCodeData - QR code data to validate
     * @param expectedLocations - array of valid location codes (optional)
     * @returns validation result with extracted data
     */
    validateQRCode(qrCodeData: string, expectedLocations?: string[]): Promise<QRValidationResult>;

    /**
     * Refreshes an existing QR code (extends expiry)
     * @param currentQRData - current QR code data
     * @param newExpiryHours - new expiry duration in hours
     * @param options - QR generation options
     * @returns new QR code data and image
     */
    refreshQRCode(
        currentQRData: string,
        newExpiryHours: number,
        options?: QRGenerationOptions
    ): Promise<{
        qrCodeData: string;
        qrImageBase64: string;
        qrImageUrl?: string;
        expiresAt: Date;
    }>;

    /**
     * Verifies QR code signature for security
     * @param qrCodeData - QR code data to verify
     * @returns true if signature is valid, false otherwise
     */
    verifyQRSignature(qrCodeData: string): Promise<boolean>;

    /**
     * Extracts data from QR code without validation
     * @param qrCodeData - QR code data
     * @returns extracted data or null if invalid format
     */
    extractQRData(qrCodeData: string): Promise<QRCodeData | null>;

    /**
     * Generates a batch of QR codes for multiple reservations
     * @param reservations - array of reservations
     * @param locationCode - location code for all QR codes
     * @param expiryHours - expiry duration for all QR codes
     * @param options - QR generation options
     * @returns array of QR code data and images
     */
    batchGenerateQRCodes(
        reservations: PerkReservationEntity[],
        locationCode: string,
        expiryHours?: number,
        options?: QRGenerationOptions
    ): Promise<Array<{
        reservationId: string;
        qrCodeData: string;
        qrImageBase64: string;
        qrImageUrl?: string;
        expiresAt: Date;
    }>>;

    /**
     * Creates a QR code for staff/partner validation tools
     * @param staffId - staff member identifier
     * @param locationCode - location code
     * @param permissions - array of permissions (e.g., ['redeem', 'validate'])
     * @param expiryHours - hours until QR expires
     * @param options - QR generation options
     * @returns staff QR code for validation app
     */
    generateStaffQR(
        staffId: string,
        locationCode: string,
        permissions: string[],
        expiryHours?: number,
        options?: QRGenerationOptions
    ): Promise<{
        qrCodeData: string;
        qrImageBase64: string;
        qrImageUrl?: string;
        expiresAt: Date;
    }>;

    /**
     * Validates staff QR code
     * @param qrCodeData - staff QR code data
     * @param requiredPermission - permission required for operation
     * @returns validation result with staff details
     */
    validateStaffQR(qrCodeData: string, requiredPermission: string): Promise<{
        isValid: boolean;
        staffId?: string;
        locationCode?: string;
        permissions?: string[];
        expiresAt?: Date;
        errorMessage?: string;
    }>;

    /**
     * Gets QR code usage statistics
     * @param startDate - start date for statistics
     * @param endDate - end date for statistics
     * @param locationCode - optional location filter
     * @returns QR code usage analytics
     */
    getQRUsageStats(startDate: Date, endDate: Date, locationCode?: string): Promise<{
        totalGenerated: number;
        totalValidated: number;
        totalRedeemed: number;
        totalExpired: number;
        validationSuccessRate: number;
        redemptionRate: number;
        avgTimeToRedeem: number; // minutes
        hourlyDistribution: { hour: number; count: number }[];
        locationDistribution: { location: string; count: number }[];
    }>;

    /**
     * Cleans up expired QR codes from storage
     * @param olderThanHours - remove QR codes older than this (default 48)
     * @returns number of QR codes cleaned up
     */
    cleanupExpiredQRCodes(olderThanHours?: number): Promise<number>;

    /**
     * Uploads QR code image to storage service
     * @param qrImageBase64 - base64 encoded QR image
     * @param reservationId - reservation identifier for naming
     * @returns public URL of uploaded image
     */
    uploadQRImage(qrImageBase64: string, reservationId: string): Promise<string>;

    /**
     * Configures QR code security settings
     * @param config - security configuration
     */
    configureQRSecurity(config: QRCodeSecurityConfig): void;

    /**
     * Generates QR code for testing/demo purposes
     * @param testData - custom test data
     * @param options - QR generation options
     * @returns test QR code
     */
    generateTestQR(testData: Record<string, any>, options?: QRGenerationOptions): Promise<{
        qrCodeData: string;
        qrImageBase64: string;
        decodedData: any;
    }>;
}
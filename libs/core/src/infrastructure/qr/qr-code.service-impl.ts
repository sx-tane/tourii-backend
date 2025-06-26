import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as QRCode from 'qrcode';
import type {
    QRCodeService,
    QRCodeData,
    QRGenerationOptions,
    QRValidationResult,
    QRCodeSecurityConfig,
} from '../../domain/perks/qr-code.service';
import type { PerkReservationEntity } from '../../domain/perks/perk-reservation.entity';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';

@Injectable()
export class QRCodeServiceImpl implements QRCodeService {
    private securityConfig: QRCodeSecurityConfig = {
        secretKey: process.env.QR_SECRET_KEY || 'tourii-qr-secret-key-2025',
        algorithm: 'HS256',
        issuer: 'tourii-backend',
        audience: 'tourii-mobile-app',
    };

    configureQRSecurity(config: QRCodeSecurityConfig): void {
        this.securityConfig = config;
    }

    async generateReservationQR(
        reservation: PerkReservationEntity,
        locationCode: string,
        expiryHours = 2,
        options: QRGenerationOptions = {}
    ): Promise<{
        qrCodeData: string;
        qrImageBase64: string;
        qrImageUrl?: string;
        expiresAt: Date;
    }> {
        try {
            if (!reservation.reservationId) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_RESERVATION_007,
                    'Reservation ID is required for QR generation'
                );
            }

            const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

            const qrData: QRCodeData = {
                reservationId: reservation.reservationId,
                userId: reservation.userId,
                perkId: reservation.perkId,
                expiresAt,
                locationCode,
                validationType: 'BOOKING',
                signature: '', // Will be set by JWT
                metadata: {
                    partySize: reservation.partySize,
                    specialRequests: reservation.specialRequests,
                    reservationDate: reservation.reservationDate.toISOString(),
                },
            };

            // Create JWT token with QR data
            const jwtPayload = {
                ...qrData,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(expiresAt.getTime() / 1000),
            };

            const qrCodeData = jwt.sign(jwtPayload, this.securityConfig.secretKey, {
                algorithm: this.securityConfig.algorithm,
                issuer: this.securityConfig.issuer,
                audience: this.securityConfig.audience,
            });

            // Generate QR code image
            const qrImageBase64 = await this.generateQRImage(qrCodeData, options);

            // Optionally upload to storage
            let qrImageUrl: string | undefined;
            if (process.env.ENABLE_QR_UPLOAD === 'true') {
                qrImageUrl = await this.uploadQRImage(qrImageBase64, reservation.reservationId);
            }

            return {
                qrCodeData,
                qrImageBase64,
                qrImageUrl,
                expiresAt,
            };
        } catch (error) {
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_007,
                `Failed to generate reservation QR: ${error.message}`
            );
        }
    }

    async generateDiscountQR(
        userId: string,
        perkId: string,
        discountAmount: number,
        locationCode: string,
        expiryHours = 24,
        options: QRGenerationOptions = {}
    ): Promise<{
        qrCodeData: string;
        qrImageBase64: string;
        qrImageUrl?: string;
        expiresAt: Date;
    }> {
        try {
            const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

            const qrData: QRCodeData = {
                reservationId: `DISCOUNT-${Date.now()}`, // Temporary ID for discounts
                userId,
                perkId,
                expiresAt,
                locationCode,
                validationType: 'DISCOUNT',
                signature: '', // Will be set by JWT
                metadata: {
                    discountAmount,
                    discountType: discountAmount <= 1 ? 'percentage' : 'fixed',
                },
            };

            // Create JWT token with QR data
            const jwtPayload = {
                ...qrData,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(expiresAt.getTime() / 1000),
            };

            const qrCodeData = jwt.sign(jwtPayload, this.securityConfig.secretKey, {
                algorithm: this.securityConfig.algorithm,
                issuer: this.securityConfig.issuer,
                audience: this.securityConfig.audience,
            });

            // Generate QR code image
            const qrImageBase64 = await this.generateQRImage(qrCodeData, options);

            return {
                qrCodeData,
                qrImageBase64,
                expiresAt,
            };
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_007,
                `Failed to generate discount QR: ${error.message}`
            );
        }
    }

    async validateQRCode(qrCodeData: string, expectedLocations?: string[]): Promise<QRValidationResult> {
        try {
            // Verify JWT signature and extract data
            const decoded = jwt.verify(qrCodeData, this.securityConfig.secretKey, {
                algorithms: [this.securityConfig.algorithm],
                issuer: this.securityConfig.issuer,
                audience: this.securityConfig.audience,
            }) as any;

            const qrData = decoded as QRCodeData;

            // Check expiry
            const now = new Date();
            const isExpired = qrData.expiresAt < now;

            // Check location if specified
            let isValidLocation = true;
            if (expectedLocations && expectedLocations.length > 0) {
                isValidLocation = expectedLocations.includes(qrData.locationCode);
            }

            // Determine overall validity
            const isValid = !isExpired && isValidLocation;

            let errorMessage: string | undefined;
            if (isExpired) {
                errorMessage = 'QR code has expired';
            } else if (!isValidLocation) {
                errorMessage = 'QR code is not valid for this location';
            }

            return {
                isValid,
                isExpired,
                reservationId: qrData.reservationId,
                userId: qrData.userId,
                perkId: qrData.perkId,
                locationCode: qrData.locationCode,
                validationType: qrData.validationType,
                expiresAt: qrData.expiresAt,
                metadata: qrData.metadata,
                errorMessage,
            };
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return {
                    isValid: false,
                    isExpired: false,
                    errorMessage: 'Invalid QR code signature',
                };
            }
            if (error instanceof jwt.TokenExpiredError) {
                return {
                    isValid: false,
                    isExpired: true,
                    errorMessage: 'QR code has expired',
                };
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_008,
                `Failed to validate QR code: ${error.message}`
            );
        }
    }

    async refreshQRCode(
        currentQRData: string,
        newExpiryHours: number,
        options: QRGenerationOptions = {}
    ): Promise<{
        qrCodeData: string;
        qrImageBase64: string;
        qrImageUrl?: string;
        expiresAt: Date;
    }> {
        try {
            // Extract existing data without validation (ignoring expiry)
            const existingData = await this.extractQRData(currentQRData);
            if (!existingData) {
                throw new TouriiBackendAppException(
                    TouriiBackendAppErrorType.E_RESERVATION_008,
                    'Cannot extract data from current QR code'
                );
            }

            // Create new QR with updated expiry
            const newExpiresAt = new Date(Date.now() + newExpiryHours * 60 * 60 * 1000);
            
            const newQrData: QRCodeData = {
                ...existingData,
                expiresAt: newExpiresAt,
            };

            // Create new JWT token
            const jwtPayload = {
                ...newQrData,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(newExpiresAt.getTime() / 1000),
            };

            const qrCodeData = jwt.sign(jwtPayload, this.securityConfig.secretKey, {
                algorithm: this.securityConfig.algorithm,
                issuer: this.securityConfig.issuer,
                audience: this.securityConfig.audience,
            });

            // Generate new QR code image
            const qrImageBase64 = await this.generateQRImage(qrCodeData, options);

            return {
                qrCodeData,
                qrImageBase64,
                expiresAt: newExpiresAt,
            };
        } catch (error) {
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_007,
                `Failed to refresh QR code: ${error.message}`
            );
        }
    }

    async verifyQRSignature(qrCodeData: string): Promise<boolean> {
        try {
            jwt.verify(qrCodeData, this.securityConfig.secretKey, {
                algorithms: [this.securityConfig.algorithm],
                issuer: this.securityConfig.issuer,
                audience: this.securityConfig.audience,
                ignoreExpiration: true, // Only check signature, not expiry
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async extractQRData(qrCodeData: string): Promise<QRCodeData | null> {
        try {
            const decoded = jwt.decode(qrCodeData) as any;
            if (!decoded) {
                return null;
            }

            return {
                reservationId: decoded.reservationId,
                userId: decoded.userId,
                perkId: decoded.perkId,
                expiresAt: new Date(decoded.expiresAt * 1000),
                locationCode: decoded.locationCode,
                validationType: decoded.validationType,
                signature: decoded.signature || '',
                metadata: decoded.metadata,
            };
        } catch (error) {
            return null;
        }
    }

    async batchGenerateQRCodes(
        reservations: PerkReservationEntity[],
        locationCode: string,
        expiryHours = 2,
        options: QRGenerationOptions = {}
    ): Promise<Array<{
        reservationId: string;
        qrCodeData: string;
        qrImageBase64: string;
        qrImageUrl?: string;
        expiresAt: Date;
    }>> {
        const results = [];

        for (const reservation of reservations) {
            try {
                const qrResult = await this.generateReservationQR(
                    reservation,
                    locationCode,
                    expiryHours,
                    options
                );

                results.push({
                    reservationId: reservation.reservationId!,
                    ...qrResult,
                });
            } catch (error) {
                // Log error but continue with other reservations
                console.error(`Failed to generate QR for reservation ${reservation.reservationId}:`, error);
            }
        }

        return results;
    }

    async generateStaffQR(
        staffId: string,
        locationCode: string,
        permissions: string[],
        expiryHours = 8,
        options: QRGenerationOptions = {}
    ): Promise<{
        qrCodeData: string;
        qrImageBase64: string;
        qrImageUrl?: string;
        expiresAt: Date;
    }> {
        try {
            const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

            const staffQrData = {
                staffId,
                locationCode,
                permissions,
                expiresAt,
                qrType: 'STAFF_AUTH',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(expiresAt.getTime() / 1000),
            };

            const qrCodeData = jwt.sign(staffQrData, this.securityConfig.secretKey, {
                algorithm: this.securityConfig.algorithm,
                issuer: this.securityConfig.issuer,
                audience: this.securityConfig.audience,
            });

            const qrImageBase64 = await this.generateQRImage(qrCodeData, options);

            return {
                qrCodeData,
                qrImageBase64,
                expiresAt,
            };
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_007,
                `Failed to generate staff QR: ${error.message}`
            );
        }
    }

    async validateStaffQR(qrCodeData: string, requiredPermission: string): Promise<{
        isValid: boolean;
        staffId?: string;
        locationCode?: string;
        permissions?: string[];
        expiresAt?: Date;
        errorMessage?: string;
    }> {
        try {
            const decoded = jwt.verify(qrCodeData, this.securityConfig.secretKey, {
                algorithms: [this.securityConfig.algorithm],
                issuer: this.securityConfig.issuer,
                audience: this.securityConfig.audience,
            }) as any;

            if (decoded.qrType !== 'STAFF_AUTH') {
                return {
                    isValid: false,
                    errorMessage: 'Not a staff authentication QR code',
                };
            }

            const hasPermission = decoded.permissions.includes(requiredPermission);
            if (!hasPermission) {
                return {
                    isValid: false,
                    staffId: decoded.staffId,
                    locationCode: decoded.locationCode,
                    permissions: decoded.permissions,
                    errorMessage: `Staff does not have required permission: ${requiredPermission}`,
                };
            }

            return {
                isValid: true,
                staffId: decoded.staffId,
                locationCode: decoded.locationCode,
                permissions: decoded.permissions,
                expiresAt: new Date(decoded.exp * 1000),
            };
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return {
                    isValid: false,
                    errorMessage: 'Invalid staff QR code signature',
                };
            }
            if (error instanceof jwt.TokenExpiredError) {
                return {
                    isValid: false,
                    errorMessage: 'Staff QR code has expired',
                };
            }
            return {
                isValid: false,
                errorMessage: `Staff QR validation failed: ${error.message}`,
            };
        }
    }

    async getQRUsageStats(startDate: Date, endDate: Date, locationCode?: string): Promise<{
        totalGenerated: number;
        totalValidated: number;
        totalRedeemed: number;
        totalExpired: number;
        validationSuccessRate: number;
        redemptionRate: number;
        avgTimeToRedeem: number;
        hourlyDistribution: { hour: number; count: number }[];
        locationDistribution: { location: string; count: number }[];
    }> {
        // This would require integration with a metrics/analytics service
        // For now, return mock data structure
        return {
            totalGenerated: 0,
            totalValidated: 0,
            totalRedeemed: 0,
            totalExpired: 0,
            validationSuccessRate: 0,
            redemptionRate: 0,
            avgTimeToRedeem: 0,
            hourlyDistribution: [],
            locationDistribution: [],
        };
    }

    async cleanupExpiredQRCodes(olderThanHours = 48): Promise<number> {
        // This would require integration with a storage cleanup service
        // For now, return 0 as mock implementation
        return 0;
    }

    async uploadQRImage(qrImageBase64: string, reservationId: string): Promise<string> {
        // This would integrate with R2 or other cloud storage
        // For now, return a mock URL
        return `https://tourii-qr-storage.example.com/${reservationId}-${Date.now()}.png`;
    }

    async generateTestQR(testData: Record<string, any>, options: QRGenerationOptions = {}): Promise<{
        qrCodeData: string;
        qrImageBase64: string;
        decodedData: any;
    }> {
        try {
            const testQrData = {
                ...testData,
                qrType: 'TEST',
                generatedAt: new Date().toISOString(),
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor((Date.now() + 60 * 60 * 1000) / 1000), // 1 hour expiry
            };

            const qrCodeData = jwt.sign(testQrData, this.securityConfig.secretKey, {
                algorithm: this.securityConfig.algorithm,
                issuer: this.securityConfig.issuer,
                audience: this.securityConfig.audience,
            });

            const qrImageBase64 = await this.generateQRImage(qrCodeData, options);

            return {
                qrCodeData,
                qrImageBase64,
                decodedData: testQrData,
            };
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_007,
                `Failed to generate test QR: ${error.message}`
            );
        }
    }

    private async generateQRImage(data: string, options: QRGenerationOptions): Promise<string> {
        try {
            const qrOptions = {
                width: options.size || 512,
                margin: options.margin || 2,
                color: {
                    dark: options.color?.dark || '#000000',
                    light: options.color?.light || '#FFFFFF',
                },
                errorCorrectionLevel: options.errorCorrectionLevel || 'M',
            };

            const qrImageBuffer = await QRCode.toBuffer(data, qrOptions);
            return qrImageBuffer.toString('base64');
        } catch (error) {
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_RESERVATION_007,
                `Failed to generate QR image: ${error.message}`
            );
        }
    }
}
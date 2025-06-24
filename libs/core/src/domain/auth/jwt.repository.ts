import * as jwt from 'jsonwebtoken';

export interface QrCodePayload extends Record<string, unknown> {
    tokenId: string;
    type: 'passport_verification';
    issuedAt: number;
    expiresAt: number;
}

export interface JwtRepository {
    /**
     * Generate JWT token
     * @param payload JWT payload object
     * @returns JWT token
     */
    generateJwtToken<T extends Record<string, unknown>>(
        payload: T,
        options?: jwt.SignOptions,
    ): string;
    /**
     * Get data from JWT token
     * @param token JWT token string
     * @returns decoded JWT payload
     * @throws TouriiBackendAppException
     */
    dataFromToken<T = Record<string, unknown>>(token: string): T;
    /**
     * Generate QR code verification token
     * @param tokenId - The passport token ID
     * @param expirationHours - Hours until expiration (default 24)
     * @returns JWT token for QR code
     */
    generateQrToken(tokenId: string, expirationHours?: number): string;
    /**
     * Verify QR code token
     * @param qrToken - The QR code JWT token
     * @returns QR code payload if valid
     * @throws TouriiBackendAppException if invalid
     */
    verifyQrToken(qrToken: string): QrCodePayload;
}

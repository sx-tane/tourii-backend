import * as jwt from 'jsonwebtoken';

export interface JwtRepository {
    /**
     * Generate JWT token
     * @param payload
     * @returns JWT token
     */
    generateJwtToken(payload: any, options?: jwt.SignOptions): string;
    /**
     * Get data from JWT token
     * @param token
     * @returns data from JWT token
     * @throws TouriiBackendAppException
     */
    dataFromToken(token: string): any;
}

import * as jwt from 'jsonwebtoken';

export interface JwtRepository {
    /**
     * Generate JWT token
     * @param payload JWT payload object
     * @returns JWT token
     */
    generateJwtToken<T extends Record<string, unknown>>(payload: T, options?: jwt.SignOptions): string;
    /**
     * Get data from JWT token
     * @param token JWT token string
     * @returns decoded JWT payload
     * @throws TouriiBackendAppException
     */
    dataFromToken<T = Record<string, unknown>>(token: string): T;
}

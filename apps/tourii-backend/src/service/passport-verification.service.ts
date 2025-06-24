import { JwtRepository, QrCodePayload } from '@app/core/domain/auth/jwt.repository';
import { PassportMetadataRepository } from '@app/core/domain/passport/passport-metadata.repository';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Inject, Injectable, Logger } from '@nestjs/common';

export interface VerificationResult {
    valid: boolean;
    tokenId: string;
    verifiedAt: Date;
    expiresAt?: Date;
    passportData?: {
        username: string;
        level: string;
        passportType: string;
        questsCompleted: number;
        travelDistance: number;
        magatamaPoints: number;
        registeredAt: Date;
    };
    error?: string;
}

export interface BatchVerificationRequest {
    tokens: string[];
}

export interface BatchVerificationResult {
    results: VerificationResult[];
    summary: {
        total: number;
        valid: number;
        invalid: number;
    };
}

export interface VerificationStats {
    tokenId?: string;
    totalVerifications: number;
    todayVerifications: number;
    lastVerified?: Date;
    popularPassports?: {
        tokenId: string;
        username: string;
        verificationCount: number;
    }[];
}

@Injectable()
export class PassportVerificationService {
    private readonly logger = new Logger(PassportVerificationService.name);
    
    // Simple in-memory storage for verification stats - in production this would be in database
    private verificationStats = new Map<string, { count: number; lastVerified: Date }>();

    constructor(
        @Inject('JWT_REPOSITORY_TOKEN')
        private readonly jwtRepository: JwtRepository,
        @Inject('PASSPORT_METADATA_REPOSITORY_TOKEN')
        private readonly passportMetadataRepository: PassportMetadataRepository,
    ) {}

    async verifyPassport(verificationCode: string): Promise<VerificationResult> {
        try {
            this.logger.log(`Verifying passport with code: ${verificationCode.substring(0, 20)}...`);

            // Verify QR token
            const qrPayload = this.jwtRepository.verifyQrToken(verificationCode);
            
            // Get passport metadata
            const metadata = await this.passportMetadataRepository.generateMetadata(qrPayload.tokenId);
            
            // Update verification stats
            this.updateVerificationStats(qrPayload.tokenId);

            const result: VerificationResult = {
                valid: true,
                tokenId: qrPayload.tokenId,
                verifiedAt: new Date(),
                expiresAt: new Date(qrPayload.expiresAt * 1000),
                passportData: {
                    username: metadata.attributes.find(a => a.trait_type === 'Username')?.value as string || 'Unknown',
                    level: metadata.attributes.find(a => a.trait_type === 'Level')?.value as string || 'Unknown',
                    passportType: metadata.attributes.find(a => a.trait_type === 'Passport Type')?.value as string || 'Unknown',
                    questsCompleted: metadata.attributes.find(a => a.trait_type === 'Quests Completed')?.value as number || 0,
                    travelDistance: Math.floor(metadata.attributes.find(a => a.trait_type === 'Travel Distance')?.value as number || 0),
                    magatamaPoints: metadata.attributes.find(a => a.trait_type === 'Magatama Points')?.value as number || 0,
                    registeredAt: new Date(metadata.attributes.find(a => a.trait_type === 'Registration Date')?.value as number * 1000 || Date.now()),
                }
            };

            this.logger.log(`Passport verification successful for token ID: ${qrPayload.tokenId}`);
            return result;
        } catch (error) {
            this.logger.error(`Passport verification failed:`, error);
            
            return {
                valid: false,
                tokenId: 'unknown',
                verifiedAt: new Date(),
                error: error instanceof Error ? error.message : 'Verification failed'
            };
        }
    }

    async batchVerifyPassports(request: BatchVerificationRequest): Promise<BatchVerificationResult> {
        try {
            this.logger.log(`Batch verifying ${request.tokens.length} passports`);

            const results = await Promise.all(
                request.tokens.map(token => this.verifyPassport(token))
            );

            const summary = {
                total: results.length,
                valid: results.filter(r => r.valid).length,
                invalid: results.filter(r => !r.valid).length
            };

            this.logger.log(`Batch verification completed: ${summary.valid}/${summary.total} valid`);

            return { results, summary };
        } catch (error) {
            this.logger.error(`Batch verification failed:`, error);
            throw error;
        }
    }

    async verifyQrCode(qrCode: string): Promise<VerificationResult> {
        // QR code verification is the same as regular verification
        return this.verifyPassport(qrCode);
    }

    async getVerificationStats(tokenId?: string): Promise<VerificationStats> {
        try {
            if (tokenId) {
                // Get stats for specific token
                const stats = this.verificationStats.get(tokenId);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const todayVerifications = stats && stats.lastVerified >= today ? 1 : 0;

                return {
                    tokenId,
                    totalVerifications: stats?.count || 0,
                    todayVerifications,
                    lastVerified: stats?.lastVerified
                };
            } else {
                // Get global stats
                let totalVerifications = 0;
                let todayVerifications = 0;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                for (const [token, stats] of this.verificationStats.entries()) {
                    totalVerifications += stats.count;
                    if (stats.lastVerified >= today) {
                        todayVerifications++;
                    }
                }

                // Get popular passports (top 5)
                const popularPassports = Array.from(this.verificationStats.entries())
                    .sort((a, b) => b[1].count - a[1].count)
                    .slice(0, 5)
                    .map(([tokenId, stats]) => ({
                        tokenId,
                        username: 'Unknown', // Would need to fetch from metadata in real implementation
                        verificationCount: stats.count
                    }));

                return {
                    totalVerifications,
                    todayVerifications,
                    popularPassports
                };
            }
        } catch (error) {
            this.logger.error(`Failed to get verification stats:`, error);
            throw error;
        }
    }

    private updateVerificationStats(tokenId: string): void {
        const current = this.verificationStats.get(tokenId) || { count: 0, lastVerified: new Date(0) };
        current.count++;
        current.lastVerified = new Date();
        this.verificationStats.set(tokenId, current);
    }
}
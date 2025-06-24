import { DeviceInfo, WalletPassRepository } from '@app/core/domain/passport/wallet-pass.repository';
import { R2StorageRepository } from '@app/core/domain/storage/r2-storage.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';

export interface WalletPassResult {
    tokenId: string;
    platform: 'apple' | 'google';
    downloadUrl?: string;
    redirectUrl: string;
    expiresAt: Date;
    passBuffer?: Buffer;
}

export interface BothWalletPassesResult {
    tokenId: string;
    apple: WalletPassResult;
    google: WalletPassResult;
}

@Injectable()
export class WalletPassService {
    private readonly logger = new Logger(WalletPassService.name);

    constructor(
        @Inject('WALLET_PASS_REPOSITORY_TOKEN')
        private readonly walletPassRepository: WalletPassRepository,
        @Inject('R2_STORAGE_REPOSITORY_TOKEN')
        private readonly r2StorageRepository: R2StorageRepository,
    ) {}

    async generateApplePass(tokenId: string): Promise<WalletPassResult> {
        try {
            this.logger.log(`Generating Apple Wallet pass for token ID: ${tokenId}`);

            const passData = await this.walletPassRepository.generateApplePass(tokenId);

            // Return the pass with buffer for direct download
            return {
                tokenId,
                platform: 'apple',
                redirectUrl: passData.passUrl,
                expiresAt: passData.expiresAt,
                passBuffer: passData.passBuffer,
            };
        } catch (error) {
            this.logger.error(`Failed to generate Apple pass for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async generateGooglePass(tokenId: string): Promise<WalletPassResult> {
        try {
            this.logger.log(`Generating Google Pay pass for token ID: ${tokenId}`);

            const passData = await this.walletPassRepository.generateGooglePass(tokenId);

            return {
                tokenId,
                platform: 'google',
                redirectUrl: passData.passUrl,
                expiresAt: passData.expiresAt,
            };
        } catch (error) {
            this.logger.error(`Failed to generate Google pass for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async generateAutoPass(tokenId: string, userAgent: string): Promise<WalletPassResult> {
        try {
            this.logger.log(
                `Auto-generating wallet pass for token ID: ${tokenId}, User-Agent: ${userAgent}`,
            );

            const deviceInfo = this.walletPassRepository.detectPlatform(userAgent);
            const passData = await this.walletPassRepository.generateAutoPass(tokenId, deviceInfo);

            if (passData.platform === 'apple') {
                // Upload Apple pass to R2
                const key = `passports/apple/${tokenId}_${Date.now()}.pkpass`;
                const downloadUrl = await this.r2StorageRepository.uploadWalletPass(
                    passData.passBuffer,
                    key,
                    'application/vnd.apple.pkpass',
                );

                return {
                    tokenId,
                    platform: 'apple',
                    downloadUrl,
                    redirectUrl: downloadUrl,
                    expiresAt: passData.expiresAt,
                };
            } else {
                return {
                    tokenId,
                    platform: 'google',
                    redirectUrl: passData.passUrl,
                    expiresAt: passData.expiresAt,
                };
            }
        } catch (error) {
            this.logger.error(`Failed to auto-generate pass for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async generateBothPasses(tokenId: string): Promise<BothWalletPassesResult> {
        try {
            this.logger.log(`Generating both wallet passes for token ID: ${tokenId}`);

            const [appleResult, googleResult] = await Promise.all([
                this.generateApplePass(tokenId),
                this.generateGooglePass(tokenId),
            ]);

            return {
                tokenId,
                apple: appleResult,
                google: googleResult,
            };
        } catch (error) {
            this.logger.error(`Failed to generate both passes for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async updatePass(tokenId: string, platform: 'apple' | 'google'): Promise<WalletPassResult> {
        try {
            this.logger.log(`Updating ${platform} pass for token ID: ${tokenId}`);

            if (platform === 'apple') {
                return await this.generateApplePass(tokenId);
            } else {
                return await this.generateGooglePass(tokenId);
            }
        } catch (error) {
            this.logger.error(`Failed to update ${platform} pass for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async revokePass(tokenId: string, platform: 'apple' | 'google'): Promise<boolean> {
        try {
            this.logger.log(`Revoking ${platform} pass for token ID: ${tokenId}`);
            return await this.walletPassRepository.revokePass(tokenId, platform);
        } catch (error) {
            this.logger.error(`Failed to revoke ${platform} pass for token ID ${tokenId}:`, error);
            return false;
        }
    }

    detectPlatform(userAgent: string): DeviceInfo {
        return this.walletPassRepository.detectPlatform(userAgent);
    }

    async getPassStatus(tokenId: string): Promise<{ apple: boolean; google: boolean }> {
        try {
            // In a real implementation, this would check if passes exist and are valid
            // For now, we'll assume passes can be generated if token is valid
            const [appleValid, googleValid] = await Promise.all([
                this.validateToken(tokenId),
                this.validateToken(tokenId),
            ]);

            return {
                apple: appleValid,
                google: googleValid,
            };
        } catch (error) {
            this.logger.error(`Failed to get pass status for token ID ${tokenId}:`, error);
            return { apple: false, google: false };
        }
    }

    private async validateToken(tokenId: string): Promise<boolean> {
        try {
            // Validate by trying to generate metadata
            await this.walletPassRepository.generateApplePass(tokenId);
            return true;
        } catch {
            return false;
        }
    }
}

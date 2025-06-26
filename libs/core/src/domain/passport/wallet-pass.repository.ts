export interface WalletPassData {
    tokenId: string;
    passBuffer: Buffer;
    passUrl: string;
    platform: 'apple' | 'google';
    expiresAt: Date;
}

export interface DeviceInfo {
    userAgent: string;
    platform: 'ios' | 'android' | 'web';
}

export interface WalletPassRepository {
    /**
     * Generate Apple Wallet pass (.pkpass)
     * @param tokenId - The passport token ID
     * @returns Apple Wallet pass data
     */
    generateApplePass(tokenId: string): Promise<WalletPassData>;

    /**
     * Generate Google Pay pass
     * @param tokenId - The passport token ID
     * @returns Google Pay pass data
     */
    generateGooglePass(tokenId: string): Promise<WalletPassData>;

    /**
     * Auto-detect platform and generate appropriate pass
     * @param tokenId - The passport token ID
     * @param deviceInfo - Device/browser information
     * @returns Platform-specific pass data
     */
    generateAutoPass(tokenId: string, deviceInfo: DeviceInfo): Promise<WalletPassData>;

    /**
     * Generate passes for both platforms
     * @param tokenId - The passport token ID
     * @returns Both Apple and Google pass data
     */
    generateBothPasses(tokenId: string): Promise<{ apple: WalletPassData; google: WalletPassData }>;

    /**
     * Update existing pass with new achievements
     * @param tokenId - The passport token ID
     * @param platform - Target platform
     * @returns Updated pass data
     */
    updatePass(tokenId: string, platform: 'apple' | 'google'): Promise<WalletPassData>;

    /**
     * Revoke pass access
     * @param tokenId - The passport token ID
     * @param platform - Target platform
     * @returns Success status
     */
    revokePass(tokenId: string, platform: 'apple' | 'google'): Promise<boolean>;

    /**
     * Detect device platform from user agent
     * @param userAgent - Browser user agent string
     * @returns Device information
     */
    detectPlatform(userAgent: string): DeviceInfo;
}

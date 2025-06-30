export interface PassportPdfResult {
    tokenId: string;
    downloadUrl: string;
    qrCode: string;
    expiresAt: Date;
}

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

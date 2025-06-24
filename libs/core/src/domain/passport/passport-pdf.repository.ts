export interface PassportPdfData {
    tokenId: string;
    pdfBuffer: Buffer;
    qrCode: string;
    expiresAt: Date;
}

export interface PassportPdfRepository {
    /**
     * Generate PDF passport document
     * @param tokenId - The passport token ID
     * @returns PDF data with buffer and QR code
     */
    generatePdf(tokenId: string): Promise<PassportPdfData>;

    /**
     * Generate PDF preview without upload
     * @param tokenId - The passport token ID
     * @returns PDF buffer only
     */
    generatePreview(tokenId: string): Promise<Buffer>;

    /**
     * Validate token ID exists
     * @param tokenId - The passport token ID
     * @returns true if valid
     */
    validateTokenId(tokenId: string): Promise<boolean>;
}
export interface R2StorageRepository {
    uploadProofImage(file: Buffer, key: string, contentType: string): Promise<string>;
    uploadMetadata(metadata: object, key: string): Promise<string>;
    generatePublicUrl(key: string): string;
}

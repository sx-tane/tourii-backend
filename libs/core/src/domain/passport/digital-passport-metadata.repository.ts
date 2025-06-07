export interface DigitalPassportMetadataRepository {
    /**
     * Upload digital passport metadata JSON to storage.
     * @param passportId passport token ID
     * @param metadata metadata object
     * @returns public URL of uploaded metadata
     */
    uploadMetadata(passportId: string, metadata: unknown): Promise<string>;
}

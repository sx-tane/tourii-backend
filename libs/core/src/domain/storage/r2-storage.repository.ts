export interface R2StorageRepository {
    /***
     * Upload a proof image to R2 storage
     * @param file - The file to upload
     * @param key - The key to upload the file to
     * @param contentType - The content type of the file
     * @returns The URL of the uploaded file
     */
    uploadProof(file: Buffer, key: string, contentType: string): Promise<string>;
    /***
     * Upload metadata to R2 storage
     * @param metadata - The metadata to upload
     * @param key - The key to upload the metadata to
     * @returns The URL of the uploaded metadata
     */
    uploadMetadata(metadata: object, key: string): Promise<string>;
    /***
     * Generate a public URL for a file in R2 storage
     * @param key - The key of the file
     * @returns The public URL of the file
     */
    generatePublicUrl(key: string): string;
}

import { HexString } from '@gear-js/api/types';

export interface EncryptionRepository {
    /**
     * Decrypt string
     * @param text
     * @returns decrypted string
     * @throws TouriiBackendAppException
     */
    encryptString(text: string): string;

    /**
     * Encrypt string
     * @param text
     * @returns encrypted string
     * @throws TouriiBackendAppException
     */
    decodeAddress(publicKey: string): HexString;
}

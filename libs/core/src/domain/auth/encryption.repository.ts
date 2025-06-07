import { HexString } from '@gear-js/api/types';

export interface EncryptionRepository {
    /**
     * Encrypt plain text using AES‑256.
     * @param text text to encrypt
     * @returns encrypted text with IV prefix
     * @throws TouriiBackendAppException
     */
    encryptString(text: string): string;

    /**
     * Decrypt previously encrypted text
     * @param text text produced by {@link encryptString}
     * @returns decrypted plain text
     * @throws TouriiBackendAppException
     */
    decryptString(text: string): string;

    /**
     * Decode a polkadot address to hex format
     * @param publicKey SS58 address
     */
    decodeAddress(publicKey: string): HexString;
}

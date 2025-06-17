import { DigitalPassportMetadata, PassportMetadataInput } from './digital-passport-metadata';

export interface PassportMetadataRepository {
    generateMetadata(tokenId: string): Promise<DigitalPassportMetadata>;
    updateMetadata(tokenId: string): Promise<string>;
    getMetadataUrl(tokenId: string): string;
}
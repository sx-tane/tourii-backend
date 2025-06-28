import { Injectable } from '@nestjs/common';
import { JapaneseAddressParserUtil } from '../../utils/japanese-address-parser.util';

export interface ParsedJapaneseAddress {
    prefecture: string;
    city?: string;
    ward?: string;
    district?: string;
    originalAddress: string;
    confidence: number; // 0.0 to 1.0
}

/**
 * Service wrapper for Japanese address parsing functionality
 * Delegates to utility class for actual parsing logic
 */
@Injectable()
export class JapaneseAddressParserService {
    /**
     * Parses a Japanese address and extracts the prefecture
     */
    public parseAddress(address: string): ParsedJapaneseAddress {
        return JapaneseAddressParserUtil.parseAddress(address);
    }

    /**
     * Batch parse multiple addresses
     */
    public parseMultipleAddresses(addresses: string[]): ParsedJapaneseAddress[] {
        return JapaneseAddressParserUtil.parseMultipleAddresses(addresses);
    }

    /**
     * Get all supported prefectures
     */
    public getSupportedPrefectures(): string[] {
        return JapaneseAddressParserUtil.getSupportedPrefectures();
    }
}

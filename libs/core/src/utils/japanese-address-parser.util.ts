import { MAJOR_CITIES, PREFECTURE_MAPPING } from '../domain/geo/japanese-address.constants';
import type { ParsedJapaneseAddress } from '../infrastructure/geo/japanese-address-parser.service';

/**
 * Utility class for parsing Japanese addresses
 * Contains all the parsing logic extracted from the service
 */
export class JapaneseAddressParserUtil {
    /**
     * Parses a Japanese address and extracts the prefecture
     */
    public static parseAddress(address: string): ParsedJapaneseAddress {
        if (!address || address.trim().length === 0) {
            return {
                prefecture: 'Unknown',
                originalAddress: address,
                confidence: 0.0,
            };
        }

        const normalizedAddress = address.toLowerCase().trim();

        // Try multiple parsing strategies
        const strategies = [
            JapaneseAddressParserUtil.parseByDirectPrefectureMatch,
            JapaneseAddressParserUtil.parseByMajorCityMatch,
            JapaneseAddressParserUtil.parseByPositionalAnalysis,
            JapaneseAddressParserUtil.parseByPostalCodePattern,
        ];

        for (const strategy of strategies) {
            const result = strategy(normalizedAddress, address);
            if (result.confidence > 0.5) {
                return result;
            }
        }

        // Fallback to best effort
        return JapaneseAddressParserUtil.parseByBestEffort(normalizedAddress, address);
    }

    /**
     * Strategy 1: Direct prefecture name matching
     */
    private static parseByDirectPrefectureMatch(
        normalizedAddress: string,
        originalAddress: string,
    ): ParsedJapaneseAddress {
        for (const [key, prefecture] of Object.entries(PREFECTURE_MAPPING)) {
            if (normalizedAddress.includes(key)) {
                return {
                    prefecture,
                    originalAddress,
                    confidence: 0.9,
                    city: JapaneseAddressParserUtil.extractCity(normalizedAddress),
                    ward: JapaneseAddressParserUtil.extractWard(normalizedAddress),
                };
            }
        }

        return { prefecture: 'Unknown', originalAddress, confidence: 0.0 };
    }

    /**
     * Strategy 2: Major city matching to prefecture
     */
    private static parseByMajorCityMatch(
        normalizedAddress: string,
        originalAddress: string,
    ): ParsedJapaneseAddress {
        for (const [city, prefecture] of Object.entries(MAJOR_CITIES)) {
            if (normalizedAddress.includes(city)) {
                return {
                    prefecture,
                    city: JapaneseAddressParserUtil.capitalizeFirst(city),
                    originalAddress,
                    confidence: 0.8,
                };
            }
        }

        return { prefecture: 'Unknown', originalAddress, confidence: 0.0 };
    }

    /**
     * Strategy 3: Positional analysis (prefecture usually comes first in Japanese addresses)
     */
    private static parseByPositionalAnalysis(
        normalizedAddress: string,
        originalAddress: string,
    ): ParsedJapaneseAddress {
        // Split by common separators
        const parts = normalizedAddress.split(/[,，、\s]+/).filter((part) => part.length > 0);

        for (const part of parts) {
            const trimmedPart = part.trim();
            for (const [key, prefecture] of Object.entries(PREFECTURE_MAPPING)) {
                if (trimmedPart === key || trimmedPart.endsWith(key)) {
                    return {
                        prefecture,
                        originalAddress,
                        confidence: 0.7,
                    };
                }
            }
        }

        return { prefecture: 'Unknown', originalAddress, confidence: 0.0 };
    }

    /**
     * Strategy 4: Postal code pattern analysis
     */
    private static parseByPostalCodePattern(
        normalizedAddress: string,
        originalAddress: string,
    ): ParsedJapaneseAddress {
        // Japanese postal codes: 〒123-4567 or 123-4567
        const postalCodeMatch = normalizedAddress.match(/〒?(\d{3})-?(\d{4})/);
        if (postalCodeMatch) {
            const postalCode = postalCodeMatch[1] + postalCodeMatch[2];
            const prefecture = JapaneseAddressParserUtil.prefectureByPostalCode(postalCode);
            if (prefecture !== 'Unknown') {
                return {
                    prefecture,
                    originalAddress,
                    confidence: 0.6,
                };
            }
        }

        return { prefecture: 'Unknown', originalAddress, confidence: 0.0 };
    }

    /**
     * Strategy 5: Best effort fallback
     */
    private static parseByBestEffort(
        normalizedAddress: string,
        originalAddress: string,
    ): ParsedJapaneseAddress {
        // If address contains "japan" but we couldn't identify prefecture, default to Tokyo
        if (normalizedAddress.includes('japan') || normalizedAddress.includes('日本')) {
            return {
                prefecture: 'Tokyo',
                originalAddress,
                confidence: 0.3,
            };
        }

        return {
            prefecture: 'Unknown',
            originalAddress,
            confidence: 0.0,
        };
    }

    /**
     * Extract city from address
     */
    private static extractCity(address: string): string | undefined {
        const cityPatterns = [/(\w+)\s*city/i, /(\w+)市/, /(\w+)\s*shi/i];

        for (const pattern of cityPatterns) {
            const match = address.match(pattern);
            if (match) {
                return JapaneseAddressParserUtil.capitalizeFirst(match[1]);
            }
        }

        return undefined;
    }

    /**
     * Extract ward from address
     */
    private static extractWard(address: string): string | undefined {
        const wardPatterns = [/(\w+)\s*ward/i, /(\w+)区/, /(\w+)\s*ku/i];

        for (const pattern of wardPatterns) {
            const match = address.match(pattern);
            if (match) {
                return JapaneseAddressParserUtil.capitalizeFirst(match[1]);
            }
        }

        return undefined;
    }

    /**
     * Simple postal code to prefecture mapping (basic ranges)
     */
    private static prefectureByPostalCode(postalCode: string): string {
        const code = parseInt(postalCode.substring(0, 3));

        if (code >= 100 && code <= 199) return 'Tokyo';
        if (code >= 200 && code <= 259) return 'Kanagawa';
        if (code >= 260 && code <= 299) return 'Chiba';
        if (code >= 330 && code <= 369) return 'Saitama';
        if (code >= 400 && code <= 409) return 'Yamanashi';
        if (code >= 410 && code <= 436) return 'Shizuoka';
        if (code >= 450 && code <= 499) return 'Aichi';
        if (code >= 500 && code <= 509) return 'Gifu';
        if (code >= 510 && code <= 519) return 'Mie';
        if (code >= 520 && code <= 529) return 'Shiga';
        if (code >= 600 && code <= 630) return 'Kyoto';
        if (code >= 540 && code <= 599) return 'Osaka';
        if (code >= 630 && code <= 639) return 'Nara';
        if (code >= 640 && code <= 649) return 'Wakayama';
        if (code >= 650 && code <= 679) return 'Hyogo';
        if (code >= 870 && code <= 879) return 'Oita';

        return 'Unknown';
    }

    /**
     * Utility function to capitalize first letter
     */
    private static capitalizeFirst(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    /**
     * Batch parse multiple addresses
     */
    public static parseMultipleAddresses(addresses: string[]): ParsedJapaneseAddress[] {
        return addresses.map((address) => JapaneseAddressParserUtil.parseAddress(address));
    }

    /**
     * Get all supported prefectures
     */
    public static getSupportedPrefectures(): string[] {
        return Array.from(new Set(Object.values(PREFECTURE_MAPPING))).sort();
    }
}

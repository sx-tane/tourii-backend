export class ValidateUtil {
    /**
     * Validates and cleans string content
     * @param value - The value to validate and clean
     * @param maxLength - The maximum length of the string
     * @param fallback - The fallback value if the string is invalid
     * @returns The validated and cleaned string
     */
    static validateAndCleanString(value: any, maxLength: number, fallback: string): string {
        if (typeof value !== 'string' || !value.trim()) {
            return fallback;
        }

        const cleaned = value.trim();
        return cleaned.length > maxLength ? `${cleaned.substring(0, maxLength - 3)}...` : cleaned;
    }

    /**
     * Safely converts a string to a string
     * @param value - The value to convert
     * @returns The converted string
     */
    static safeString(value: string | undefined | null): string {
        return value ?? '';
    }
}

/**
 * Security utility functions for preventing timing attacks
 */

/**
 * Constant-time string comparison to prevent timing attacks
 * @param a First string to compare
 * @param b Second string to compare
 * @returns true if strings are equal, false otherwise
 */
export function constantTimeStringCompare(a: string, b: string): boolean {
    // If lengths are different, still compare to avoid timing leaks
    const maxLength = Math.max(a.length, b.length);
    let result = a.length === b.length ? 0 : 1;

    for (let i = 0; i < maxLength; i++) {
        const charA = i < a.length ? a.charCodeAt(i) : 0;
        const charB = i < b.length ? b.charCodeAt(i) : 0;
        result |= charA ^ charB;
    }

    return result === 0;
}

/**
 * Add random delay to prevent timing analysis
 * @param minMs Minimum delay in milliseconds
 * @param maxMs Maximum delay in milliseconds
 */
export function randomDelay(minMs: number = 10, maxMs: number = 50): Promise<void> {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Utility function to split a string into an array based on commas.
 * Trims whitespace and filters out empty values.
 * @param str - The input string to split.
 * @returns An array of trimmed, non-empty strings.
 */
export function splitToArray(str?: string | null): string[] {
    if (!str) return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
}

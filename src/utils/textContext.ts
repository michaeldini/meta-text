// Purpose: Build a minimal context by returning only the first sentence of the provided text.

/**
 * Build a minimal context by returning the first sentence from the full text.
 * Note: The `word` parameter is intentionally ignored for this simplified strategy.
 */
export function buildContextSlice(_word: string, fullTextContext: string): string {
    const safeText = (fullTextContext ?? '').trim();
    if (!safeText) return '';

    // Find the earliest sentence boundary among '.', '?', '!', or a newline.
    const boundaries = ['.', '?', '!', '\n'];
    let boundaryIndex = -1;
    for (const b of boundaries) {
        const i = safeText.indexOf(b);
        if (i !== -1 && (boundaryIndex === -1 || i < boundaryIndex)) {
            boundaryIndex = i;
        }
    }

    // If no boundary is found, return the whole text; otherwise include the boundary char.
    const end = boundaryIndex === -1 ? safeText.length : boundaryIndex + 1;
    return safeText.slice(0, end).trim();
}

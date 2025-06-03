// src/services/dictionaryService.js
// Service for dictionary API calls
import { handleApiResponse } from '../utils/api';

/**
 * Looks up the definition of a word using the backend API.
 * @param {string} word - The word to look up.
 * @returns {Promise<{word: string, definition: string}>}
 */
export async function lookupWord(word) {
    const res = await fetch(`/api/dictionary/lookup?word=${encodeURIComponent(word)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    return handleApiResponse(res, 'Failed to look up word definition');
}

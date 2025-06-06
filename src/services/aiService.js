// src/services/aiService.js
// Service for AI-related API calls
import { handleApiResponse } from '../utils/api';

/**
 * Fetches a word definition in context from the backend AI endpoint.
 * @param {string} word - The word to define.
 * @param {string} context - The context (surrounding text).
 * @returns {Promise<{definition: string, definitionWithContext: string}>}
 */
export async function fetchDefinitionInContext(word, context) {
    const res = await fetch('/api/generate-definition-in-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, context }),
    });
    return handleApiResponse(res, 'Failed to fetch definition in context');
}

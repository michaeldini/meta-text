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

/**
 * Generates an AI image from a prompt using the backend endpoint.
 * @param {string} prompt - The prompt for image generation.
 * @param {number} chunkId - The chunk id to associate the image with.
 * @returns {Promise<{id: number, prompt: string, path: string, chunk_id: number}>}
 */
export async function generateAiImage(prompt, chunkId) {
    const formData = new FormData();
    formData.append('prompt', prompt);
    if (chunkId) formData.append('chunk_id', chunkId);
    const res = await fetch('/api/generate-image', {
        method: 'POST',
        body: formData,
    });
    return handleApiResponse(res, 'Failed to generate image');
}

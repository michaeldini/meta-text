import { handleApiResponse } from '../utils/api';

export async function fetchDefinitionInContext(word: string, context: string, meta_text_id: number): Promise<{ definition: string, definitionWithContext: string }> {
    const res = await fetch('/api/generate-definition-in-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, context, meta_text_id }),
    });
    return handleApiResponse(res, 'Failed to fetch definition in context');
}

export async function generateAiImage(prompt: string, chunkId: number): Promise<{ id: number, prompt: string, path: string, chunk_id: number }> {
    const formData = new FormData();
    formData.append('prompt', prompt);
    if (chunkId) formData.append('chunk_id', chunkId.toString());
    const res = await fetch('/api/generate-image', {
        method: 'POST',
        body: formData,
    });
    return handleApiResponse(res, 'Failed to generate image');
}


/**
 * Generates an AI comparison summary between chunk text, summary, and notes.
 * @param {number} chunkId - The chunk id to compare.
 * @returns {Promise<{result: string}>}
 */
export async function generateChunkNoteSummaryTextComparison(chunkId: number): Promise<{ result: string }> {
    const res = await fetch(`/api/generate-chunk-note-summary-text-comparison/${chunkId}`);
    const data = await handleApiResponse<{ result: string }>(res, 'Failed to generate AI comparison summary');
    return data || { result: '' };
}

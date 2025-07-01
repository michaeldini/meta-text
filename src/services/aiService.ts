import { handleApiResponse, apiPost, apiGet } from '../utils/api';

export interface ExplanationRequest {
    words?: string;
    context?: string;
    chunkId?: number | null;
    metaTextId?: number | null;

}
export interface ExplanationResponse {
    explanation: string;
    explanationWithContext: string;
}

/**
 * Calls the /api/explain endpoint to get an explanation for a word, words, or a chunk.
 * @param {ExplanationRequest} params - The request params.
 * @returns {Promise<ExplanationResponse>}
 */
export async function explainWordsOrChunk(params: ExplanationRequest): Promise<ExplanationResponse> {
    return await apiPost('/api/explain', params);
}

export async function fetchDefinitionInContext(word: string, context: string, meta_text_id: number): Promise<{ definition: string, definitionWithContext: string }> {
    return await apiPost('/api/generate-definition-in-context', { word, context, meta_text_id });
}

export async function generateAiImage(prompt: string, chunkId: number): Promise<{ id: number, prompt: string, path: string, chunk_id: number }> {
    const formData = new FormData();
    formData.append('prompt', prompt);
    if (chunkId) formData.append('chunk_id', chunkId.toString());
    return await apiPost('/api/generate-image', formData);
}


/**
 * Generates an AI comparison summary between chunk text, summary, and notes.
 * @param {number} chunkId - The chunk id to compare.
 * @returns {Promise<{result: string}>}
 */
export async function generateChunkNoteSummaryTextComparison(chunkId: number): Promise<{ result: string }> {
    const data = await apiGet<{ result: string }>(`/api/generate-chunk-note-summary-text-comparison/${chunkId}`);
    return data || { result: '' };
}

/**
 * Generates and saves a detailed AI explanation for a chunk's text.
 * @param {number} chunkId - The chunk id to explain.
 * @returns {Promise<{explanation: string}>}
 */
export async function generateChunkExplanation(chunkId: number): Promise<{ explanation: string }> {
    const data = await apiGet<{ explanation: string }>(`/api/generate-chunk-explanation/${chunkId}`);
    return data || { explanation: '' };
}

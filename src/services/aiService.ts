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

export interface SourceDocInfoRequest {
    id: number;
    prompt: string;
}

export interface SourceDocInfoAIResult {
    summary: string;
    characters: string[];
    locations: string[];
    themes: string[];
    symbols: string[];
}

export interface SourceDocInfoResponse {
    result: SourceDocInfoAIResult;
}

export async function generateChunkNoteSummaryTextComparison(chunkId: number): Promise<{ result: string }> {
    return await apiGet<{ result: string }>(`/api/generate-chunk-note-summary-text-comparison/${chunkId}`);
}

export async function generateSourceDocInfo(request: SourceDocInfoRequest): Promise<SourceDocInfoResponse> {
    const data = await apiPost<SourceDocInfoResponse>('/api/source-doc-info', request);
    if (!data || Object.keys(data).length === 0) {
        throw new Error('No data returned from source doc info endpoint');
    }
    return data;
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
export async function generateChunkComparison(chunkId: number): Promise<{ result: string }> {
    return await apiGet(`/api/generate-chunk-comparison/${chunkId}`);
}


/**
 * Calls the /api/explain endpoint to get an explanation for a word, words, or a chunk.
 * @param {ExplanationRequest} params - The request params.
 * @returns {Promise<ExplanationResponse>}
*/
export async function explainWordsOrChunk(params: ExplanationRequest): Promise<ExplanationResponse> {
    return await apiPost('/api/explain', params);
}
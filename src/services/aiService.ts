/**
 * AI Service Module
 * 
 * This module provides functions for interacting with AI-powered endpoints including:
 * - Text explanation and analysis (words, chunks, context)
 * - Source document analysis (summaries, characters, themes, etc.)
 * - AI image generation from prompts
 * - Chunk comparison and note summary generation
 * 
 * All functions return properly typed responses and handle API communication
 * through the centralized API utilities.
 */

import { apiPost, apiGet } from '../utils/api';


// ExplanationRequest defines the parameters for requesting an explanation.
// the fields are optional because the request can be made with multiple combinations
// of parameters, e.g. just words, or words with context, or chunkId, etc.
export interface ExplanationRequest {
    words?: string;
    context?: string;
    chunkId?: number | null;
    metaTextId?: number | null;

}

// ExplanationResponse defines the structure of the response from the explanation endpoint.
export interface ExplanationResponse {
    explanation: string;
    explanationWithContext: string;
}

// SourceDocInfoRequest defines the request parameters for generating source document info.
export interface SourceDocInfoRequest {
    id: number;
    prompt: string;
}

// SourceDocInfoAIResult defines the structure of the AI-generated result for source document info.
// TODO - consider removing endpoint and use sourceDoc endpoint instead
export interface SourceDocInfoAIResult {
    summary: string;
    characters: string[];
    locations: string[];
    themes: string[];
    symbols: string[];
}

// TODO - consider removing endpoint and use sourceDoc endpoint instead
export interface SourceDocInfoResponse {
    result: SourceDocInfoAIResult;
}

export async function generateChunkNoteSummaryTextComparison(chunkId: number): Promise<{ result: string }> {
    return await apiGet<{ result: string }>(`/api/generate-chunk-note-summary-text-comparison/${chunkId}`);
}

export async function generateSourceDocInfo(sourceDocumentId: number): Promise<SourceDocInfoResponse> {
    const data = await apiPost<SourceDocInfoResponse>(`/api/source-doc-info/${sourceDocumentId}`);
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

export async function generateChunkComparison(chunkId: number): Promise<{ result: string }> {
    return await apiGet(`/api/generate-chunk-comparison/${chunkId}`);
}


export async function explainWordsOrChunk(params: ExplanationRequest): Promise<ExplanationResponse> {
    return await apiPost('/api/explain', params);
}
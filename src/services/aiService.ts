
import { api } from '../utils/ky';

export interface ExplanationRequest {
    words?: string;
    context?: string;
    chunk_id?: number | null;
    metatext_id?: number | null;

}

// ExplanationResponse defines the structure of the response from the explanation endpoint.
export interface ExplanationResponse {
    explanation: string;
    explanation_in_context: string;
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

export interface SourceDocInfoResponse {
    result: SourceDocInfoAIResult;
}

export async function generateEvaluation(chunkId: number): Promise<{ result: string }> {
    return api.get(`evaluation/${chunkId}`).json<{ result: string }>();
}

export async function generateSourceDocInfo(sourceDocumentId: number): Promise<SourceDocInfoResponse> {
    const data = await api.post(`source-doc-info/${sourceDocumentId}`).json<SourceDocInfoResponse>();
    if (!data || Object.keys(data).length === 0) {
        throw new Error('No data returned from source doc info endpoint');
    }
    return data;
}

export async function generateAiImage(prompt: string, chunkId: number): Promise<{ id: number, prompt: string, path: string, chunk_id: number }> {
    const formData = new FormData();
    formData.append('prompt', prompt);
    if (chunkId) formData.append('chunk_id', chunkId.toString());
    return api.post('generate-image', { body: formData }).json<{ id: number, prompt: string, path: string, chunk_id: number }>();
}

export async function generateChunkEvaluation(chunkId: number): Promise<{ result: string }> {
    return api.get(`generate-evaluation/${chunkId}`).json<{ result: string }>();
}

export async function explainWordsOrChunk(params: ExplanationRequest): Promise<ExplanationResponse> {
    return api.post('explain', { json: params }).json<ExplanationResponse>();
}
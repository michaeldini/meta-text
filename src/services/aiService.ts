
import { api } from '../utils/ky';

export interface EvaluationResponse {
    evaluation_text: string;
}

export async function generateEvaluation(chunkId: number): Promise<EvaluationResponse> {
    return api.get(`evaluation/${chunkId}`).json<EvaluationResponse>();
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

export async function generateSourceDocInfo(sourceDocumentId: number): Promise<SourceDocInfoResponse> {
    const data = await api.post(`source-doc-info/${sourceDocumentId}`).json<SourceDocInfoResponse>();
    if (!data || Object.keys(data).length === 0) {
        throw new Error('No data returned from source doc info endpoint');
    }
    return data;
}

export interface GenerateImageResponse {
    id: number;
    prompt: string;
    path: string;
    chunk_id: number;
}

export async function generateImage(prompt: string, chunkId: number): Promise<GenerateImageResponse> {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('chunk_id', chunkId.toString());
    // Image generation (OpenAI) can exceed ky's default 10s timeout; extend/disable it.
    // We choose a 60s timeout to cover slower generations while still preventing infinite hangs.
    return api.post('generate-image', { body: formData, timeout: 60000 }).json<GenerateImageResponse>();
}

export async function generateChunkEvaluation(chunkId: number): Promise<{ result: string }> {
    return api.get(`generate-evaluation/${chunkId}`).json<{ result: string }>();
}


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

export async function explainWordsOrChunk(params: ExplanationRequest): Promise<ExplanationResponse> {
    return api.post('explain', { json: params }).json<ExplanationResponse>();
}
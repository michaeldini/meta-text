// src/services/sourceDocInfoService.ts
import { handleApiResponse, apiPost } from '../utils/api';
import type { SourceDocument } from '../types/sourceDocument';

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

export async function generateSourceDocInfo(request: SourceDocInfoRequest): Promise<SourceDocInfoResponse> {
    const data = await apiPost<SourceDocInfoResponse>('/api/source-doc-info', request);
    if (!data || Object.keys(data).length === 0) {
        throw new Error('No data returned from source doc info endpoint');
    }
    return data;
}

// src/services/sourceDocInfoService.ts
import { handleApiResponse } from '../utils/api';
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
    const res = await fetch('/api/source-doc-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    const data = await handleApiResponse(res, 'Failed to generate source doc info');
    if (data === true) {
        throw new Error('No data returned from source doc info endpoint');
    }
    return data;
}

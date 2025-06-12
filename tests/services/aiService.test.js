import { describe, it, expect, afterEach, vi } from 'vitest';
import {
    fetchDefinitionInContext,
    generateAiImage,
    generateChunkNoteSummaryTextComparison
} from '../../src/services/aiService';
import { handleApiResponse } from '../../src/utils/api';

vi.mock('../../src/utils/api', () => ({
    handleApiResponse: vi.fn()
}));

globalThis.fetch = vi.fn();

describe('aiService', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('fetchDefinitionInContext calls fetch and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ definition: 'def', definitionWithContext: 'def ctx' });
        const result = await fetchDefinitionInContext('word', 'context', 42);
        expect(fetch).toHaveBeenCalledWith('/api/generate-definition-in-context', expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word: 'word', context: 'context', meta_text_id: 42 })
        }));
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Failed to fetch definition in context');
        expect(result).toEqual({ definition: 'def', definitionWithContext: 'def ctx' });
    });

    it('generateAiImage calls fetch with FormData and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ id: 1, prompt: 'prompt', path: '/img.png', chunk_id: 2 });
        const result = await generateAiImage('prompt', 2);
        expect(fetch).toHaveBeenCalledWith('/api/generate-image', expect.objectContaining({
            method: 'POST',
            body: expect.any(FormData)
        }));
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Failed to generate image');
        expect(result).toEqual({ id: 1, prompt: 'prompt', path: '/img.png', chunk_id: 2 });
    });

    it('generateChunkNoteSummaryTextComparison calls fetch and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ result: 'comparison' });
        const result = await generateChunkNoteSummaryTextComparison(5);
        expect(fetch).toHaveBeenCalledWith('/api/generate-chunk-note-summary-text-comparison/5');
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Failed to generate AI comparison summary');
        expect(result).toEqual({ result: 'comparison' });
    });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Define mock in a hoisted scope so it can be referenced inside vi.mock factory
const { apiMock } = vi.hoisted(() => ({
    apiMock: { get: vi.fn(), post: vi.fn() }
}));
vi.mock('../../utils/ky', () => ({ api: apiMock }));

import * as aiService from '../aiService';

beforeEach(() => {
    apiMock.get.mockReset();
    apiMock.post.mockReset();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('aiService', () => {
    it('generateEvaluation returns parsed data and calls correct endpoint', async () => {
        apiMock.get.mockReturnValue({ json: async () => ({ evaluation_text: 'good' }) });

        const res = await aiService.generateEvaluation(123);

        expect(apiMock.get).toHaveBeenCalledWith('evaluation/123');
        expect(res).toEqual({ evaluation_text: 'good' });
    });

    it('generateSourceDocInfo throws when endpoint returns empty object', async () => {
        apiMock.post.mockReturnValue({ json: async () => ({}) });

        await expect(aiService.generateSourceDocInfo(5)).rejects.toThrow('No data returned');
        expect(apiMock.post).toHaveBeenCalledWith('source-doc-info/5');
    });

    it('generateSourceDocInfo returns data when present', async () => {
        const data = {
            result: {
                summary: 'S',
                characters: [],
                locations: [],
                themes: [],
                symbols: [],
            },
        };
        apiMock.post.mockReturnValue({ json: async () => data });

        const res = await aiService.generateSourceDocInfo(7);

        expect(apiMock.post).toHaveBeenCalledWith('source-doc-info/7');
        expect(res).toEqual(data);
    });

    it('generateImage sends FormData and uses extended timeout', async () => {
        const expected = { id: 1, prompt: 'p', path: '/x', chunk_id: 2 };
        apiMock.post.mockReturnValue({ json: async () => expected });

        const res = await aiService.generateImage('hello', 42);

        expect(apiMock.post).toHaveBeenCalled();
        const [url, options] = apiMock.post.mock.calls[0];
        expect(url).toBe('generate-image');
        expect(options).toBeDefined();
        expect(options.timeout).toBe(60000);
        // body should be a FormData with our values
        const fd = options.body as FormData;
        expect(fd.get('prompt')).toBe('hello');
        expect(fd.get('chunk_id')).toBe('42');
        expect(res).toEqual(expected);
    });

    it('generateChunkEvaluation returns result', async () => {
        apiMock.get.mockReturnValue({ json: async () => ({ result: 'ok' }) });

        const res = await aiService.generateChunkEvaluation(9);

        expect(apiMock.get).toHaveBeenCalledWith('generate-evaluation/9');
        expect(res).toEqual({ result: 'ok' });
    });

    it('explainWordsOrChunk posts params and returns explanation', async () => {
        const payload = { explanation: 'E', explanation_in_context: 'EC' };
        apiMock.post.mockReturnValue({ json: async () => payload });

        const params = { words: 'love', context: 'line 1', chunk_id: null, metatext_id: null };
        const res = await aiService.explainWordsOrChunk(params);

        expect(apiMock.post).toHaveBeenCalledWith('explain', { json: params, timeout: 20000 });
        expect(res).toEqual(payload);
    });

    it('generateRewrite calls endpoint with encoded style title and timeout', async () => {
        const resp = { id: 2, title: 'St', rewrite_text: 'R', chunk_id: 11 };
        apiMock.get.mockReturnValue({ json: async () => resp });

        const res = await aiService.generateRewrite(11, 'My Style');

        const encoded = encodeURIComponent('My Style');
        expect(apiMock.get).toHaveBeenCalledWith(`generate-rewrite/11?style_title=${encoded}`, { timeout: 20000 });
        expect(res).toEqual(resp);
    });
});

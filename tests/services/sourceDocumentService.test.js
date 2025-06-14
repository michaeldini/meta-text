import {
    fetchSourceDocuments,
    fetchSourceDocument,
    createSourceDocument,
    deleteSourceDocument,
    generateSourceDocInfo,
} from '../../src/services/sourceDocumentService';

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { handleApiResponse } from '../../src/utils/api';

vi.mock('../../src/utils/api', () => ({
    handleApiResponse: vi.fn(),
}));

describe('sourceDocumentService', () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn();
        handleApiResponse.mockReset();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('fetchSourceDocuments returns array from API', async () => {
        const docs = [{ id: 1, title: 'A' }];
        fetch.mockResolvedValueOnce('res');
        handleApiResponse.mockResolvedValueOnce(docs);
        const result = await fetchSourceDocuments();
        expect(fetch).toHaveBeenCalledWith('/api/source-documents');
        expect(result).toEqual(docs);
    });

    it('fetchSourceDocuments returns [] if not array', async () => {
        fetch.mockResolvedValueOnce('res');
        handleApiResponse.mockResolvedValueOnce({});
        const result = await fetchSourceDocuments();
        expect(result).toEqual([]);
    });

    it('fetchSourceDocument fetches by id', async () => {
        fetch.mockResolvedValueOnce('res');
        handleApiResponse.mockResolvedValueOnce({ id: 1 });
        const result = await fetchSourceDocument('abc');
        expect(fetch).toHaveBeenCalledWith('/api/source-documents/abc');
        expect(result).toEqual({ id: 1 });
    });

    it('createSourceDocument posts form data', async () => {
        fetch.mockResolvedValueOnce('res');
        handleApiResponse.mockResolvedValueOnce({ id: 2 });
        const file = new File(['test'], 'test.txt', { type: 'text/plain' });
        const result = await createSourceDocument('title', file);
        expect(fetch).toHaveBeenCalledWith('/api/source-documents', expect.objectContaining({ method: 'POST' }));
        expect(result).toEqual({ id: 2 });
    });

    it('deleteSourceDocument calls DELETE', async () => {
        fetch.mockResolvedValueOnce('res');
        handleApiResponse.mockResolvedValueOnce({ success: true });
        const result = await deleteSourceDocument('id1');
        expect(fetch).toHaveBeenCalledWith('/api/source-documents/id1', { method: 'DELETE' });
        expect(result).toEqual({ success: true });
    });

    it('generateSourceDocInfo posts prompt and id', async () => {
        fetch.mockResolvedValueOnce('res');
        handleApiResponse.mockResolvedValueOnce({ result: 'info' });
        const result = await generateSourceDocInfo('id2', 'prompt text');
        expect(fetch).toHaveBeenCalledWith('/api/source-doc-info', expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: 'prompt text', id: 'id2' }),
        }));
        expect(result).toBe('info');
    });
});

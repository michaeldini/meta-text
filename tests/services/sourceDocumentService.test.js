import { describe, it, expect, afterEach, vi } from 'vitest';
import {
    fetchSourceDocuments,
    fetchSourceDocument,
    createSourceDocument,
    deleteSourceDocument,
    generateSourceDocInfo
} from '../../src/services/sourceDocumentService';
import { handleApiResponse } from '../../src/utils/api';

vi.mock('../../src/utils/api', () => ({
    handleApiResponse: vi.fn()
}));

globalThis.fetch = vi.fn();

describe('sourceDocumentService', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('fetchSourceDocuments calls fetch and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce([{ id: 1, title: 'Doc' }]);
        const result = await fetchSourceDocuments();
        expect(fetch).toHaveBeenCalledWith('/api/source-documents');
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Failed to fetch source documents');
        expect(result).toEqual([{ id: 1, title: 'Doc' }]);
    });

    it('fetchSourceDocument calls fetch and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ id: 2, title: 'Doc2' });
        const result = await fetchSourceDocument('2');
        expect(fetch).toHaveBeenCalledWith('/api/source-documents/2');
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Failed to fetch document');
        expect(result).toEqual({ id: 2, title: 'Doc2' });
    });

    it('createSourceDocument calls fetch with FormData and handleApiResponse', async () => {
        const mockFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ id: 3, title: 'Uploaded Doc' });
        const result = await createSourceDocument('Uploaded Doc', mockFile);
        expect(fetch).toHaveBeenCalledWith('/api/source-documents', expect.objectContaining({
            method: 'POST',
            body: expect.any(FormData)
        }));
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Upload failed.');
        expect(result).toEqual({ id: 3, title: 'Uploaded Doc' });
    });

    it('deleteSourceDocument calls fetch with DELETE and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ success: true });
        const result = await deleteSourceDocument('4');
        expect(fetch).toHaveBeenCalledWith('/api/source-documents/4', { method: 'DELETE' });
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Failed to delete source document');
        expect(result).toEqual({ success: true });
    });

    it('generateSourceDocInfo calls fetch with POST and returns result', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ result: 'summary text' });
        const result = await generateSourceDocInfo(5, 'Prompt text');
        expect(fetch).toHaveBeenCalledWith('/api/source-doc-info', expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: 'Prompt text', id: 5 })
        }));
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Summary failed');
        expect(result).toBe('summary text');
    });
});

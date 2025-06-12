// tests for metaTextService.js
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
    fetchMetaTexts,
    fetchMetaText,
    createMetaText,
    updateMetaText,
    deleteMetaText
} from '../../src/services/metaTextService';
import { handleApiResponse } from '../../src/utils/api';

vi.mock('../../src/utils/api', () => ({
    handleApiResponse: vi.fn()
}));

globalThis.fetch = vi.fn();

describe('metaTextService', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('fetchMetaTexts calls fetch and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce([{ id: 1 }]);
        const result = await fetchMetaTexts();
        expect(fetch).toHaveBeenCalledWith('/api/meta-text');
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Failed to fetch meta texts');
        expect(result).toEqual([{ id: 1 }]);
    });

    it('fetchMetaText calls fetch and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ id: 1 });
        const result = await fetchMetaText(1);
        expect(fetch).toHaveBeenCalledWith('/api/meta-text/1');
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Failed to fetch meta text');
        expect(result).toEqual({ id: 1 });
    });

    it('createMetaText calls fetch with POST and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ id: 2 });
        const result = await createMetaText(5, 'Test Title');
        expect(fetch).toHaveBeenCalledWith('/api/meta-text', expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sourceDocId: 5, title: 'Test Title' })
        }));
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Create failed.');
        expect(result).toEqual({ id: 2 });
    });

    it('updateMetaText calls fetch with PUT and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ id: 3 });
        const result = await updateMetaText(7, { foo: 'bar' });
        expect(fetch).toHaveBeenCalledWith('/api/meta-text/7', expect.objectContaining({
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ foo: 'bar' })
        }));
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Failed to update meta-text');
        expect(result).toEqual({ id: 3 });
    });

    it('deleteMetaText calls fetch with DELETE and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ success: true });
        const result = await deleteMetaText(9);
        expect(fetch).toHaveBeenCalledWith('/api/meta-text/9', { method: 'DELETE' });
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Failed to delete meta-text');
        expect(result).toEqual({ success: true });
    });
});

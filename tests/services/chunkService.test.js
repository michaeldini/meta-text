import { describe, it, expect, afterEach, vi } from 'vitest';
import {
    fetchChunks,
    splitChunk,
    combineChunks,
    updateChunk,
    fetchChunk
} from '../../src/services/chunkService';
import handleApiResponse from '../../src/utils/api';

vi.mock('../../src/utils/api', () => ({
    __esModule: true,
    default: vi.fn()
}));

globalThis.fetch = vi.fn();

describe('chunkService', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('fetchChunks calls fetch and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce([{ id: 1, text: 'chunk' }]);
        const result = await fetchChunks(42);
        expect(fetch).toHaveBeenCalledWith('/api/chunks/all/42');
        expect(handleApiResponse).toHaveBeenCalledWith('response');
        expect(result).toEqual([{ id: 1, text: 'chunk' }]);
    });

    it('splitChunk calls fetch with POST and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ id: 2, text: 'split' });
        const result = await splitChunk(5, 3);
        expect(fetch).toHaveBeenCalledWith('/api/chunk/5/split?word_index=3', { method: 'POST' });
        expect(handleApiResponse).toHaveBeenCalledWith('response');
        expect(result).toEqual({ id: 2, text: 'split' });
    });

    it('combineChunks calls fetch with POST and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ id: 3, text: 'combined' });
        const result = await combineChunks(7, 8);
        expect(fetch).toHaveBeenCalledWith('/api/chunk/combine?first_chunk_id=7&second_chunk_id=8', { method: 'POST' });
        expect(handleApiResponse).toHaveBeenCalledWith('response');
        expect(result).toEqual({ id: 3, text: 'combined' });
    });

    it('updateChunk calls fetch with PUT and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ id: 4, text: 'updated' });
        const chunkData = { text: 'new text', summary: 'sum', notes: 'notes' };
        const result = await updateChunk(9, chunkData);
        expect(fetch).toHaveBeenCalledWith('/api/chunk/9', expect.objectContaining({
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chunkData)
        }));
        expect(handleApiResponse).toHaveBeenCalledWith('response');
        expect(result).toEqual({ id: 4, text: 'updated' });
    });

    it('fetchChunk calls fetch and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ id: 5, text: 'single chunk' });
        const result = await fetchChunk(10);
        expect(fetch).toHaveBeenCalledWith('/api/chunk/10');
        expect(handleApiResponse).toHaveBeenCalledWith('response');
        expect(result).toEqual({ id: 5, text: 'single chunk' });
    });
});

import { describe, it, expect, afterEach, vi } from 'vitest';
import { fetchWordlist, fetchChunkSummariesNotes } from '../../src/services/reviewService';
import handleApiResponse from '../../src/utils/api';
import logger from '../../src/utils/logger';
import { fetchChunks } from '../../src/services/chunkService';

vi.mock('../../src/utils/api', () => ({
    __esModule: true,
    default: vi.fn()
}));
vi.mock('../../src/utils/logger', () => ({
    __esModule: true,
    default: {
        info: vi.fn(),
        error: vi.fn()
    }
}));
vi.mock('../../src/services/chunkService', () => ({
    fetchChunks: vi.fn()
}));

globalThis.fetch = vi.fn();

describe('reviewService', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('fetchWordlist calls fetch, handleApiResponse, and logs info', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce([{ id: 1, word: 'foo' }]);
        const result = await fetchWordlist(123);
        expect(fetch).toHaveBeenCalledWith('/api/metatext/123/wordlist');
        expect(handleApiResponse).toHaveBeenCalledWith('response');
        expect(logger.info).toHaveBeenCalledWith('Fetched wordlist', [{ id: 1, word: 'foo' }]);
        expect(result).toEqual([{ id: 1, word: 'foo' }]);
    });

    it('fetchWordlist logs error and throws on failure', async () => {
        const error = new Error('fail');
        fetch.mockRejectedValueOnce(error);
        await expect(fetchWordlist(456)).rejects.toThrow('fail');
        expect(logger.error).toHaveBeenCalledWith('Failed to fetch wordlist', error);
    });

    it('fetchChunkSummariesNotes is a re-export of fetchChunks', async () => {
        fetchChunks.mockResolvedValueOnce(['chunk1', 'chunk2']);
        const result = await fetchChunkSummariesNotes('metaId');
        expect(fetchChunks).toHaveBeenCalledWith('metaId');
        expect(result).toEqual(['chunk1', 'chunk2']);
    });
});

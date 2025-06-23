import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useMetaTextDetailStore } from './metaTextDetailStore';
import { useChunkStore } from './chunkStore';
import * as metaTextService from '../services/metaTextService';
import * as chunkService from '../services/chunkService';

vi.mock('../services/metaTextService', () => ({
    fetchMetaText: vi.fn(),
}));
vi.mock('../services/chunkService', () => ({
    fetchChunks: vi.fn(),
    updateChunk: vi.fn(),
    splitChunk: vi.fn(),
    combineChunks: vi.fn(),
}));

describe('MetaTextDetailStore integration', () => {
    const mockMetaText = { id: 1, source_document_id: 10 };
    const mockChunks = [
        { id: 1, text: 'A', position: 0, notes: '', summary: '', comparison: '', meta_text_id: 1, ai_images: [] },
        { id: 2, text: 'B', position: 1, notes: '', summary: '', comparison: '', meta_text_id: 1, ai_images: [] },
    ];

    beforeEach(() => {
        useMetaTextDetailStore.getState().clearState();
        useChunkStore.getState().resetChunkState();
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('fetches metaText and chunks, restores last active chunk from localStorage', async () => {
        vi.mocked(metaTextService.fetchMetaText).mockResolvedValue(mockMetaText);
        vi.mocked(chunkService.fetchChunks).mockResolvedValue(mockChunks);
        // Simulate last active chunk in localStorage
        localStorage.setItem('lastActiveChunk_1', '2');

        await useMetaTextDetailStore.getState().fetchMetaTextDetail('1');
        await useChunkStore.getState().fetchChunks(1);

        const chunkState = useChunkStore.getState();
        expect(chunkState.activeChunkId).toBe(2);
    });

    it('sets first chunk active if no localStorage entry', async () => {
        vi.mocked(metaTextService.fetchMetaText).mockResolvedValue(mockMetaText);
        vi.mocked(chunkService.fetchChunks).mockResolvedValue(mockChunks);

        await useMetaTextDetailStore.getState().fetchMetaTextDetail('1');
        await useChunkStore.getState().fetchChunks(1);

        const chunkState = useChunkStore.getState();
        expect(chunkState.activeChunkId).toBe(1);
    });

    it('updates localStorage when active chunk changes', async () => {
        vi.mocked(metaTextService.fetchMetaText).mockResolvedValue(mockMetaText);
        vi.mocked(chunkService.fetchChunks).mockResolvedValue(mockChunks);

        await useMetaTextDetailStore.getState().fetchMetaTextDetail('1');
        await useChunkStore.getState().fetchChunks(1);
        useChunkStore.getState().setActiveChunk(2);
        expect(localStorage.getItem('lastActiveChunk_1')).toBe('2');
    });
});

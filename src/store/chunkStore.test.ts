import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChunkStore } from './chunkStore';
import * as chunkService from '../services/chunkService';
import type { Chunk } from '../types/chunk';

// Mock the chunk service
vi.mock('../services/chunkService', () => ({
    fetchChunks: vi.fn(),
    updateChunk: vi.fn(),
    splitChunk: vi.fn(),
    combineChunks: vi.fn(),
}));

const mockChunks: Chunk[] = [
    {
        id: 1,
        text: 'First chunk text',
        position: 0,
        notes: '',
        summary: '',
        comparison: '',
        meta_text_id: 1,
        ai_images: [],
    },
    {
        id: 2,
        text: 'Second chunk text',
        position: 1,
        notes: '',
        summary: '',
        comparison: '',
        meta_text_id: 1,
        ai_images: [],
    },
];

describe('ChunkStore', () => {
    beforeEach(() => {
        // Reset the store before each test
        useChunkStore.getState().resetChunkState();
        vi.clearAllMocks();
    });

    describe('fetchChunks', () => {
        it('should auto-select first chunk and enable notes-summary when no chunk is active', async () => {
            // Mock the API call
            vi.mocked(chunkService.fetchChunks).mockResolvedValue(mockChunks);

            const store = useChunkStore.getState();

            // Initially no chunk should be active
            expect(store.activeChunkId).toBeNull();
            expect(store.activeTabs).toEqual([]);

            // Fetch chunks
            await store.fetchChunks(1);

            // After fetching, first chunk should be active with notes-summary tab
            const updatedStore = useChunkStore.getState();
            expect(updatedStore.chunks).toEqual(mockChunks);
            expect(updatedStore.activeChunkId).toBe(1);
            expect(updatedStore.activeTabs).toEqual(['notes-summary']);
            expect(updatedStore.loadingChunks).toBe(false);
        });

        it('should not override existing active chunk', async () => {
            // Mock the API call
            vi.mocked(chunkService.fetchChunks).mockResolvedValue(mockChunks);

            const store = useChunkStore.getState();

            // Set an active chunk first
            store.setActiveChunk(2);
            store.setActiveTabs(['comparison']);

            // Fetch chunks
            await store.fetchChunks(1);

            // Should not override existing selection
            const updatedStore = useChunkStore.getState();
            expect(updatedStore.activeChunkId).toBe(2);
            expect(updatedStore.activeTabs).toEqual(['comparison']);
        });

        it('should handle empty chunks array', async () => {
            // Mock the API call with empty array
            vi.mocked(chunkService.fetchChunks).mockResolvedValue([]);

            const store = useChunkStore.getState();

            // Fetch chunks
            await store.fetchChunks(1);

            // Should not set any active chunk
            const updatedStore = useChunkStore.getState();
            expect(updatedStore.chunks).toEqual([]);
            expect(updatedStore.activeChunkId).toBeNull();
            expect(updatedStore.activeTabs).toEqual([]);
        });

        it('should handle API errors gracefully', async () => {
            // Mock the API call to throw an error
            vi.mocked(chunkService.fetchChunks).mockRejectedValue(new Error('API Error'));

            const store = useChunkStore.getState();

            // Fetch chunks
            await store.fetchChunks(1);

            // Should handle error
            const updatedStore = useChunkStore.getState();
            expect(updatedStore.chunksError).toBe('API Error');
            expect(updatedStore.loadingChunks).toBe(false);
            expect(updatedStore.activeChunkId).toBeNull();
        });
    });

    describe('refetchChunks', () => {
        it('should re-select first chunk if current active chunk no longer exists', async () => {
            // Mock the API call
            vi.mocked(chunkService.fetchChunks).mockResolvedValue(mockChunks);

            const store = useChunkStore.getState();

            // Set an active chunk that won't exist in the new data
            store.setActiveChunk(999);
            store.setActiveTabs(['comparison']);

            // Refetch chunks
            await store.refetchChunks(1);

            // Should select first chunk since old one doesn't exist
            const updatedStore = useChunkStore.getState();
            expect(updatedStore.activeChunkId).toBe(1);
            expect(updatedStore.activeTabs).toEqual(['notes-summary']);
        });

        it('should preserve existing active chunk if it still exists', async () => {
            // Mock the API call
            vi.mocked(chunkService.fetchChunks).mockResolvedValue(mockChunks);

            const store = useChunkStore.getState();

            // Set an active chunk that exists in the new data
            store.setActiveChunk(2);
            store.setActiveTabs(['comparison', 'ai-image']);

            // Refetch chunks
            await store.refetchChunks(1);

            // Should preserve existing selection
            const updatedStore = useChunkStore.getState();
            expect(updatedStore.activeChunkId).toBe(2);
            expect(updatedStore.activeTabs).toEqual(['comparison', 'ai-image']);
        });
    });

    describe('resetChunkState', () => {
        it('should reset all state to initial values', () => {
            const store = useChunkStore.getState();

            // Set some state
            store.setChunks(mockChunks);
            store.setActiveChunk(1);
            store.setActiveTabs(['notes-summary', 'comparison']);

            // Reset state
            store.resetChunkState();

            // Should be back to initial state
            const updatedStore = useChunkStore.getState();
            expect(updatedStore.chunks).toEqual([]);
            expect(updatedStore.activeChunkId).toBeNull();
            expect(updatedStore.activeTabs).toEqual([]);
            expect(updatedStore.loadingChunks).toBe(false);
            expect(updatedStore.chunksError).toBe('');
        });
    });

    describe('localStorage integration', () => {
        const mockChunks = [
            {
                id: 1,
                text: 'First chunk text',
                position: 0,
                notes: '',
                summary: '',
                comparison: '',
                meta_text_id: 1,
                ai_images: [],
            },
            {
                id: 2,
                text: 'Second chunk text',
                position: 1,
                notes: '',
                summary: '',
                comparison: '',
                meta_text_id: 1,
                ai_images: [],
            },
        ];

        beforeEach(() => {
            useChunkStore.getState().resetChunkState();
            vi.clearAllMocks();
            localStorage.clear();
        });

        it('restores last active chunk from localStorage on fetchChunks', async () => {
            localStorage.setItem('lastActiveChunk_1', '2');
            vi.mocked(chunkService.fetchChunks).mockResolvedValue(mockChunks);
            await useChunkStore.getState().fetchChunks(1);
            expect(useChunkStore.getState().activeChunkId).toBe(2);
        });

        it('updates localStorage when setActiveChunk is called', async () => {
            vi.mocked(chunkService.fetchChunks).mockResolvedValue(mockChunks);
            await useChunkStore.getState().fetchChunks(1);
            useChunkStore.getState().setActiveChunk(2);
            expect(localStorage.getItem('lastActiveChunk_1')).toBe('2');
        });
    });
});

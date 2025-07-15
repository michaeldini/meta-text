import { create } from 'zustand';

import { fetchChunks as apiFetchChunks, fetchChunk, updateChunk, splitChunk, combineChunks } from 'services';

import { getErrorMessage } from 'types';
import type { ChunkType, UpdateChunkFieldFn } from 'types';
import { log } from 'utils';
import { useAuthStore } from 'store';

import type { ChunkToolId } from '../features/chunk-tools/toolsRegistry';

type ChunkState = {
    chunks: ChunkType[];
    loadingChunks: boolean;
    chunksError: string;
    activeTabs: ChunkToolId[];
    setActiveTabs: (tabs: ChunkToolId[]) => void;
    fetchChunks: (metatextId: number) => Promise<void>;
    refetchChunk: (chunkId: number) => Promise<void>;
    updateChunkField: UpdateChunkFieldFn;
    handleWordClick: (chunkId: number, chunkIdx: number, wordIdx: number) => Promise<void>;
    mergeChunks: (chunkIdx: number) => Promise<void>;
    setChunks: (chunks: ChunkType[]) => void;
    refetchChunks: (metatextId: number) => Promise<void>;
    resetChunkState: () => void;
};

export const useChunkStore = create<ChunkState>((set, get) => ({
    chunks: [],
    loadingChunks: false,
    chunksError: '',
    activeTabs: [],
    setActiveTabs: (tabs) => set({ activeTabs: tabs }),
    setChunks: async (chunks) => {
        // Ensure chunks are sorted by position ascending
        const sortedChunks = [...chunks].sort((a, b) => a.position - b.position);
        set((state) => ({
            ...state,
            chunks: sortedChunks,
            loadingChunks: false,
        }));
    },
    fetchChunks: async (metatextId) => {
        set({ loadingChunks: true, chunksError: '' });
        try {
            const chunks = await apiFetchChunks(metatextId);
            const sortedChunks = [...chunks].sort((a, b) => a.position - b.position);
            set((state) => ({
                ...state,
                chunks: sortedChunks,
                loadingChunks: false,
            }));
        } catch (e: unknown) {
            set({
                chunksError: getErrorMessage(e, 'Failed to load chunks.'),
                loadingChunks: false,
            });
        }
    },
    refetchChunk: async (chunkId) => {
        try {
            const updatedChunk = await fetchChunk(chunkId);
            set((state) => {
                const idx = state.chunks.findIndex((c) => c.id === chunkId);
                if (idx === -1) return state; // Chunk not found in current list
                const newChunks = [...state.chunks];
                newChunks[idx] = updatedChunk;
                return { ...state, chunks: newChunks };
            });
        } catch (e: unknown) {
            log.error('Failed to refetch chunk:', e);
            // Optionally set an error state or handle silently
        }
    },
    updateChunkField: (chunkId, field, value) => {
        set((state) => {
            const idx = state.chunks.findIndex((c) => c.id === chunkId);
            if (idx === -1) return state;
            const updatedChunk = { ...state.chunks[idx], [field]: value };
            const newChunks = [...state.chunks];
            newChunks[idx] = updatedChunk;
            updateChunk(updatedChunk.id, updatedChunk);
            return { ...state, chunks: newChunks };
        });
    },
    handleWordClick: async (chunkId, chunkIdx, wordIdx) => {
        const { chunks } = get();
        const idx = chunkIdx;
        if (idx === -1 || !chunks[idx] || !chunks[idx].id) return;
        const splitResult = await splitChunk(chunkId, wordIdx + 1); // returns [updatedChunk, newChunk]
        if (!Array.isArray(splitResult) || splitResult.length < 2) return;
        set((state) => {
            const newChunks = [...state.chunks];
            // Replace the old chunk with the updated one
            newChunks[idx] = splitResult[0];
            // Insert the new chunk right after
            newChunks.splice(idx + 1, 0, splitResult[1]);
            return { ...state, chunks: newChunks };
        });
    },
    mergeChunks: async (chunkIdx) => {
        const { chunks } = get();
        const first = chunks[chunkIdx];
        const second = chunks[chunkIdx + 1];
        if (!first || !second) return;
        const combineResult = await combineChunks(first.id, second.id); // returns a single combined Chunk
        if (!combineResult || !combineResult.id) return;
        set((state) => {
            const newChunks = [...state.chunks];
            // Replace the first chunk with the combined one
            newChunks[chunkIdx] = combineResult;
            // Remove the second chunk
            newChunks.splice(chunkIdx + 1, 1);
            return { ...state, chunks: newChunks };
        });
    },
    refetchChunks: async (metatextId) => {
        set({ loadingChunks: true, chunksError: '' });
        try {
            const chunks = await apiFetchChunks(metatextId);
            const sortedChunks = [...chunks].sort((a, b) => a.position - b.position);
            set((state) => ({
                ...state,
                chunks: sortedChunks,
                loadingChunks: false,
            }));
        } catch (e: unknown) {
            set({
                chunksError: getErrorMessage(e, 'Failed to reload chunks.'),
                loadingChunks: false,
            });
        }
    },
    resetChunkState: () => {
        set({
            chunks: [],
            loadingChunks: false,
            chunksError: '',
            activeTabs: [],
        });
    },
}));

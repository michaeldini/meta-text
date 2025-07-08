import { create } from 'zustand';

import { getUserChunkSession, setUserChunkSession, fetchChunks as apiFetchChunks, updateChunk, splitChunk, combineChunks } from 'services';

import { getErrorMessage } from 'types';
import type { ChunkType, UpdateChunkFieldFn } from 'types';
import { log } from 'utils';
import { useAuthStore } from 'store';

import type { ChunkTab } from '../features/chunk/components/chunkToolButtonsConfig';

type ChunkState = {
    chunks: ChunkType[];
    loadingChunks: boolean;
    chunksError: string;
    activeTabs: ChunkTab[];
    setActiveTabs: (tabs: ChunkTab[]) => void;
    fetchChunks: (metaTextId: number) => Promise<void>;
    updateChunkField: UpdateChunkFieldFn;
    handleWordClick: (chunkId: number, chunkIdx: number, wordIdx: number) => Promise<void>;
    handleRemoveChunk: (chunkIdx: number) => Promise<void>;
    setChunks: (chunks: ChunkType[]) => void;
    refetchChunks: (metaTextId: number) => Promise<void>;
    resetChunkState: () => void;
};

export const useChunkStore = create<ChunkState>((set, get) => ({
    chunks: [],
    loadingChunks: false,
    chunksError: '',
    activeTabs: [],
    setActiveTabs: (tabs) => set({ activeTabs: tabs }),
    setChunks: async (chunks) => {
        set((state) => ({
            ...state,
            chunks,
            loadingChunks: false,
        }));
    },
    fetchChunks: async (metaTextId) => {
        set({ loadingChunks: true, chunksError: '' });
        try {
            const chunks = await apiFetchChunks(metaTextId);
            set((state) => ({
                ...state,
                chunks,
                loadingChunks: false,
            }));
        } catch (e: unknown) {
            set({
                chunksError: getErrorMessage(e, 'Failed to load chunks.'),
                loadingChunks: false,
            });
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
    handleRemoveChunk: async (chunkIdx) => {
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
    refetchChunks: async (metaTextId) => {
        set({ loadingChunks: true, chunksError: '' });
        try {
            const chunks = await apiFetchChunks(metaTextId);
            set((state) => ({
                ...state,
                chunks,
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

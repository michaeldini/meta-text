/**
 * Chunk Store
 * Manages text chunks and their operations using Zustand
 * Provides functions to fetch, update, split, combine, and manage chunks
 * 
 * Using Zustand for state management, compared to React Query for other parts of the application, because it provides a simpler API for managing local state and interactions with the chunk data.
 */

import { create } from 'zustand';

import { fetchChunks as apiFetchChunks, fetchChunks } from '@services/chunkService'
import { fetchChunk } from '@services/chunkService';
import { updateChunk } from '@services/chunkService';
import { splitChunk } from '@services/chunkService';
import { combineChunks } from '@services/chunkService';

import { getErrorMessage } from '@mtypes/error';
import type { ChunkType, UpdateChunkFieldFn } from '@mtypes/documents';
import log from '@utils/logger';


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
    handleWordClick: (chunkId: number, wordIdx: number) => Promise<void>;
    mergeChunks: (chunkIdx: ChunkType) => Promise<void>;
    setChunks: (chunks: ChunkType[]) => void;
    refetchChunks: (metatextId: number) => Promise<void>;
    resetChunkState: () => void;
    /**
     * Toggle bookmark for a chunk, ensuring only one chunk is bookmarked by the user at a time.
     * Clears bookmarks from all other chunks for the user, then sets/unsets the bookmark on the selected chunk.
     */
    toggleChunkBookmark: (chunkId: number, userId: number | null, metatextId: number, setBookmark: boolean) => void;
};

export const useChunkStore = create<ChunkState>((set, get) => ({
    chunks: [],
    loadingChunks: false,
    chunksError: '',
    activeTabs: [],
    setActiveTabs: (tabs) => set({ activeTabs: tabs }),
    setChunks: async (chunks) => {
        // Ensure chunks are sorted by position ascending
        console.log('Setting chunks:', chunks);
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
    /**
     * Toggle bookmark for a chunk, ensuring only one chunk is bookmarked by the user at a time.
     * Clears bookmarks from all other chunks for the user, then sets/unsets the bookmark on the selected chunk.
     */
    toggleChunkBookmark: (chunkId: number, userId: number | null, metatextId: number, setBookmark: boolean) => {
        set((state) => {
            if (!userId) return state;
            // Clear bookmarks from all chunks for this user in the same metatext
            const newChunks = state.chunks.map((chunk) => {
                if (chunk.metatext_id === metatextId && chunk.bookmarked_by_user_id === userId) {
                    // Unset bookmark
                    const updated = { ...chunk, bookmarked_by_user_id: null };
                    updateChunk(updated.id, updated);
                    return updated;
                }
                return chunk;
            });
            // Set/unset bookmark on the selected chunk
            const idx = newChunks.findIndex((c) => c.id === chunkId);
            if (idx !== -1) {
                const updatedChunk = { ...newChunks[idx], bookmarked_by_user_id: setBookmark ? userId : null };
                newChunks[idx] = updatedChunk;
                updateChunk(updatedChunk.id, updatedChunk);
            }
            return { ...state, chunks: newChunks };
        });
    },
    handleWordClick: async (chunkId, wordIdx) => {
        const splitResult = await splitChunk(chunkId, wordIdx + 1); // returns [updatedChunk, newChunk]
        if (!Array.isArray(splitResult) || splitResult.length < 2) return;
        set((state) => {
            const newChunks = [...state.chunks];
            // Find the index of the updated chunk by id
            const idx = newChunks.findIndex((c) => c.id === splitResult[0].id);
            if (idx === -1) return state;
            // Replace the old chunk with the updated one
            newChunks[idx] = splitResult[0];
            // Insert the new chunk right after
            newChunks.splice(idx + 1, 0, splitResult[1]);
            return { ...state, chunks: newChunks };
        });
    },
    mergeChunks: async (chunk) => {
        // const { chunks } = get();
        const combineResult = await combineChunks(chunk); // returns a single combined Chunk
        // if (!combineResult || !combineResult.id) return;
        const newChunks = await fetchChunks(chunk.metatext_id);
        set((state) => ({
            ...state,
            chunks: newChunks,
        }));
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
        console.log('Resetting chunk state');
        set({
            chunks: [],
            loadingChunks: false,
            chunksError: '',
            activeTabs: [],
        });
    },
}));

/**
 * useChunkNavigationStore - Centralized chunk navigation state
 * 
 * Provides a way for components to trigger navigation to specific chunks
 * without needing direct access to pagination functions.
 */

import { create } from 'zustand';

interface ChunkNavigationState {
    // Navigation request state
    requestedChunkId: number | null;

    // Actions
    requestNavigateToChunk: (chunkId: number) => void;
    clearNavigationRequest: () => void;
}

export const useChunkNavigationStore = create<ChunkNavigationState>((set) => ({
    requestedChunkId: null,

    requestNavigateToChunk: (chunkId: number) => {
        set({ requestedChunkId: chunkId });
    },

    clearNavigationRequest: () => {
        set({ requestedChunkId: null });
    },
}));
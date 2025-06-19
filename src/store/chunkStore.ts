import { create } from 'zustand';
import { fetchChunks as apiFetchChunks, updateChunk, splitChunk, combineChunks } from '../services/chunkService';
import { getErrorMessage } from '../types/error';
import type { Chunk } from '../types/chunk';

// Specific debounce function for chunk updates
function debounceChunkUpdate(
    func: (chunk: Chunk) => void,
    wait: number
): (chunk: Chunk) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return function (chunk: Chunk) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(chunk), wait);
    };
}

// Type for chunk field values - covers all possible field types
export type ChunkFieldValue = string | number | boolean | null | undefined;

interface ChunkState {
    chunks: Chunk[];
    loadingChunks: boolean;
    chunksError: string;
    activeChunkId: number | null;
    setActiveChunk: (id: number | null) => void;
    activeTabs: Array<'comparison' | 'ai-image' | 'notes-summary'>;
    setActiveTabs: (tabs: Array<'comparison' | 'ai-image' | 'notes-summary'>) => void;
    fetchChunks: (metaTextId: number) => Promise<void>;
    updateChunkField: (chunkId: number, field: keyof Chunk, value: ChunkFieldValue) => void;
    handleWordClick: (chunkIdx: number, wordIdx: number) => Promise<void>;
    handleRemoveChunk: (chunkIdx: number) => Promise<void>;
    setChunks: (chunks: Chunk[]) => void;
    refetchChunks: (metaTextId: number) => Promise<void>;
    resetChunkState: () => void;
}

const debouncers: Record<number, ReturnType<typeof debounceChunkUpdate>> = {};

export const useChunkStore = create<ChunkState>((set, get) => ({
    chunks: [],
    loadingChunks: false,
    chunksError: '',
    activeChunkId: null,
    setActiveChunk: (id) => set({ activeChunkId: id }),
    activeTabs: [],
    setActiveTabs: (tabs) => set({ activeTabs: tabs }),
    setChunks: (chunks) => set({ chunks }),
    fetchChunks: async (metaTextId) => {
        set({ loadingChunks: true, chunksError: '' });
        try {
            const chunks = await apiFetchChunks(metaTextId);
            set(state => {
                const updates: Partial<ChunkState> = {
                    chunks,
                    loadingChunks: false
                };

                // Auto-select first chunk and enable notes-summary if no chunk is currently active
                if (!state.activeChunkId && chunks.length > 0) {
                    updates.activeChunkId = chunks[0].id;
                    updates.activeTabs = ['notes-summary'];
                }

                return { ...state, ...updates };
            });
        } catch (e: unknown) {
            set({ chunksError: getErrorMessage(e, 'Failed to load chunks.'), loadingChunks: false });
        }
    },
    updateChunkField: (chunkId, field, value) => {
        set(state => {
            const idx = state.chunks.findIndex(c => c.id === chunkId);
            if (idx === -1) return state;
            const updatedChunk = { ...state.chunks[idx], [field]: value };
            const newChunks = [...state.chunks];
            newChunks[idx] = updatedChunk;
            // Debounce API update
            if (!debouncers[chunkId]) {
                debouncers[chunkId] = debounceChunkUpdate((data: Chunk) => {
                    updateChunk(data.id, data);
                }, 1200);
            }
            debouncers[chunkId]({ ...updatedChunk });
            return { ...state, chunks: newChunks };
        });
    },
    handleWordClick: async (chunkIdx, wordIdx) => {
        const { chunks } = get();
        if (!chunks[chunkIdx] || !chunks[chunkIdx].id) return;
        const oldChunk = chunks[chunkIdx];
        const splitResult = await splitChunk(oldChunk.id, wordIdx + 1); // returns [updatedChunk, newChunk]
        if (!Array.isArray(splitResult) || splitResult.length < 2) return;
        set(state => {
            const newChunks = [...state.chunks];
            // Replace the old chunk with the updated one
            newChunks[chunkIdx] = splitResult[0];
            // Insert the new chunk right after
            newChunks.splice(chunkIdx + 1, 0, splitResult[1]);
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
        set(state => {
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
            set(state => {
                const updates: Partial<ChunkState> = {
                    chunks,
                    loadingChunks: false
                };

                // Only auto-select first chunk if current active chunk no longer exists
                if (state.activeChunkId && !chunks.find(c => c.id === state.activeChunkId)) {
                    if (chunks.length > 0) {
                        updates.activeChunkId = chunks[0].id;
                        // Reset to default tabs when auto-selecting due to chunk no longer existing
                        updates.activeTabs = ['notes-summary'];
                    } else {
                        updates.activeChunkId = null;
                        updates.activeTabs = [];
                    }
                } else if (!state.activeChunkId && chunks.length > 0) {
                    // If no chunk was active and we have chunks, select first one
                    updates.activeChunkId = chunks[0].id;
                    updates.activeTabs = ['notes-summary'];
                }

                return { ...state, ...updates };
            });
        } catch (e: unknown) {
            set({ chunksError: getErrorMessage(e, 'Failed to reload chunks.'), loadingChunks: false });
        }
    },
    resetChunkState: () => {
        set({
            chunks: [],
            loadingChunks: false,
            chunksError: '',
            activeChunkId: null,
            activeTabs: []
        });
    },
}));

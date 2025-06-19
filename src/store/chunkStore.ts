import { create } from 'zustand';
import { fetchChunks as apiFetchChunks, updateChunk, splitChunk, combineChunks } from '../services/chunkService';
import type { Chunk } from '../types/chunk';

function debounce<F extends (...args: any[]) => void>(func: F, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: Parameters<F>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

interface ChunkState {
    chunks: Chunk[];
    loadingChunks: boolean;
    chunksError: string;
    activeChunkId: number | null;
    setActiveChunk: (id: number | null) => void;
    activeTabs: Array<'comparison' | 'ai-image' | 'notes-summary'>;
    setActiveTabs: (tabs: Array<'comparison' | 'ai-image' | 'notes-summary'>) => void;
    fetchChunks: (metaTextId: number) => Promise<void>;
    updateChunkField: (chunkId: number, field: keyof Chunk, value: any) => void;
    handleWordClick: (chunkIdx: number, wordIdx: number) => Promise<void>;
    handleRemoveChunk: (chunkIdx: number) => Promise<void>;
    setChunks: (chunks: Chunk[]) => void;
    refetchChunks: (metaTextId: number) => Promise<void>;
}

const debouncers: Record<number, ReturnType<typeof debounce>> = {};

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
            set({ chunks, loadingChunks: false });
        } catch (e: any) {
            set({ chunksError: e.message || 'Failed to load chunks.', loadingChunks: false });
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
                debouncers[chunkId] = debounce((data: Chunk) => {
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
        const splitResult = await splitChunk(oldChunk.id, wordIdx); // returns [updatedChunk, newChunk]
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
            set({ chunks, loadingChunks: false });
        } catch (e: any) {
            set({ chunksError: e.message || 'Failed to reload chunks.', loadingChunks: false });
        }
    },
}));

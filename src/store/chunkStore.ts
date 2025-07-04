import { create } from 'zustand';

import { getUserChunkSession, setUserChunkSession, fetchChunks as apiFetchChunks, updateChunk, splitChunk, combineChunks } from 'services';

import { getErrorMessage } from 'types';
import type { ChunkType, UpdateChunkFieldFn } from 'types';
import { log } from 'utils';
import { useAuthStore } from 'store';

import type { ChunkTab } from '../features/chunk/components/chunkToolbarConfig';

type ChunkState = {
    chunks: ChunkType[];
    loadingChunks: boolean;
    chunksError: string;
    activeChunkId: number | null;
    setActiveChunk: (id: number | null) => void;
    activeTabs: ChunkTab[];
    setActiveTabs: (tabs: ChunkTab[]) => void;
    fetchChunks: (metaTextId: number) => Promise<void>;
    updateChunkField: UpdateChunkFieldFn;
    handleWordClick: (chunkIdx: number, wordIdx: number) => Promise<void>;
    handleRemoveChunk: (chunkIdx: number) => Promise<void>;
    setChunks: (chunks: ChunkType[]) => void;
    refetchChunks: (metaTextId: number) => Promise<void>;
    resetChunkState: () => void;
};

// Utility for localStorage persistence of last active chunk per MetaText
function getLastActiveChunkId(metaTextId: number): number | null {
    const val = localStorage.getItem(`lastActiveChunk_${metaTextId}`);
    if (!val) return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
}

function setLastActiveChunkId(metaTextId: number, chunkId: number | null) {
    if (chunkId === null || chunkId === undefined) {
        localStorage.removeItem(`lastActiveChunk_${metaTextId}`);
    } else {
        localStorage.setItem(`lastActiveChunk_${metaTextId}`, String(chunkId));
    }
}

export const useChunkStore = create<ChunkState>((set, get) => ({
    chunks: [],
    loadingChunks: false,
    chunksError: '',
    activeChunkId: null,
    setActiveChunk: async (id) => {
        const { chunks } = get();
        const metaTextId = chunks.length > 0 ? chunks[0].meta_text_id : null;
        set({ activeChunkId: id });
        if (metaTextId) {
            setLastActiveChunkId(metaTextId, id);
            // Backend persistence if user is logged in
            const user = useAuthStore.getState().user;
            if (user && id) {
                try {
                    await setUserChunkSession({
                        user_id: user.id,
                        meta_text_id: metaTextId,
                        last_active_chunk_id: id,
                    });
                } catch (e) {
                    // Optionally handle error (e.g., show notification)
                }
            }
        }
    },
    activeTabs: [],
    setActiveTabs: (tabs) => set({ activeTabs: tabs }),
    setChunks: async (chunks) => {
        // Set chunks and also set activeChunkId like fetchChunks does, now with backend session support
        const metaTextId = chunks.length > 0 ? chunks[0].meta_text_id : null;
        let backendActiveChunkId: number | null = null;
        const user = useAuthStore.getState().user;
        if (user && metaTextId) {
            try {
                const session = await getUserChunkSession(user.id, metaTextId);
                if (session) backendActiveChunkId = session.last_active_chunk_id;
            } catch {
                // fallback to localStorage below
            }
        }
        set((state) => {
            const updates: Partial<ChunkState> = {
                chunks,
                loadingChunks: false,
            };
            if (!state.activeChunkId) {
                let lastActive = backendActiveChunkId;
                if (!lastActive && metaTextId) {
                    lastActive = getLastActiveChunkId(metaTextId);
                }
                if (lastActive && chunks.find((c) => c.id === lastActive)) {
                    updates.activeChunkId = lastActive;
                } else if (chunks.length > 0) {
                    updates.activeChunkId = chunks[0].id;
                }
            }
            return { ...state, ...updates };
        });
    },
    fetchChunks: async (metaTextId) => {
        set({ loadingChunks: true, chunksError: '' });
        try {
            const chunks = await apiFetchChunks(metaTextId);
            let backendActiveChunkId: number | null = null;
            // Try backend first if user is logged in
            const user = useAuthStore.getState().user;
            if (user) {
                try {
                    const session = await getUserChunkSession(user.id, metaTextId);
                    if (session) backendActiveChunkId = session.last_active_chunk_id;
                } catch { }
            }
            set((state) => {
                const updates: Partial<ChunkState> = {
                    chunks,
                    loadingChunks: false,
                };
                if (!state.activeChunkId) {
                    let lastActive = backendActiveChunkId;
                    if (!lastActive) {
                        lastActive = getLastActiveChunkId(metaTextId);
                    }
                    if (lastActive && chunks.find((c) => c.id === lastActive)) {
                        updates.activeChunkId = lastActive;
                        // updates.activeTabs = ['notes-summary']; // Uncomment if you want to auto-select notes-summary tab when restoring last active chunk
                    } else if (chunks.length > 0) {
                        updates.activeChunkId = chunks[0].id;
                        // updates.activeTabs = ['notes-summary']; // Default to notes-summary tab if no last active chunk
                    }
                }
                return { ...state, ...updates };
            });
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
            // Directly update API (no debounce needed)
            updateChunk(updatedChunk.id, updatedChunk);
            return { ...state, chunks: newChunks };
        });
    },
    handleWordClick: async (chunkIdx, wordIdx) => {
        log.info(`Handling word click in chunk ${chunkIdx} at word index ${wordIdx}`);
        const { chunks } = get();
        log.info(`Current chunks:`, chunks);
        if (!chunks[chunkIdx] || !chunks[chunkIdx].id) return;
        const oldChunk = chunks[chunkIdx];
        const splitResult = await splitChunk(oldChunk.id, wordIdx + 1); // returns [updatedChunk, newChunk]
        if (!Array.isArray(splitResult) || splitResult.length < 2) return;
        set((state) => {
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
            set((state) => {
                const updates: Partial<ChunkState> = {
                    chunks,
                    loadingChunks: false,
                };

                // Only auto-select first chunk if current active chunk no longer exists
                if (
                    state.activeChunkId &&
                    !chunks.find((c) => c.id === state.activeChunkId)
                ) {
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
            activeChunkId: null,
            activeTabs: [],
        });
    },
}));

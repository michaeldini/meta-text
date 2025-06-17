import { create } from 'zustand';

interface ChunkState {
    activeChunkId: string | null;
    setActiveChunk: (id: string | null) => void;
}

export const useChunkStore = create<ChunkState>((set) => ({
    activeChunkId: null,
    setActiveChunk: (id) => set({ activeChunkId: id }),
}));

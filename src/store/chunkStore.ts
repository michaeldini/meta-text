import { create } from 'zustand';

interface ChunkState {
    activeChunkId: string | null;
    setActiveChunk: (id: string | null) => void;
    activeTabs: Array<'comparison' | 'ai-image' | 'notes-summary'>;
    setActiveTabs: (tabs: Array<'comparison' | 'ai-image' | 'notes-summary'>) => void;
}

export const useChunkStore = create<ChunkState>((set) => ({
    activeChunkId: null,
    setActiveChunk: (id) => set({ activeChunkId: id }),
    activeTabs: [],
    setActiveTabs: (tabs) => set({ activeTabs: tabs }),
}));

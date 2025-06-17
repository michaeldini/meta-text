import { create } from 'zustand';

interface ChunkState {
    activeChunkId: string | null;
    setActiveChunk: (id: string | null) => void;
    activeTab: 'comparison' | 'ai-image';
    setActiveTab: (tab: 'comparison' | 'ai-image') => void;
}

export const useChunkStore = create<ChunkState>((set) => ({
    activeChunkId: null,
    setActiveChunk: (id) => set({ activeChunkId: id }),
    activeTab: 'comparison',
    setActiveTab: (tab) => set({ activeTab: tab }),
}));

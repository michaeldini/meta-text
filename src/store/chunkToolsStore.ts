/**
 * Chunk Tools Store
 * Minimal store for managing active chunk tools tabs
 * Replaces the larger metatextDetailStore for focused state management
 */

import { create } from 'zustand';
import type { ChunkToolId } from '../features/chunk-tools/toolsRegistry';

type ChunkToolsState = {
    activeTabs: ChunkToolId[];
    setActiveTabs: (tabs: ChunkToolId[]) => void;
};

export const useChunkToolsStore = create<ChunkToolsState>((set) => ({
    activeTabs: [],
    setActiveTabs: (tabs) => set({ activeTabs: tabs }),
}));

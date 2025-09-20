/**
 * Chunk Tools Store
 * Minimal store for managing active chunk tools tabs
 * Replaces the larger metatextDetailStore for focused state management
 */

import { create } from 'zustand';
import type { ChunkToolId } from '../features/chunk-tools/toolsRegistry';

type ChunkToolsState = {
    activeTools: ChunkToolId[];
    setActiveTools: (tabs: ChunkToolId[]) => void;
    toggleTool: (toolId: ChunkToolId) => void;
};

export const useChunkToolsStore = create<ChunkToolsState>((set) => ({
    activeTools: [],
    setActiveTools: (tools) => set({ activeTools: tools }),
    toggleTool: (toolId) => set((state) => {
        if (state.activeTools.includes(toolId)) {
            return { activeTools: state.activeTools.filter(id => id !== toolId) };
        } else {
            return { activeTools: [...state.activeTools, toolId] };
        }
    }),
}));

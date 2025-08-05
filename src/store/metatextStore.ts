/**
 * Metatext Store
 * Holds the current metatext and metatextId for global access.
 * Use this to access metatextId in any component or hook (e.g., SplitChunkTool).
 */

import { create } from 'zustand';

interface MetatextState {
    metatextId: number | null;
    setMetatextId: (id: number | null) => void;
    metatext: any; // Replace 'any' with your Metatext type if available
    setMetatext: (metatext: any) => void;
}

export const useMetatextStore = create<MetatextState>((set) => ({
    metatextId: null,
    setMetatextId: (id) => set({ metatextId: id }),
    metatext: null,
    setMetatext: (metatext) => set({ metatext }),
}));

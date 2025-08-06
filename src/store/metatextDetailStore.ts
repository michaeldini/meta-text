/**
 * Metatext Detail Store
 * Global state for Metatext detail page, including metatext, source doc, chunk info, UI preferences, and active tabs.
 * Uses Zustand for simple, maintainable state management across components.
 */

import { create } from 'zustand';
import type { ChunkToolId } from '../features/chunk-tools/toolsRegistry';

// Types for metatext and sourceDoc can be imported from schemas/types if available
type Metatext = any; // Replace with actual type
type SourceDoc = any; // Replace with actual type

type UiPreferences = {
    showChunkPositions?: boolean;
};

type MetatextDetailState = {
    metatextId: number | null;
    setMetatextId: (id: number | null) => void;
    metatext: Metatext | null;
    setMetatext: (metatext: Metatext | null) => void;
    sourceDoc: SourceDoc | null;
    setSourceDoc: (doc: SourceDoc | null) => void;
    showOnlyFavorites: boolean;
    setShowOnlyFavorites: (show: boolean) => void;
    uiPreferences: UiPreferences;
    setUiPreferences: (prefs: UiPreferences) => void;
    activeTabs: ChunkToolId[];
    setActiveTabs: (tabs: ChunkToolId[]) => void;
    paginatedChunkCount: number;
    setPaginatedChunkCount: (count: number) => void;
    bookmarkedChunkId: string | null;
    setBookmarkedChunkId: (id: string | null) => void;
    bookmarkLoading: boolean;
    setBookmarkLoading: (loading: boolean) => void;
};

export const useMetatextDetailStore = create<MetatextDetailState>((set, get) => ({
    metatextId: null,
    setMetatextId: (id) => set({ metatextId: id }),
    metatext: null,
    setMetatext: (metatext) => set({ metatext }),
    sourceDoc: null,
    setSourceDoc: (doc) => set({ sourceDoc: doc }),
    showOnlyFavorites: false,
    setShowOnlyFavorites: (show) => set({ showOnlyFavorites: show }),
    uiPreferences: {},
    setUiPreferences: (prefs) => set({ uiPreferences: prefs }),
    activeTabs: [],
    setActiveTabs: (tabs) => set({ activeTabs: tabs }),
    paginatedChunkCount: 0,
    setPaginatedChunkCount: (count) => set({ paginatedChunkCount: count }),
    bookmarkedChunkId: null,
    setBookmarkedChunkId: (id) => set({ bookmarkedChunkId: id }),
    bookmarkLoading: false,
    setBookmarkLoading: (loading) => set({ bookmarkLoading: loading }),
}));

// Zustand store for persistent chunk bookmarks
// Handles loading, setting, and clearing bookmarks for metatext chunks
import { create } from 'zustand';
import { fetchBookmark, setBookmark } from '../api/bookmarks';

interface BookmarkState {
    bookmarkedChunkId: number | null;
    loadBookmark: (metaTextId: number) => Promise<void>;
    setBookmarkedChunkId: (metaTextId: number, chunkId: number) => Promise<void>;
    // Hydrate from config
    hydrateBookmark: (chunkId: number | null) => void;
    // flag to trigger navigation to bookmark in UI
    navigateToBookmark: boolean;
    setNavigateToBookmark: () => void;
    clearNavigateToBookmark: () => void;
}

export const useBookmarkStore = create<BookmarkState>((set) => ({
    bookmarkedChunkId: null,
    loadBookmark: async (metaTextId) => {
        const chunkId = await fetchBookmark(metaTextId);
        set({ bookmarkedChunkId: chunkId });
    },
    setBookmarkedChunkId: async (metaTextId, chunkId) => {
        await setBookmark(metaTextId, chunkId);
        set({ bookmarkedChunkId: chunkId });
    },

    hydrateBookmark: (chunkId) => set({ bookmarkedChunkId: chunkId }),
    navigateToBookmark: false,
    setNavigateToBookmark: () => set({ navigateToBookmark: true }),
    clearNavigateToBookmark: () => set({ navigateToBookmark: false }),
}));

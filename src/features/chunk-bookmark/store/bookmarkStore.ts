// Zustand store for UI-only bookmark state (navigation )
import { create } from 'zustand';

interface BookmarkUIState {
    // flag to trigger navigation to bookmark in UI
    navigateToBookmark: boolean;

    // start navigation to chunk bookmark
    setNavigateToBookmark: () => void;

    // clear the navigation state
    clearNavigateToBookmark: () => void;
}

export const useBookmarkUIStore = create<BookmarkUIState>((set) => ({
    navigateToBookmark: false,
    setNavigateToBookmark: () => set({ navigateToBookmark: true }),
    clearNavigateToBookmark: () => set({ navigateToBookmark: false }),
}));

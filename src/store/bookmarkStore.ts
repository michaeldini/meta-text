// Zustand store for UI-only bookmark state (navigation flag, etc.)
import { create } from 'zustand';

interface BookmarkUIState {
    // flag to trigger navigation to bookmark in UI
    navigateToBookmark: boolean;
    setNavigateToBookmark: () => void;
    clearNavigateToBookmark: () => void;
}

export const useBookmarkUIStore = create<BookmarkUIState>((set) => ({
    navigateToBookmark: false,
    setNavigateToBookmark: () => set({ navigateToBookmark: true }),
    clearNavigateToBookmark: () => set({ navigateToBookmark: false }),
}));

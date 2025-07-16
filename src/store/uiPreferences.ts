
// Zustand store for UI preferences and persistent chunk bookmarks
import { create } from 'zustand';
import { fetchBookmark, setBookmark, clearBookmark } from '../api/bookmarks';

export const FONT_FAMILIES = [
    'Inter, sans-serif',
    'Roboto, sans-serif',
    'Arial, sans-serif',
    'Georgia, serif',
    'Times New Roman, Times, serif',
    'Courier New, Courier, monospace',
    'monospace',
    'Funnel Display, sans-serif',
    'Open Sans, sans-serif',
];

interface UIPreferencesState {
    textSizePx: number;
    setTextSizePx: (size: number) => void;
    fontFamily: string;
    setFontFamily: (font: string) => void;
    lineHeight: number;
    setLineHeight: (lh: number) => void;
    paddingX: number;
    setPaddingX: (px: number) => void;
    // ID of currently bookmarked chunk, or null
    bookmarkedChunkId: number | null;
    // Async: load bookmark for a metatext from backend
    loadBookmark: (metaTextId: number) => Promise<void>;
    // Async: set bookmark for a metatext/chunk in backend
    setBookmarkedChunkId: (metaTextId: number, chunkId: number) => Promise<void>;
    // Async: clear bookmark for a metatext in backend
    clearBookmark: (metaTextId: number) => Promise<void>;
    // flag to trigger navigation to bookmark in UI
    navigateToBookmark: boolean;
    setNavigateToBookmark: () => void;
    clearNavigateToBookmark: () => void;
    // flag to show/hide chunk positions
    showChunkPositions: boolean;
    setShowChunkPositions: (show: boolean) => void;
}

export const useUIPreferencesStore = create<UIPreferencesState>((set) => ({
    textSizePx: 24,
    setTextSizePx: (size) => set({ textSizePx: size }),
    fontFamily: FONT_FAMILIES[0],
    setFontFamily: (font) => set({ fontFamily: font }),
    lineHeight: 1.5,
    setLineHeight: (lh) => set({ lineHeight: lh }),
    paddingX: 0.3,
    setPaddingX: (px) => set({ paddingX: px }),
    bookmarkedChunkId: null,
    loadBookmark: async (metaTextId) => {
        const chunkId = await fetchBookmark(metaTextId);
        set({ bookmarkedChunkId: chunkId });
    },
    setBookmarkedChunkId: async (metaTextId, chunkId) => {
        await setBookmark(metaTextId, chunkId);
        set({ bookmarkedChunkId: chunkId });
    },
    clearBookmark: async (metaTextId) => {
        const success = await clearBookmark(metaTextId);
        if (success) {
            set({ bookmarkedChunkId: null });
        }
    },
    navigateToBookmark: false,
    setNavigateToBookmark: () => set({ navigateToBookmark: true }),
    clearNavigateToBookmark: () => set({ navigateToBookmark: false }),
    showChunkPositions: false,
    setShowChunkPositions: (show) => set({ showChunkPositions: show }),
}));




// Zustand store for UI preferences and persistent chunk bookmarks
import { create } from 'zustand';
import { fetchBookmark, setBookmark } from '../services/bookmarksService';
import { setUserConfig } from '../services/userConfigService';

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

    // Preferences
    textSizePx: number;
    fontFamily: string;
    lineHeight: number;
    paddingX: number;
    showChunkPositions: boolean;


    // Actions
    setTextSizePx: (size: number) => void;
    setFontFamily: (font: string) => void;
    setLineHeight: (lh: number) => void;
    setPaddingX: (px: number) => void;
    setShowChunkPositions: (show: boolean) => void;

    // Hydrate from config
    hydrateUIPreferences: (prefs: Partial<Pick<UIPreferencesState, 'textSizePx' | 'fontFamily' | 'lineHeight' | 'paddingX' | 'showChunkPositions'>>) => void;
}

export const useUIPreferencesStore = create<UIPreferencesState>((set) => ({

    // Default values
    // These can be overridden by user config on first load
    textSizePx: 28,
    fontFamily: FONT_FAMILIES[0],
    lineHeight: 1.5,
    paddingX: 0.3,
    showChunkPositions: false,

    // Actions
    setTextSizePx: (size) => {
        set({ textSizePx: size });
        setUserConfig({ textSizePx: size });
    },
    setFontFamily: (font) => {
        set({ fontFamily: font });
        setUserConfig({ fontFamily: font });
    },
    setLineHeight: (lh) => {
        set({ lineHeight: lh });
        setUserConfig({ lineHeight: lh });
    },
    setPaddingX: (px) => {
        set({ paddingX: px });
        setUserConfig({ paddingX: px });
    },
    setShowChunkPositions: (show) => {
        set({ showChunkPositions: show });
        setUserConfig({ showChunkPositions: show });
    },
    hydrateUIPreferences: (prefs) => set((state) => ({ ...state, ...prefs })),
}));



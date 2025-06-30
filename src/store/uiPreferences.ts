import { create } from 'zustand';

const FONT_FAMILIES = [
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
}

export const useUIPreferencesStore = create<UIPreferencesState>((set) => ({
    textSizePx: 24, // default px size
    setTextSizePx: (size) => set({ textSizePx: size }),
    fontFamily: FONT_FAMILIES[0],
    setFontFamily: (font) => set({ fontFamily: font }),
}));

export const AVAILABLE_FONT_FAMILIES = FONT_FAMILIES;

import { create } from 'zustand';

interface UIPreferencesState {
    textSizePx: number;
    setTextSizePx: (size: number) => void;
}

export const useUIPreferencesStore = create<UIPreferencesState>((set) => ({
    textSizePx: 24, // default px size
    setTextSizePx: (size) => set({ textSizePx: size }),
}));

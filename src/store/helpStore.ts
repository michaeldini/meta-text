/**
 * Help (Keyboard Shortcuts Drawer) Store
 * -------------------------------------
 * Central UI state for the keyboard shortcuts / help drawer so it can be
 * controlled from both UI (IconButton) and keyboard shortcut handlers.
 *
 * Pattern: mirrors other lightweight Zustand stores (see chunkToolsStore).
 */
import { create } from 'zustand';

interface HelpState {
    isHelpOpen: boolean;
    openHelp: () => void;
    closeHelp: () => void;
    toggleHelp: () => void;
}

export const useHelpStore = create<HelpState>((set) => ({
    isHelpOpen: false,
    openHelp: () => set({ isHelpOpen: true }),
    closeHelp: () => set({ isHelpOpen: false }),
    toggleHelp: () => set((s) => ({ isHelpOpen: !s.isHelpOpen })),
}));

// Convenience selectors (optional usage)
export const useIsHelpOpen = () => useHelpStore((s) => s.isHelpOpen);
export const useHelpActions = () => useHelpStore((s) => ({
    openHelp: s.openHelp,
    closeHelp: s.closeHelp,
    toggleHelp: s.toggleHelp,
}));

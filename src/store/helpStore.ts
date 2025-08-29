/**
 * DEPRECATED: Help (Keyboard Shortcuts Drawer) Store
 * --------------------------------------------------
 * Replaced by the generic drawer store in `@store/drawerStore`.
 * Keep this file temporarily to avoid breaking imports while migrating.
 * New code should NOT import from this module.
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

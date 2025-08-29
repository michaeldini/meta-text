/**
 * Drawer Store (Generic)
 * ----------------------
 * Centralized, reusable Zustand store for managing the open/close state
 * of multiple drawers across the app by ID. This avoids coupling unrelated
 * drawers to a single boolean (as happened with the old help store).
 *
 * Usage
 * -----
 * import { useDrawer, DRAWERS } from '@store/drawerStore';
 * const { isOpen, open, close, toggle } = useDrawer(DRAWERS.keyboardShortcuts);
 *
 * - Add new drawer IDs to the DRAWERS record for consistency.
 * - Prefer the `useDrawer(id)` helper for a compact API per component.
 */
import { create } from 'zustand';

export const DRAWERS = {
    keyboardShortcuts: 'keyboardShortcuts',
    sourceDocInfo: 'sourceDocInfo',
} as const;

export type DrawerId = typeof DRAWERS[keyof typeof DRAWERS] | (string & {});

interface DrawerState {
    openMap: Record<string, boolean>;
    openDrawer: (id: DrawerId) => void;
    closeDrawer: (id: DrawerId) => void;
    toggleDrawer: (id: DrawerId) => void;
}

export const useDrawerStore = create<DrawerState>()((set) => ({
    openMap: {},
    openDrawer: (id) =>
        set((s) => ({ openMap: { ...s.openMap, [id]: true } })),
    closeDrawer: (id) =>
        set((s) => ({ openMap: { ...s.openMap, [id]: false } })),
    toggleDrawer: (id) =>
        set((s) => ({ openMap: { ...s.openMap, [id]: !s.openMap[id] } })),
}));

// Lightweight hooks for common usage patterns
export const useIsDrawerOpen = (id: DrawerId) =>
    useDrawerStore((s) => Boolean(s.openMap[id]));

export function useDrawer(id: DrawerId) {
    const isOpen = useIsDrawerOpen(id);
    const openDrawer = useDrawerStore((s) => s.openDrawer);
    const closeDrawer = useDrawerStore((s) => s.closeDrawer);
    const toggleDrawer = useDrawerStore((s) => s.toggleDrawer);
    return {
        isOpen,
        open: () => openDrawer(id),
        close: () => closeDrawer(id),
        toggle: () => toggleDrawer(id),
    } as const;
}

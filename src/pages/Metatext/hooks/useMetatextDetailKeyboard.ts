/**
 * useMetatextDetailKeyboard
 * =========================
 * Page‑scoped keyboard shortcut hook for the Metatext Detail view. It composes:
 *  - Navigation shortcuts (next / previous page, jump to review)
 *  - Search shortcuts (focus + clear search input)
 *  - Chunk tool panel toggles (Notes/Summary, Evaluation, Image, Rewrite, Explanation)
 *
 * Separation of Concerns
 * ----------------------
 * 1. Global Registry (source of truth): `src/utils/keyboardShortcuts.ts`
 *    - Declares every shortcut combo + presentation metadata (description, category).
 *    - Includes CHUNK_TOOL_SHORTCUTS arrays (symbol + digit variants) but NO handlers.
 * 2. This Hook (page implementation layer):
 *    - Supplies runtime handlers (functions that *do* things) + enable/disable conditions.
 *    - Adapts registry entries into `ShortcutAction` objects consumed by `useKeyboardShortcuts`.
 * 3. UI Rendering: `KeyboardShortcutsDisplay` reads the registry (not this hook) to show help.
 *
 * Why handlers are attached here (and not in the registry):
 *  - Handlers need live closure state (currentPage, activeTabs, search input ref, etc.).
 *  - Keeping registry pure avoids accidental side-effects & simplifies testability.
 *
 * Adding / Modifying Page Shortcuts
 * ---------------------------------
 * A. If you ONLY need a different handler for an existing registered key combo:
 *    1. Find the appropriate shortcut group (e.g., NAVIGATION_SHORTCUTS.NEXT_PAGE).
 *    2. Spread it into the local `shortcuts` array with your custom `handler` / `enabled` logic.
 *
 * B. If you need a NEW shortcut combination (new key sequence):
 *    1. Edit `keyboardShortcuts.ts` and add it to the correct registry object (or create a new one).
 *       - Do NOT define raw key combos inline here (keeps source of truth centralized).
 *    2. Import the new shortcut constant (or group) here and attach a handler.
 *      const newShortcut: ShortcutAction = {
 *        ...NEW_SHORTCUT,
 *        handler: (event) => {
 *          // Custom handler logic
 *        },
 *      };
 * 
 *
 * C. If you need a NEW Chunk Tool toggle shortcut:
 *    1. Add the tool itself to `chunkToolsRegistry` (if brand new).
 *    2. In `keyboardShortcuts.ts`, add a new entry in `CHUNK_TOOL_SHORTCUTS` with its key combos.
 *    3. Extend `chunkToolShortcutMap` below to map the registry key (e.g., NEW_TOOL) → tool id.
 *    4. No other structural changes required—the mapping logic auto‑generates `ShortcutAction`s.
 *
 * D. If you need CONDITIONAL availability (e.g., only when a modal closed):
 *    - Gate with `enabled && <condition>` inside the composed `shortcuts` array entry.
 *
 * Removing a Shortcut
 * -------------------
 * 1. Remove its handler entry here.
 * 2. Remove the registry definition (or mark deprecated) to keep help UI accurate.
 *
 * Implementation Notes
 * --------------------
 *  - We duplicate symbol + digit variants for number row shortcuts because some keyboard layouts
 *    emit symbols (e.g., Shift+1 -> '!') while others / some contexts still report '1'.
 *  - Toggling tools uses store state from `useChunkToolsStore` to add/remove tool ids.
 *  - `useKeyboardShortcuts` likely handles: window keydown subscription, focus guards, preventDefault.
 *
 * Testing Guidance
 * ----------------
 *  - Mock `useKeyboardShortcuts` to assert it receives the expected array length & enabled flags.
 *  - For integration: simulate keydown { metaKey: true, ctrlKey: true, shiftKey: true, key: '1' }
 *    and assert the corresponding tool id appears in activeTabs.
 *  - Edge cases: disabled state; first / last page boundary disabling NEXT/PREV navigation.
 *
 * Future Enhancements (optional)
 * ------------------------------
 *  - Add chunk-to-chunk navigation (NEXT_CHUNK / PREV_CHUNK) once activated globally.
 *  - Provide a conflict detector that warns (console / dev overlay) if two handlers attach to same combo.
 *  - Add analytics event emission inside handlers if shortcut usage metrics are desired.
 *
 * IMPORTANT: Keep all new key combo definitions out of this file—only attach handlers here.
 */
import { useCallback } from 'react';
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';
import { NAVIGATION_SHORTCUTS, GLOBAL_SHORTCUTS, CHUNK_TOOL_SHORTCUTS, type ShortcutAction, type KeyboardShortcut } from '@utils/keyboardShortcuts';
import { useSearchStore } from '@features/chunk-search/store/useSearchStore';
import { useChunkToolsStore } from '@store/chunkToolsStore';
import type { ChunkToolId } from '@features/chunk-tools/toolsRegistry';
import { useColorMode } from '@components/ui/color-mode'
import { useDrawerStore, DRAWERS } from '@store/drawerStore';

interface UseMetatextDetailKeyboardOptions {
    enabled?: boolean;
    onNextPage?: () => void;
    onPrevPage?: () => void;
    onGotoReview?: () => void;
    currentPage?: number;
    totalPages?: number;
    searchInputRef?: React.RefObject<HTMLInputElement>;
}

/**
 * Hook that provides MetatextDetailPage-specific keyboard shortcuts including search
 */
export const useMetatextDetailKeyboard = ({
    enabled = true,
    onNextPage,
    onPrevPage,
    onGotoReview,
    currentPage = 1,
    totalPages = 1,
    searchInputRef,
}: UseMetatextDetailKeyboardOptions = {}) => {
    const { clearSearch, query } = useSearchStore();
    const activeTabs = useChunkToolsStore(state => state.activeTools);
    const setActiveTabs = useChunkToolsStore(state => state.setActiveTools);
    const { toggleColorMode } = useColorMode();
    const toggleDrawer = useDrawerStore(s => s.toggleDrawer);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            onNextPage?.();
        }
    }, [onNextPage, currentPage, totalPages]);

    const handlePrevPage = useCallback(() => {
        if (currentPage > 1) {
            onPrevPage?.();
        }
    }, [onPrevPage, currentPage]);

    const handleGotoReview = useCallback(() => {
        onGotoReview?.();
    }, [onGotoReview]);

    // Search-related functions
    const focusSearch = useCallback(() => {
        if (searchInputRef?.current) {
            searchInputRef.current.focus();
        } else {
            // Fallback: try to find search input in the DOM
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            searchInput?.focus();
        }
    }, [searchInputRef]);

    const handleEscape = useCallback(() => {
        const activeElement = document.activeElement;
        const isSearchFocused = activeElement?.tagName === 'INPUT' &&
            (activeElement as HTMLInputElement).placeholder?.includes('Search');

        if (isSearchFocused || query) {
            clearSearch();
        }
    }, [clearSearch, query]);


    // Chunk Tools: toggle visibility via Control+Shift+[key]
    const toggleTool = useCallback((toolId: ChunkToolId) => {
        if (activeTabs.includes(toolId)) {
            setActiveTabs(activeTabs.filter(id => id !== toolId));
        } else {
            setActiveTabs([...activeTabs, toolId]);
        }
    }, [activeTabs, setActiveTabs]);

    // Map central chunk tool shortcuts (array entries) to actual handlers per tool id.
    // The central registry defines key combos; we attach page-specific handlers here.
    const chunkToolShortcutMap: Record<string, ChunkToolId> = {
        NOTE_SUMMARY: 'note-summary',
        EVALUATION: 'evaluation',
        IMAGE: 'image',
        REWRITE: 'rewrite',
        EXPLANATION: 'explanation',
    };
    const chunkToolShortcuts: ShortcutAction[] = Object.entries(CHUNK_TOOL_SHORTCUTS).flatMap(([key, shortcuts]) => {
        const toolId = chunkToolShortcutMap[key];
        return shortcuts.map((s: KeyboardShortcut): ShortcutAction => ({
            ...s,
            // Override category naming from central registry if desired, keep existing.
            handler: () => toggleTool(toolId),
            enabled,
        }));
    });


    // Define all page-specific shortcuts (navigation + search)
    const shortcuts: ShortcutAction[] = [
        // Navigation shortcuts
        {
            ...NAVIGATION_SHORTCUTS.NEXT_PAGE,
            handler: handleNextPage,
            enabled: enabled && !!onNextPage && currentPage < totalPages,
        },
        {
            ...NAVIGATION_SHORTCUTS.PREV_PAGE,
            handler: handlePrevPage,
            enabled: enabled && !!onPrevPage && currentPage > 1,
        },
        {
            ...NAVIGATION_SHORTCUTS.GOTO_REVIEW,
            handler: handleGotoReview,
            enabled: enabled && !!onGotoReview,
        },
        // Search shortcuts
        {
            ...GLOBAL_SHORTCUTS.FOCUS_SEARCH,
            handler: focusSearch,
            enabled,
        },
        {
            ...GLOBAL_SHORTCUTS.CLEAR_SEARCH,
            handler: handleEscape,
            enabled,
        },
        // Global shortcuts
        {
            ...GLOBAL_SHORTCUTS.TOGGLE_THEME,
            handler: () => {
                toggleColorMode?.();
            },
            enabled,

        },
        {
            ...GLOBAL_SHORTCUTS.TOGGLE_HELP,
            handler: () => toggleDrawer(DRAWERS.keyboardShortcuts),
            enabled,
        },
        // Chunk tool shortcuts (Control+Shift+1..5)
        ...chunkToolShortcuts,
    ];

    // Use the general keyboard shortcuts hook
    const { triggerShortcut } = useKeyboardShortcuts(shortcuts, {
        enabled,
        preventDefault: true,
    });

    return {
        // Navigation functions
        triggerNextPage: handleNextPage,
        triggerPrevPage: handlePrevPage,
        triggerGotoReview: handleGotoReview,
        // Search functions
        focusSearch,
        clearSearch,
        triggerShortcut,
    };
};

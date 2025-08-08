/** keep this file, in use. TODO: add moving chunk to chunk navigation
 * Keyboard shortcuts specific to the MetatextDetailPage.
 * Demonstrates how to create page-specific shortcuts using the general system.
 * Now includes search functionality since search is only used on this page.
 */
import { useCallback } from 'react';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import { NAVIGATION_SHORTCUTS, GLOBAL_SHORTCUTS, type ShortcutAction } from '../../../utils/keyboardShortcuts';
import { useSearchStore } from '../../../features/chunk-search/store/useSearchStore';
import { useChunkToolsStore } from '@store/chunkToolsStore';
import type { ChunkToolId } from '@features/chunk-tools/toolsRegistry';

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
    const activeTabs = useChunkToolsStore(state => state.activeTabs);
    const setActiveTabs = useChunkToolsStore(state => state.setActiveTabs);

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

    // Map number keys to tools for low-conflict shortcuts
    // Important: With Shift pressed, number keys may produce symbol keys (!,@,#,$,%) in `event.key`,
    // but some browsers/layouts still report the digit. Register BOTH to be robust.
    const chunkToolShortcuts: ShortcutAction[] = [
        {
            key: '!', // Ctrl+Shift+1
            // Note: metaKey true here satisfies the lib's combined meta-or-ctrl matcher; ctrlKey specifically requires Control
            metaKey: true,
            ctrlKey: true,
            shiftKey: true,
            description: 'Toggle Notes & Summary tool',
            category: 'Chunks',
            handler: () => toggleTool('note-summary'),
            enabled,
        },
        {
            key: '1', // Ctrl+Shift+1 (digit variant)
            metaKey: true,
            ctrlKey: true,
            shiftKey: true,
            description: 'Toggle Notes & Summary tool',
            category: 'Chunks',
            handler: () => toggleTool('note-summary'),
            enabled,
        },
        {
            key: '@', // Ctrl+Shift+2
            metaKey: true,
            ctrlKey: true,
            shiftKey: true,
            description: 'Toggle Evaluation tool',
            category: 'Chunks',
            handler: () => toggleTool('evaluation'),
            enabled,
        },
        {
            key: '2', // Ctrl+Shift+2 (digit variant)
            metaKey: true,
            ctrlKey: true,
            shiftKey: true,
            description: 'Toggle Evaluation tool',
            category: 'Chunks',
            handler: () => toggleTool('evaluation'),
            enabled,
        },
        {
            key: '#', // Ctrl+Shift+3
            metaKey: true,
            ctrlKey: true,
            shiftKey: true,
            description: 'Toggle Image tool',
            category: 'Chunks',
            handler: () => toggleTool('image'),
            enabled,
        },
        {
            key: '3', // Ctrl+Shift+3 (digit variant)
            metaKey: true,
            ctrlKey: true,
            shiftKey: true,
            description: 'Toggle Image tool',
            category: 'Chunks',
            handler: () => toggleTool('image'),
            enabled,
        },
        {
            key: '$', // Ctrl+Shift+4
            metaKey: true,
            ctrlKey: true,
            shiftKey: true,
            description: 'Toggle Rewrite tool',
            category: 'Chunks',
            handler: () => toggleTool('rewrite'),
            enabled,
        },
        {
            key: '4', // Ctrl+Shift+4 (digit variant)
            metaKey: true,
            ctrlKey: true,
            shiftKey: true,
            description: 'Toggle Rewrite tool',
            category: 'Chunks',
            handler: () => toggleTool('rewrite'),
            enabled,
        },
        {
            key: '%', // Ctrl+Shift+5
            metaKey: true,
            ctrlKey: true,
            shiftKey: true,
            description: 'Toggle Explanation tool',
            category: 'Chunks',
            handler: () => toggleTool('explanation'),
            enabled,
        },
        {
            key: '5', // Ctrl+Shift+5 (digit variant)
            metaKey: true,
            ctrlKey: true,
            shiftKey: true,
            description: 'Toggle Explanation tool',
            category: 'Chunks',
            handler: () => toggleTool('explanation'),
            enabled,
        },
    ];

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

/** keep this file, in use. TODO: add moving chunk to chunk navigation
 * Keyboard shortcuts specific to the MetatextDetailPage.
 * Demonstrates how to create page-specific shortcuts using the general system.
 * Now includes search functionality since search is only used on this page.
 */
import { useCallback } from 'react';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import { NAVIGATION_SHORTCUTS, GLOBAL_SHORTCUTS, type ShortcutAction } from '../../../utils/keyboardShortcuts';
import { useSearchStore } from '../../../features/chunk-search/store/useSearchStore';

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

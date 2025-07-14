// Hook for handling keyboard shortcuts for search functionality
// Implements Cmd+K (or Ctrl+K) to focus search, Escape to clear

import { useEffect, useCallback } from 'react';
import { useSearchStore } from '../store/useSearchStore';
import { useSearch } from './useSearch';

interface UseSearchKeyboardOptions {
    enabled?: boolean;
    searchInputRef?: React.RefObject<HTMLInputElement>;
}

export const useSearchKeyboard = (options: UseSearchKeyboardOptions = {}) => {
    const { enabled = true, searchInputRef } = options;
    const { clearSearch } = useSearch();
    const { query, totalMatches } = useSearchStore();

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled) return;

        // Cmd+K or Ctrl+K to focus search
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
            event.preventDefault();
            if (searchInputRef?.current) {
                searchInputRef.current.focus();
            } else {
                // Try to find search input in the DOM
                const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
                searchInput?.focus();
            }
        }

        // Escape to clear search (only if search is focused or has content)
        if (event.key === 'Escape') {
            const activeElement = document.activeElement;
            const isSearchFocused = activeElement?.tagName === 'INPUT' &&
                (activeElement as HTMLInputElement).placeholder?.includes('Search');

            if (isSearchFocused || query) {
                clearSearch();
            }
        }

        // Arrow keys to navigate between matches (when search is active)
        // Navigation functionality has been removed

    }, [enabled, searchInputRef, clearSearch, query, totalMatches]);

    useEffect(() => {
        if (enabled) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [enabled, handleKeyDown]);

    return {
        // Expose manual trigger functions
        focusSearch: () => {
            if (searchInputRef?.current) {
                searchInputRef.current.focus();
            } else {
                const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
                searchInput?.focus();
            }
        },
        clearSearch
    };
};

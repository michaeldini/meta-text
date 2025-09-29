import { useEffect, useState } from 'react';
import { useSearchStore } from '../store/useSearchStore';
import type { ChunkType } from '@mtypes/documents';

/**
 * Composite hook that merges query state and chunk search logic.
 * Provides query controls and filtered chunk results with debounce.
 * 
 * `useSearchStore` provides:
 * - query state: current search query string
 * - setQuery: function to update the query
 * - clearSearch: function to clear the query
 * - registerSearchInput: function to register the search input element
 * - focusSearch: function to focus the search input element
 * 
 * This hook adds:
 * - results: array of chunks filtered by the search query
 * - isSearching: boolean indicating if a search is in progress
 * 
 * Debounce is applied to the search logic to optimize performance.
 * 
 * @param chunks - array of chunks to search
 * @param debounceMs - optional debounce delay in ms
 */
export function useSearch(chunks?: ChunkType[], debounceMs = 300) {
    // store-driven UI state
    const { query, setQuery, clearSearch, registerSearchInput, focusSearch } = useSearchStore();
    // internal chunk-search state
    const [results, setResults] = useState<ChunkType[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // debounce and search effect
    useEffect(() => {
        if (!chunks || chunks.length === 0) {
            setResults([]);
            setIsSearching(false);
            return;
        }
        if (query.length < 2) {
            setResults(chunks);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        const timeout = setTimeout(() => {
            const term = query.toLowerCase();
            const filtered: ChunkType[] = [];
            for (const chunk of chunks) {
                const text = chunk.text || '';
                if (text.toLowerCase().includes(term)) filtered.push(chunk);
            }
            setResults(filtered);
            setIsSearching(false);
        }, debounceMs);
        return () => {
            clearTimeout(timeout);
            setIsSearching(false);
        };
    }, [chunks, query, debounceMs]);

    // reset possible input when chunks change and no active query
    useEffect(() => {
        if (!query || query.length < 2) {
            registerSearchInput?.(null);
        }
    }, [chunks]);

    return {
        query,
        setQuery,
        clearSearch,
        registerSearchInput,
        focusSearch,
        results,
        isSearching,
    };
}
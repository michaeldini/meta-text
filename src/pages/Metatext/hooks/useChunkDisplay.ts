/**
 * useChunkDisplay - Unified hook for chunk search, filtering, pagination, and display
 * 
 * Combines search filtering, favorites filtering, and pagination into a single
 * streamlined interface. Integrates search logic directly instead of relying
 * on a separate search store for better cohesion and simpler architecture.
 */

import { useEffect, useMemo, useCallback, useState } from 'react';
import { useDisplayChunksStore } from '@features/chunk/hooks/useDisplayChunksStore';
import { useSearchStore } from '@features/chunk-search/store/useSearchStore';
import { ChunkType } from '@mtypes/documents';
import log from '@utils/logger';

interface UseChunkDisplayOptions {
    chunks: ChunkType[] | undefined;
    chunksPerPage?: number;
}

interface UseChunkDisplayResult {
    // Display data
    displayChunks: ChunkType[];
    totalFilteredChunks: number;

    // Pagination
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    startIndex: number;
    endIndex: number;

    // Filtering
    showOnlyFavorites: boolean;
    setShowOnlyFavorites: (show: boolean) => void;
    isSearchActive: boolean;
}export function useChunkDisplay({
    chunks,
    chunksPerPage = 5
}: UseChunkDisplayOptions): UseChunkDisplayResult {

    // Get search state from the search store
    const { query } = useSearchStore();

    // Local search results state
    const [searchResults, setSearchResults] = useState<ChunkType[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Get display state (pagination + favorites)
    const {
        currentPage,
        setCurrentPage,
        setChunksPerPage,
        showOnlyFavorites,
        setShowOnlyFavorites
    } = useDisplayChunksStore();

    // Set chunks per page on mount/change
    useEffect(() => {
        setChunksPerPage(chunksPerPage);
    }, [setChunksPerPage, chunksPerPage]);

    // Execute search with debouncing
    useEffect(() => {
        if (!chunks || chunks.length === 0) {
            setSearchResults([]);
            return;
        }

        // Clear search if query is too short
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        // Debounce search execution
        const timeoutId = setTimeout(() => {
            setIsSearching(true);
            const searchTermLower = query.toLowerCase();
            const matchingChunks: ChunkType[] = [];

            log.info(`Searching for "${query}" in ${chunks.length} chunks`);

            for (const chunk of chunks) {
                const chunkText = chunk.text || '';
                const chunkTextLower = chunkText.toLowerCase();
                if (chunkTextLower.includes(searchTermLower)) {
                    matchingChunks.push(chunk);
                }
            }

            setSearchResults(matchingChunks);
            setIsSearching(false);
            log.info(`Search completed: ${matchingChunks.length} chunks found`);
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [query, chunks]);

    // Calculate filtered chunks based on search and favorites
    const filteredChunks = useMemo((): ChunkType[] => {
        if (!chunks || chunks.length === 0) return [];

        // Start with search results if searching, otherwise all chunks
        let filtered = query.length >= 2 ? searchResults : chunks;

        // Apply favorites filter if enabled
        if (showOnlyFavorites) {
            filtered = filtered.filter((chunk: ChunkType) => !!chunk.favorited_by_user_id);
        }

        return filtered;
    }, [chunks, query, searchResults, showOnlyFavorites]);

    // Calculate pagination values
    const totalFilteredChunks = filteredChunks.length;
    const totalPages = Math.ceil(totalFilteredChunks / chunksPerPage);
    const startIndex = (currentPage - 1) * chunksPerPage;
    const endIndex = startIndex + chunksPerPage;
    const displayChunks = filteredChunks.slice(startIndex, endIndex);    // Reset to page 1 if current page is beyond available pages
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [filteredChunks, totalPages, currentPage, setCurrentPage]);

    return {
        // Display data
        displayChunks,
        totalFilteredChunks,

        // Pagination
        currentPage,
        totalPages,
        setCurrentPage,
        startIndex,
        endIndex,

        // Filtering
        showOnlyFavorites,
        setShowOnlyFavorites,
        isSearchActive: query.length >= 2,
    };
}

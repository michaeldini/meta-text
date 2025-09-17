// Component for displaying chunk count and status information
import React from 'react';
import { Stack, Box, Text } from '@styles';
import { SearchBar } from '@features/chunk-search';
import { useSearchStore } from '@features/chunk-search/store/useSearchStore';

interface ChunkStatusInfoProps {
    totalFilteredChunks: number;
    displayChunksCount: number;
    isSearching?: boolean;
}

/**
 * ChunkStatusInfo - Displays chunk count information and search container
 * 
 * Shows the current status of chunk filtering and search results,
 * along with the search input component.
 */
export function ChunkStatusInfo({
    totalFilteredChunks,
    displayChunksCount,
    isSearching = false
}: ChunkStatusInfoProps) {
    const { query } = useSearchStore();
    const hasQuery = query.length >= 2;
    const getStatusMessage = () => {
        if (totalFilteredChunks === 0) {
            return hasQuery
                ? "No chunks found matching your search"
                : "No chunks found with current filters";
        }

        return `Showing ${displayChunksCount} of ${totalFilteredChunks} chunks`;
    };

    return (
        <>
            <SearchBar />
            {isSearching && (
                <Box data-testid="chunk-search-spinner">
                    <span role="status" aria-label="Loading" style={{ fontSize: '1.2em' }}>⏳</span>
                </Box>
            )}
            <Text
                css={{ backgroundColor: 'gray' }}
                data-testid="chunk-status-text"
            >
                {getStatusMessage()}
            </Text>
        </>
    );
}
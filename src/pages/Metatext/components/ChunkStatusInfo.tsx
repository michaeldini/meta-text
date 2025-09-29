// Component for displaying chunk count and status information
import React from 'react';
import { Column, Box, Text } from '@styles';
import { SearchBar } from '@features/chunk-search';
import { useSearch } from '@features/chunk-search/hooks/useSearch';

interface ChunkStatusInfoProps {
    totalFilteredChunks: number;
    displayChunksCount: number;
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
}: ChunkStatusInfoProps) {
    const { query, isSearching } = useSearch();
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
// Component for displaying chunk count and status information
import React from 'react';
import { Center } from '@chakra-ui/react/center';
import { Text } from '@chakra-ui/react/text';
import { SearchContainer } from '@features/chunk-search';
import { useSearchStore } from '@features/chunk-search/store/useSearchStore';
import { Spinner } from '@chakra-ui/react';

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
        <Center data-testid="chunk-status-info">
            <SearchContainer />
            {isSearching && <Spinner size="sm" mr={2} data-testid="chunk-search-spinner" />}
            <Text
                fontSize="sm"
                color="fg.muted"
                data-testid="chunk-status-text"
            >
                {getStatusMessage()}
            </Text>
        </Center>
    );
}

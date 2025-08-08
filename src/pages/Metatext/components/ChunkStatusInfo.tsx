// Component for displaying chunk count and status information
import React from 'react';
import { Center } from '@chakra-ui/react/center';
import { Text } from '@chakra-ui/react/text';
import { SearchContainer } from '@features/chunk-search';

interface ChunkStatusInfoProps {
    totalFilteredChunks: number;
    displayChunksCount: number;
    isSearchActive?: boolean;
}

/**
 * ChunkStatusInfo - Displays chunk count information and search container
 * 
 * Shows the current status of chunk filtering and search results,
 * along with the search input component.
 */
export const ChunkStatusInfo: React.FC<ChunkStatusInfoProps> = ({
    totalFilteredChunks,
    displayChunksCount,
    isSearchActive = false
}) => {
    const getStatusMessage = () => {
        if (totalFilteredChunks === 0) {
            return isSearchActive
                ? "No chunks found matching your search"
                : "No chunks found with current filters";
        }

        return `Showing ${displayChunksCount} of ${totalFilteredChunks} chunks`;
    };

    return (
        <Center data-testid="chunk-status-info">
            <SearchContainer />
            <Text
                fontSize="sm"
                color="fg.muted"
                data-testid="chunk-status-text"
            >
                {getStatusMessage()}
            </Text>
        </Center>
    );
};

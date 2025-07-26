// Main search container that combines all search components
// Orchestrates the search interface as described in the feature guide

import React, { useCallback } from 'react';
import {
    Box,
    Stack
} from '@chakra-ui/react';
import { SearchBar } from './SearchBar';
import { TagFilters } from './TagFilters';

// Import search feature styles
import '../search.css';

interface SearchContainerProps {
    showTagFilters?: boolean;
    availableTags?: string[];
}

export function SearchContainer({ showTagFilters = true, availableTags }: SearchContainerProps) {

    return (
        <Stack direction="row" alignItems="center">
            {/* Search Bar */}
            <Box >
                <SearchBar />
            </Box>

            {/* Tag Filters */}
            {showTagFilters && (
                <Stack direction="row" alignItems="center">
                    <TagFilters availableTags={availableTags} />
                </Stack>
            )}
        </Stack>
    );
};

export default SearchContainer;

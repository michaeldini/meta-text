// Main search container that combines all search components
// Orchestrates the search interface as described in the feature guide

import React, { useCallback } from 'react';
import {
    Box,
    Stack,
    useTheme
} from '@mui/material';
import { SearchBar } from './SearchBar';
import { TagFilters } from './TagFilters';
import { useSearchStore } from '../store/useSearchStore';

// Import search feature styles
import '../search.css';

interface SearchContainerProps {
    showTagFilters?: boolean;
    availableTags?: string[];
}

export function SearchContainer({ showTagFilters = true, availableTags }: SearchContainerProps) {
    const theme = useTheme();

    return (
        <Stack direction="row" spacing={2} alignItems="center">
            {/* Search Bar */}
            <Box sx={{
                display: 'flex',
                gap: theme.spacing(2),
                flexWrap: 'wrap',
                flex: { xs: '1', sm: 'auto' }
            }}>
                <SearchBar />
            </Box>

            {/* Tag Filters */}
            {showTagFilters && (
                <Stack direction="row" spacing={2} alignItems="center">
                    <TagFilters availableTags={availableTags} />
                </Stack>
            )}
        </Stack>
    );
};

export default SearchContainer;

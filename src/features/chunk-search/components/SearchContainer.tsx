// Main search container that combines all search components
// Orchestrates the search interface as described in the feature guide

import React, { useCallback } from 'react';
import {
    Box,
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

export const SearchContainer: React.FC<SearchContainerProps> = ({
    showTagFilters = true,
    availableTags
}) => {
    const theme = useTheme();

    return (
        <Box sx={{
            display: 'flex',
            gap: 4,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'end' },
            flexWrap: 'wrap'
        }}>
            {/* Search Bar */}
            <Box sx={{
                display: 'flex',
                // alignItems: 'end',
                gap: theme.spacing(2),
                flexWrap: 'wrap',
                flex: { xs: '1', sm: 'auto' }
            }}>
                <SearchBar />
            </Box>

            {/* Tag Filters */}
            {showTagFilters && (
                <Box sx={{
                    flex: { xs: '1', sm: 'auto' },
                    mt: { xs: 1, sm: 0 }
                }}>
                    <TagFilters availableTags={availableTags} />
                </Box>
            )}
        </Box>
    );
};

export default SearchContainer;

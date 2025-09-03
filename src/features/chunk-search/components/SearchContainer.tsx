// Main search container that combines all search components
// Orchestrates the search interface as described in the feature guide

import React from 'react';
import {
    Box,
    Stack
} from '@chakra-ui/react';
import { SearchBar } from './SearchBar';

// Import search feature styles
import '../search.css';

export function SearchContainer() {

    return (
        <Box width="60%">
            <SearchBar />
        </Box>

    );
}

export default SearchContainer;

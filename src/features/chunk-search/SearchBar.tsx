import { HiMagnifyingGlass } from 'react-icons/hi2';

// Search bar component with icon, input field, and clear functionality
// Provides the main search interface as described in the feature guide

import React, { useCallback } from 'react';
import { Box, Input, Button } from '@styles';

/* Get current search query from store */
import { useSearch } from './hooks/useSearch';


// Props for the SearchBar component
interface SearchBarProps {
    placeholder?: string;
}


export function SearchBar({
    placeholder = 'Search...(CMD+K)',
}: SearchBarProps) {
    const { query, setQuery, clearSearch, registerSearchInput } = useSearch();

    const handleQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }, [setQuery]);

    const inputRef = React.useRef<HTMLInputElement>(null);
    // registerSearchInput now comes from useSearch

    React.useEffect(() => {
        registerSearchInput(inputRef.current);
        return () => registerSearchInput(null);
    }, [registerSearchInput]);
    const endElement = query ? (
        <Button
            onClick={() => {
                setQuery("");
                inputRef.current?.focus();
            }}
            aria-label="Clear search"
            style={{ marginLeft: -2 }}
        >
            ×
        </Button>
    ) : undefined;
    return (
        <Box noPad css={{ backgroundColor: 'transparent', borderRadius: 6, marginRight: 12, border: '1px solid $border', display: 'flex', alignItems: 'center', paddingLeft: '10px' }}>
            <HiMagnifyingGlass />
            <Input
                id="metatext-search-input"
                data-testid="metatext-search-input"
                ref={inputRef}
                placeholder={placeholder}
                value={query}
                onChange={handleQueryChange}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Escape' || e.key === 'Esc') {
                        clearSearch();
                        // Keep focus behavior consistent: focus the input after clearing
                        inputRef.current?.focus();
                    }
                }}
            />
            {endElement}
        </Box>
    );
}

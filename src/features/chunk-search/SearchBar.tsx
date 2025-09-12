import { HiMagnifyingGlass } from 'react-icons/hi2';

// Search bar component with icon, input field, and clear functionality
// Provides the main search interface as described in the feature guide

import React, { useCallback } from 'react';
import { Box, Input, ClearButton } from '@styles';
import { useSearchStore } from './store/useSearchStore';


// Props for the SearchBar component
interface SearchBarProps {
    placeholder?: string;
}


export function SearchBar({
    placeholder = 'Search...(CMD+K)',
}: SearchBarProps) {
    const { query, setQuery } = useSearchStore();

    const handleQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }, [setQuery]);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const endElement = query ? (
        <ClearButton
            onClick={() => {
                setQuery("");
                inputRef.current?.focus();
            }}
            aria-label="Clear search"
            style={{ marginLeft: -2 }}
        >
            ×
        </ClearButton>
    ) : undefined;
    return (
        <Box >
            <HiMagnifyingGlass />
            <Input
                ref={inputRef}
                placeholder={placeholder}
                value={query}
                onChange={handleQueryChange}

            />
            {endElement}
        </Box>
    );
}

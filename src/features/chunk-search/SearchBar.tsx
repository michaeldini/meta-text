import { HiMagnifyingGlass } from 'react-icons/hi2';

// Search bar component with icon, input field, and clear functionality
// Provides the main search interface as described in the feature guide

import React, { useCallback } from 'react';
import { Box, Input, Button } from '@styles';
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
        <Box noPad css={{ backgroundColor: 'transparent', borderRadius: 6, marginRight: 12, border: '1px solid $border', display: 'flex', alignItems: 'center' }}>
            <HiMagnifyingGlass />
            <Input
                ref={inputRef}
                placeholder={placeholder}
                value={query}
                onChange={handleQueryChange}
                css={{ padding: '0', color: '$altText' }}
            />
            {endElement}
        </Box>
    );
}

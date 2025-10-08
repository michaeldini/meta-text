import { HiMagnifyingGlass } from 'react-icons/hi2';

// Search bar component with icon, input field, and clear functionality
// Provides the main search interface as described in the feature guide

import React, { useCallback } from 'react';
import { Input, Row } from '@styles';
import { Button } from '@components/ui/button';

/* Get current search query from store */
import { useSearch } from './hooks/useSearch';


// Props for the SearchBar component
interface SearchBarProps {
    placeholder?: string;
}


export function SearchBar({
    placeholder = 'Search...(ctrl+k)',
}: SearchBarProps) {
    const { query, setQuery, clearSearch, registerSearchInput } = useSearch();

    const handleQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }, [setQuery]);

    const inputRef = React.useRef<HTMLInputElement>(null);

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
        <Row noPad variant="searchBar">
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
        </Row>
    );
}

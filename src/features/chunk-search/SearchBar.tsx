import { HiMagnifyingGlass } from 'react-icons/hi2';

// Search bar component with icon, input field, and clear functionality
// Provides the main search interface as described in the feature guide

import React, { useCallback } from 'react';
import { CloseButton, InputGroup, Input, Field } from '@chakra-ui/react';
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
        <CloseButton
            size="xs"
            onClick={() => {
                setQuery("");
                inputRef.current?.focus();
            }}
            me="-2"
        />
    ) : undefined
    return (

        <Field.Root orientation="horizontal">
            {/* <Field.Label color="fg" minWidth="fit-content">Search Chunks</Field.Label> */}
            <InputGroup
                startElement={<HiMagnifyingGlass />}
                endElement={endElement}
            >
                <Input
                    ref={inputRef}
                    placeholder={placeholder}
                    value={query}
                    onChange={handleQueryChange}
                    variant="outline"
                    size="md"
                    borderBottom="1px solid"
                />
            </InputGroup>
        </Field.Root>
    );
}

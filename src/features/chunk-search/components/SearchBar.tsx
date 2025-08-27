import { HiMagnifyingGlass } from 'react-icons/hi2';

// Search bar component with icon, input field, and clear functionality
// Provides the main search interface as described in the feature guide

import React, { useCallback } from 'react';
import { Box, CloseButton, InputGroup, Input, Field, ConditionalValue } from '@chakra-ui/react';
import { useSearchStore } from '../store/useSearchStore';


// Props for the SearchBar component
interface SearchBarProps {
    placeholder?: string;
    variant?: ConditionalValue<"outline" | "subtle" | "flushed" | undefined>
    size?: 'sm' | 'md';
}


export function SearchBar({
    placeholder = 'Search...(CMD+K)',
    variant = 'outline',
    size = 'sm',
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
        <Box >
            <Field.Root>
                <Field.Label color="fg">Search Chunks</Field.Label>

                <InputGroup startElement={<HiMagnifyingGlass />} endElement={endElement}>
                    <Input placeholder={placeholder} value={query} onChange={handleQueryChange} variant={variant} size={size} />
                </InputGroup>
            </Field.Root>
        </Box>
    );
}

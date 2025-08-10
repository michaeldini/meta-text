import { Icon } from '@components/icons/Icon';

// Search bar component with icon, input field, and clear functionality
// Provides the main search interface as described in the feature guide

import React, { useCallback } from 'react';
import { Box, CloseButton, InputGroup, Input, Field } from '@chakra-ui/react';
import { useSearchStore } from '../store/useSearchStore';


// Props for the SearchBar component
interface SearchBarProps {
    placeholder?: string;
    variant?: 'outlined' | 'filled' | 'standard';
    size?: 'small' | 'medium';
    fullWidth?: boolean;
}


export function SearchBar({
    placeholder = 'Search...(CMD+K)',
    variant = 'outlined',
    size = 'small',
    fullWidth = false
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

                <InputGroup startElement={<Icon name='Search' />} endElement={endElement}>
                    <Input placeholder={placeholder} value={query} onChange={handleQueryChange} />
                </InputGroup>
            </Field.Root>
        </Box>
    );
}

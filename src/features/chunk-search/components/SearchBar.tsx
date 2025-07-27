// Search bar component with icon, input field, and clear functionality
// Provides the main search interface as described in the feature guide

import React, { useCallback } from 'react';

import { Box, CloseButton, InputGroup, Input } from '@chakra-ui/react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { useSearchStore } from '../store/useSearchStore';
import { useSearch } from '../hooks/useSearch';


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
    const { clearSearch, error } = useSearch();

    const handleQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }, [setQuery]);

    const handleClear = useCallback(() => {
        clearSearch();
    }, [clearSearch]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        // Allow Escape key to clear search
        if (event.key === 'Escape') {
            clearSearch();
        }
    }, [clearSearch]);
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
            <InputGroup startElement={<HiMagnifyingGlass />} endElement={endElement}>
                <Input placeholder={placeholder} value={query} onChange={handleQueryChange} />
            </InputGroup>
            {/* <Textarea
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                variant={variant}
                size={size}
                fullWidth={fullWidth}
                error={!!error}
                helperText={error}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon
                                    size={20}
                                    color={theme.palette.text.secondary}
                                />
                            </InputAdornment>
                        ),
                        endAdornment: query ? (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClear}
                                    size="small"
                                    aria-label="Clear search"
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        '&:hover': {
                                            color: theme.palette.text.primary
                                        }
                                    }}
                                >
                                    <ClearIcon size={16} />
                                </IconButton>
                            </InputAdornment>
                        ) : null,
                    }
                }}
                sx={{
                    minWidth: 200,
                    maxWidth: 400,
                    '& .MuiFormHelperText-root': {
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: theme.spacing(0.5),
                        backgroundColor: theme.palette.background.paper,
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                        }
                    }
                }}
            /> */}
        </Box>
    );
}

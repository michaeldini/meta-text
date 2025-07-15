// Search bar component with icon, input field, and clear functionality
// Provides the main search interface as described in the feature guide

import React, { useCallback } from 'react';
import {
    TextField,
    InputAdornment,
    IconButton,
    Box,
    useTheme
} from '@mui/material';
import { SearchIcon, ClearIcon } from '../../../components/icons';
import { useSearchStore } from '../store/useSearchStore';
import { useSearch } from '../hooks/useSearch';

interface SearchBarProps {
    placeholder?: string;
    variant?: 'outlined' | 'filled' | 'standard';
    size?: 'small' | 'medium';
    fullWidth?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'Search...(CMD+K)',
    variant = 'outlined',
    size = 'small',
    fullWidth = false
}) => {
    const theme = useTheme();
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

    return (
        <Box sx={{ position: 'relative' }}>
            <TextField
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                variant={variant}
                size={size}
                fullWidth={fullWidth}
                error={!!error}
                helperText={error}
                InputProps={{
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
                    sx: {
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
                sx={{
                    minWidth: 200,
                    maxWidth: 400,
                    '& .MuiFormHelperText-root': {
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: theme.spacing(0.5)
                    }
                }}
            />
        </Box>
    );
};

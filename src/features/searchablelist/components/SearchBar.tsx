import React, { useCallback } from 'react';
import { Paper, TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, ClearIcon } from '../../../components/icons';

export interface SearchBarProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void;
    disabled?: boolean;
    fullWidth?: boolean;
    variant?: 'outlined' | 'filled' | 'standard';
    size?: 'small' | 'medium';
    ariaLabel?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    label = "Search",
    placeholder = "Search...",
    value,
    onChange,
    onClear,
    disabled = false,
    fullWidth = true,
    variant = 'outlined',
    size = 'medium',
    ariaLabel = "Search input"
}) => {
    const handleClear = useCallback(() => {
        onChange('');
        onClear?.();
    }, [onChange, onClear]);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    }, [onChange]);

    return (
        <Paper elevation={1} sx={{ p: 1 }}>
            <TextField
                data-testid="search-bar"
                fullWidth={fullWidth}
                label={label}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                variant={variant}
                size={size}
                aria-label={ariaLabel}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon style={{ width: 24, height: 24 }} />
                        </InputAdornment>
                    ),
                    endAdornment: value && (
                        <InputAdornment position="end">
                            <IconButton
                                data-testid="clear-search-bar"
                                onClick={handleClear}
                                edge="end"
                                size="small"
                                aria-label="Clear search"
                                disabled={disabled}
                            >
                                <ClearIcon style={{ width: 24, height: 24 }} />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Paper>
    );
};

export default SearchBar;

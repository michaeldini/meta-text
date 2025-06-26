import React, { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Paper, TextField, InputAdornment, Typography } from '@mui/material';
import { SearchIcon, ClearIcon } from '../../../components/icons';
import IconButton from '@mui/material/IconButton';
import DeleteButton from '../../../components/DeleteButton';
import { useFilteredList } from '../hooks/useFilteredList';
import { createSearchableListStyles } from '../styles';

import { useTheme } from '@mui/material/styles';

export interface SearchableListProps<T extends Record<string, any> & { id: number }> {
    items: T[];
    onItemClick: (id: number) => void;
    onDeleteClick: (id: number, event: React.MouseEvent) => void;
    deleteLoading?: Record<number, boolean>;
    filterKey: keyof T;
    searchPlaceholder?: string;
    emptyMessage?: string;
    ariaLabel?: string;
    title?: string; // New prop for title
}

function SearchableList<T extends Record<string, any> & { id: number }>({
    items = [],
    onItemClick,
    onDeleteClick,
    deleteLoading = {},
    filterKey,
    searchPlaceholder = "Search items...",
    emptyMessage = "No items found.",
    ariaLabel = "searchable list",
    title, // Destructure title
}: SearchableListProps<T>) {
    const [search, setSearch] = useState('');

    // Use the existing hook for filtering
    const filteredItems = useFilteredList(items, search, filterKey);

    const handleClearSearch = () => {
        setSearch('');
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleItemKeyDown = (event: React.KeyboardEvent, id: number) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onItemClick(id);
        }
    };

    const theme = useTheme();
    const styles = createSearchableListStyles(theme);

    return (
        <Paper elevation={3} role="region" aria-label={ariaLabel} sx={styles.root}>
            {/* Title (optional) */}
            {title && (
                <Typography variant="h6" fontWeight={600} component="div">
                    {title}
                </Typography>
            )}
            {/* Search Input */}
            <TextField
                data-testid="search-input"
                label="Search"
                placeholder={searchPlaceholder}
                variant="outlined"
                size="small"
                fullWidth
                margin="normal"
                value={search}
                onChange={handleSearchChange}
                aria-label="Search items"
                sx={styles.searchInput}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: search && (
                        <InputAdornment position="end">
                            <IconButton
                                data-testid="clear-search"
                                onClick={handleClearSearch}
                                edge="end"
                                size="small"
                                aria-label="Clear search"
                            >
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            {/* Search Results */}
            <List
                data-testid="searchable-list"
                role="list"
                aria-label={`${filteredItems.length} ${filteredItems.length === 1 ? 'item' : 'items'} found`}
            >
                {/* No Results */}
                {filteredItems.length === 0 ? (
                    <ListItem role="listitem" sx={styles.noResults}>
                        <ListItemText
                            primary={emptyMessage}
                        />
                    </ListItem>
                ) : (
                    // Render Results
                    filteredItems.map((item) => {
                        const displayText = String(item[filterKey] || '');
                        return (
                            <ListItem
                                key={item.id}
                                role="listitem"
                                secondaryAction={
                                    <DeleteButton
                                        onClick={(e: React.MouseEvent) => onDeleteClick(item.id, e)}
                                        disabled={!!deleteLoading[item.id]}
                                        label={`Delete ${displayText}`}

                                    />
                                }
                                disablePadding
                                sx={styles.listItem}
                            >
                                <ListItemButton
                                    onClick={() => onItemClick(item.id)}
                                    onKeyDown={(e) => handleItemKeyDown(e, item.id)}
                                    aria-label={`Select ${displayText}`}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <ListItemText
                                        primary={displayText}
                                        slotProps={{
                                            primary: {
                                                typography: 'h6',
                                                sx: { fontWeight: 'medium' }
                                            }
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })
                )}
            </List>
        </Paper>
    );
}

export default SearchableList;

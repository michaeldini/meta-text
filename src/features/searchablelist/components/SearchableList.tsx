import React, { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Paper, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import DeleteButton from '../../../components/DeleteButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFilteredList } from '../hooks/useFilteredList';

export interface SearchableListProps<T extends Record<string, any> & { id: number }> {
    items: T[];
    onItemClick: (id: number) => void;
    onDeleteClick: (id: number, event: React.MouseEvent) => void;
    deleteLoading?: Record<number, boolean>;
    filterKey: keyof T;
    searchPlaceholder?: string;
    emptyMessage?: string;
    ariaLabel?: string;
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

    return (
        <Paper elevation={3} role="region" aria-label={ariaLabel}>
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
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
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
            <List
                data-testid="searchable-list"
                role="list"
                aria-label={`${filteredItems.length} ${filteredItems.length === 1 ? 'item' : 'items'} found`}
            >
                {filteredItems.length === 0 ? (
                    <ListItem role="listitem">
                        <ListItemText
                            primary={emptyMessage}
                            sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}
                        />
                    </ListItem>
                ) : (
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
                                        icon={<DeleteIcon />}
                                    />
                                }
                                disablePadding
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

import React, { useState, useMemo } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Paper, TextField } from '@mui/material';
import DeleteButton from '../components/DeleteButton';
import { } from '../styles/pageStyles';

/**
 * SearchableList - Pure list with search and delete/navigation actions.
 *
 * Props:
 * - items: Array of objects with .id and filterKey (e.g., 'title')
 * - onItemClick: function(id) => void
 * - onDeleteClick: function(id, event) => void
 * - deleteLoading: object mapping id to loading state
 * - filterKey: string key to filter on (e.g., 'title')
 */
export default function SearchableList({
    items = [],
    onItemClick,
    onDeleteClick,
    deleteLoading = {},
    filterKey = 'title',
}) {
    const [search, setSearch] = useState('');

    // Filter items based on search and filterKey
    const filteredItems = useMemo(() => {
        if (!search) return items;
        return items.filter(item =>
            (item[filterKey] || '')
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [items, search, filterKey]);

    return (
        <Paper elevation={3} sx={{ padding: 2, maxHeight: '80vh', overflowY: 'auto' }} data-testid="searchable-list-paper">
            <nav aria-label="searchable list">
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    fullWidth
                    margin="normal"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    data-testid="search-input"
                />
                <List data-testid="searchable-list">
                    {filteredItems.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="No items found." />
                        </ListItem>
                    ) : (
                        filteredItems.map(obj => (
                            <React.Fragment key={obj.id}>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => onItemClick(obj.id)}>
                                        <ListItemText
                                            primary={obj[filterKey]}
                                            slotProps={{ primary: { typography: 'h5' } }}
                                        />
                                        <DeleteButton
                                            onClick={e => onDeleteClick(obj.id, e)}
                                            disabled={!!deleteLoading[obj.id]}
                                            label="Delete"
                                        />
                                    </ListItemButton>
                                </ListItem>
                                {/* Removed deleteError display */}
                            </React.Fragment>
                        ))
                    )}
                </List>
            </nav>
        </Paper>
    );
}

import React, { useState, useMemo } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Paper, TextField } from '@mui/material';
import DeleteButton from '../components/DeleteButton';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import { } from '../styles/pageStyles';

/**
 * SearchableList - Combines a search bar and a list with delete/navigation actions.
 *
 * Props:
 * - items: Array of objects with .id and filterKey (e.g., 'title')
 * - onItemClick: function(id) => void
 * - onDeleteClick: function(id, event) => Promise<void> (async delete handler)
 * - deleteLoading: object mapping id to loading state
 * - deleteError: object mapping id to error string
 * - filterKey: string key to filter on (e.g., 'title')
 */
export default function SearchableList({
    items = [],
    onItemClick,
    onDeleteClick,
    deleteLoading = {},
    deleteError = {},
    filterKey = 'title',
}) {
    const [search, setSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Filter items based on search and filterKey
    const filteredItems = useMemo(() => {
        if (!search) return items;
        return items.filter(item =>
            (item[filterKey] || '')
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [items, search, filterKey]);

    // Handle delete button click
    const handleDeleteClick = (id, e) => {
        e.stopPropagation();
        setDeleteTarget(id);
        setDialogOpen(true);
    };

    // Handle dialog close
    const handleDialogClose = () => {
        setDialogOpen(false);
        setDeleteTarget(null);
    };

    // Handle confirm delete
    const handleDialogConfirm = async () => {
        if (deleteTarget) {
            await onDeleteClick(deleteTarget);
        }
        setDialogOpen(false);
        setDeleteTarget(null);
    };

    // Get the name of the item to delete for dialog
    const deleteItemName = deleteTarget
        ? (items.find(item => item.id === deleteTarget)?.[filterKey] || 'this item')
        : '';

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
                                            onClick={e => handleDeleteClick(obj.id, e)}
                                            disabled={!!deleteLoading[obj.id]}
                                            label="Delete"
                                        />
                                    </ListItemButton>
                                </ListItem>
                                {deleteError[obj.id] && (
                                    <ListItem>
                                        <ListItemText
                                            primary={deleteError[obj.id]}
                                            slotProps={{ primary: { color: 'error', variant: 'body2' } }}
                                        />
                                    </ListItem>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </List>
                <DeleteConfirmationDialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    onConfirm={handleDialogConfirm}
                    title={`Delete "${deleteItemName}"?`}
                    text={`Are you sure you want to delete "${deleteItemName}"? This action cannot be undone.`}
                />
            </nav>
        </Paper>
    );
}

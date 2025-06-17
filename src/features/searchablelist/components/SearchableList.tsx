import React, { useState, useMemo } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Paper, TextField } from '@mui/material';
import DeleteButton from '../../../components/DeleteButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { searchableList } from '../../../styles/pageStyles';

export interface SearchableListProps<T extends { id: number; title: string }> {
    items: T[];
    onItemClick: (id: number) => void;
    onDeleteClick: (id: number, event: React.MouseEvent) => void;
    deleteLoading?: Record<number, boolean>;
    filterKey: keyof T;
}

function SearchableList<T extends { id: number; title: string }>({
    items = [],
    onItemClick,
    onDeleteClick,
    deleteLoading = {},
    filterKey,
}: SearchableListProps<T>) {
    const [search, setSearch] = useState('');

    // Filter items based on search and filterKey
    const filteredItems = useMemo(() => {
        if (!search) return items;
        return items.filter(item =>
            (String(item[filterKey]) || '')
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [items, search, filterKey]);

    return (
        <Paper elevation={3} sx={searchableList} >
            <nav aria-label="searchable list">
                <TextField
                    data-testid="search-input"
                    label="Search"
                    variant="outlined"
                    size="small"
                    fullWidth
                    margin="normal"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <List data-testid="searchable-list">
                    {filteredItems.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="No items found." />
                        </ListItem>
                    ) : (
                        filteredItems.map((obj) => (
                            <ListItem
                                key={obj.id}
                                secondaryAction={
                                    <DeleteButton
                                        onClick={(e: React.MouseEvent) => onDeleteClick(obj.id, e)}
                                        disabled={!!deleteLoading[obj.id]}
                                        label="Delete"
                                        icon={<DeleteIcon />}
                                    />
                                }
                                disablePadding
                            >
                                <ListItemButton onClick={() => onItemClick(obj.id)}>
                                    <ListItemText
                                        primary={String(obj[filterKey])}
                                        slotProps={{ primary: { typography: 'h5' } }}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))
                    )}
                </List>
            </nav>
        </Paper>
    );
}

export default SearchableList;

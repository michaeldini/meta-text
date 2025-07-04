import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { List, ListItem, ListItemButton, ListItemText, Paper, TextField, InputAdornment, Typography, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ErrorBoundary, LoadingBoundary, DeleteButton } from 'components';
import { SearchIcon, ClearIcon } from 'icons';
import { useDocumentsStore, useNotifications } from 'store';

import { useFilteredList } from '../hooks/useFilteredList';
import { createSearchableListStyles } from '../styles';
import type { MetaTextSummary, SourceDocumentSummary, } from 'types'

export interface SearchableListProps {
    title: string;
    filterKey: keyof (SourceDocumentSummary | MetaTextSummary);
    items: Array<SourceDocumentSummary | MetaTextSummary>;
    // onItemClick: (id: number) => void;
    // onDeleteClick: (id: number, event: React.MouseEvent) => void;
    deleteLoading?: Record<number, boolean>;
    searchPlaceholder?: string;
    emptyMessage?: string;
    ariaLabel?: string;
    loading?: boolean;
}

function SearchableList({
    items = [],
    filterKey,
    title,
    loading = false,
}: SearchableListProps) {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const { deleteSourceDoc, deleteMetaText } = useDocumentsStore();
    const { showSuccess, showError } = useNotifications();
    console.log('SearchableList items:', items);
    // Determine doc type by inspecting the first item or the title
    const docType = title === 'sourceDoc' || (items[0] && 'author' in items[0]) ? 'sourceDoc' : 'metaText';

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
            handleItemClick(id);
        }
    };

    const handleItemClick = (id: number) => {
        if (docType === 'sourceDoc') {
            navigate(`/source-document/${id}`);
        } else {
            navigate(`/metaText/${id}`);
        }
    };

    const handleDeleteClick = async (id: number) => {
        try {
            if (docType === 'sourceDoc') {
                await deleteSourceDoc(id);
            } else {
                await deleteMetaText(id);
            }
            showSuccess('Deleted successfully');
        } catch {
            showError('Delete failed');
        }
    };

    const theme = useTheme();
    const styles = createSearchableListStyles(theme);

    // Extract adornments to constants for better readability
    const startAdornment = (
        <InputAdornment position="start">
            <SearchIcon />
        </InputAdornment>
    );

    const endAdornment = search && (
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
    );

    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loading}>
                <Box sx={styles.root}>
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
                        placeholder="Search items..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="normal"
                        value={search}
                        onChange={handleSearchChange}
                        aria-label="Search items"
                        sx={styles.searchInput}
                        slotProps={{
                            input: {
                                startAdornment,
                                endAdornment,
                            },
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
                                    primary="No items found."
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
                                                onClick={(e: React.MouseEvent) => handleDeleteClick(item.id)}
                                                disabled={false}
                                                label={`Delete ${displayText}`}

                                            />
                                        }
                                        disablePadding
                                        sx={styles.listItem}
                                    >
                                        <ListItemButton
                                            onClick={() => handleItemClick(item.id)}
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
                </Box>
            </LoadingBoundary>
        </ErrorBoundary>
    );
}

export default SearchableList;

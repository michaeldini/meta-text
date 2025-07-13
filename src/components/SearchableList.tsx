// A list component that allows searching and displaying a list of items with delete functionality.
// This component supports filtering, navigation, and deletion of items.

import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { List, ListItem, ListItemButton, ListItemText, Paper, TextField, InputAdornment, Typography, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ErrorBoundary, LoadingBoundary, DeleteButton } from 'components';
import { SearchIcon, ClearIcon } from 'icons';
import { useDocumentsStore, useNotifications } from 'store';

import { useFilteredList } from 'hooks';
import { getAppStyles } from 'styles';
import type { MetaTextSummary, SourceDocumentSummary } from 'types';

export interface SearchableListProps {
    title: string;
    filterKey: keyof (SourceDocumentSummary | MetaTextSummary);
    items: Array<SourceDocumentSummary | MetaTextSummary>;
    deleteLoading?: Record<number, boolean>;
    searchPlaceholder?: string;
    emptyMessage?: string;
    ariaLabel?: string;
    loading?: boolean;
}

function SearchableList({
    title,
    filterKey,
    items = [],
    loading = false,
}: SearchableListProps) {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const { deleteSourceDoc, deleteMetaText } = useDocumentsStore();
    const { showSuccess, showError } = useNotifications();

    // Determine document type based on title or item properties
    const docType = title === 'Source Documents' ? 'sourceDoc' : 'metatext';

    // Filter items using the provided hook
    const filteredItems = useFilteredList(items, search, filterKey);

    // Handlers for search input
    const handleClearSearch = () => setSearch('');
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

    // Handlers for item interactions
    const handleItemKeyDown = (event: React.KeyboardEvent, id: number) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleItemClick(id);
        }
    };

    const handleItemClick = (id: number) => {
        navigate(docType === 'sourceDoc' ? `/sourcedoc/${id}` : `/metatext/${id}`);
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
    const styles = getAppStyles(theme);

    // Input adornments for search field
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
                <Paper sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
                    <Box sx={{ mb: 3 }}>
                        {/* Display title if provided */}
                        {title && (
                            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                                Browse {title}
                            </Typography>
                        )}
                    </Box>

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
                        sx={styles.searchableList.searchInput}
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
                            <ListItem role="listitem" sx={styles.searchableList.noResults}>
                                <ListItemText primary="No items found." />
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
                                        sx={styles.searchableList.listItem}
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
                                                        sx: { fontWeight: 'medium' },
                                                    },
                                                }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })
                        )}
                    </List>
                </Paper>
            </LoadingBoundary>
        </ErrorBoundary>
    );
}

export default SearchableList;

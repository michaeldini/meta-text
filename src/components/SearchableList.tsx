// A list component that allows searching and displaying a list of items with delete functionality.
// This component supports filtering, navigation, and deletion of items.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CloseButton, Heading, Input, InputGroup, List } from '@chakra-ui/react'

import { ErrorBoundary, LoadingBoundary, DeleteButton, Field } from 'components';
import { SearchIcon } from 'icons';
import { useDeleteSourceDocument, useDeleteMetatext } from 'features/documents/useDocumentsData';

import { useFilteredList } from 'hooks';
import type { MetatextSummary, SourceDocumentSummary } from 'types';

export interface SearchableListProps {
    title: string;
    filterKey: keyof (SourceDocumentSummary | MetatextSummary);
    items: Array<SourceDocumentSummary | MetatextSummary>;
    deleteLoading?: Record<number, boolean>;
    searchPlaceholder?: string;
    emptyMessage?: string;
    ariaLabel?: string;
    loading?: boolean;
}

export function SearchableList(props: SearchableListProps): React.ReactElement {

    const { title, filterKey, items = [], loading = false, emptyMessage, searchPlaceholder } = props;
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const deleteSourceDocMutation = useDeleteSourceDocument();
    const deleteMetatextMutation = useDeleteMetatext();

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
        if (docType === 'sourceDoc') {
            await deleteSourceDocMutation.mutateAsync(id);
        } else {
            await deleteMetatextMutation.mutateAsync(id);
        }
    };


    const inputRef = React.useRef<HTMLInputElement>(null);
    const endElement = search ? (
        <CloseButton
            size="xs"
            onClick={() => {
                setSearch("");
                inputRef.current?.focus();
            }}
            me="-2"
        />
    ) : undefined

    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loading}>
                <Box>
                    <Box >
                        {/* Display title if provided */}
                        {title && (
                            <Heading>
                                Browse {title}
                            </Heading>
                        )}
                    </Box>

                    {/* Search Input */}
                    <Field
                        data-testid="search-input"
                        helperText="Search..."
                        aria-label="Search items"
                    />
                    <InputGroup startElement={<SearchIcon />} endElement={endElement}>
                        <Input placeholder={searchPlaceholder} value={search} onChange={handleSearchChange} />
                    </InputGroup>

                    {/* Search Results */}
                    <List.Root
                        data-testid="searchable-list"
                        role="list"
                        aria-label={`${filteredItems.length} ${filteredItems.length === 1 ? 'item' : 'items'} found`}
                    >
                        {/* No Results */}
                        {filteredItems.length === 0 ? (
                            <Box >
                                {emptyMessage || `No ${title} found.`}
                            </Box>
                        ) : (
                            // Render Results
                            filteredItems.map((item) => {
                                const displayText = String(item[filterKey] || '');
                                return (
                                    <List.Item
                                        key={item.id}
                                        role="listitem"
                                    >
                                        <List.Indicator>
                                            <Button
                                                data-testid={`item-${item.id}`}
                                                variant="ghost"
                                                onClick={() => handleItemClick(item.id)}
                                                onKeyDown={(e) => handleItemKeyDown(e, item.id)}
                                                aria-label={`Select ${displayText}`}
                                                role="button"
                                                tabIndex={0}
                                                me={10}
                                                size="lg"
                                            >
                                                {displayText}
                                            </Button>

                                            <DeleteButton
                                                onClick={(e: React.MouseEvent) => handleDeleteClick(item.id)}
                                                disabled={
                                                    docType === 'sourceDoc'
                                                        ? deleteSourceDocMutation.status === 'pending'
                                                        : deleteMetatextMutation.status === 'pending'
                                                }
                                                label={`Delete ${displayText}`}
                                            />
                                        </List.Indicator>
                                    </List.Item>
                                );
                            })
                        )}
                    </List.Root>
                </Box>
            </LoadingBoundary>
        </ErrorBoundary>
    );
}

export default SearchableList;

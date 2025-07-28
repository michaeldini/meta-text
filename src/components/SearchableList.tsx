// A list component that allows searching and displaying a list of items with delete functionality.
// This component supports filtering, navigation, and deletion of items.

import React from 'react';
import { Input, InputGroup } from '@chakra-ui/react/input';
import { Box } from '@chakra-ui/react/box';
import { List } from '@chakra-ui/react/list';
import { CloseButton } from '@chakra-ui/react/button';
import { Heading } from '@chakra-ui/react/typography';
import { HiMagnifyingGlass, HiOutlineTrash } from "react-icons/hi2";
import { ErrorBoundary, LoadingBoundary, Field, TooltipButton } from 'components';
import type { MetatextSummary, SourceDocumentSummary } from 'types';
import { useSearchableList } from '../hooks/useSearchableList';



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
    const {
        title,
        filterKey,
        items = [],
        loading = false,
        emptyMessage,
        searchPlaceholder
    } = props;

    // Use custom hook for all state and logic
    const {
        search,
        setSearch,
        inputRef,
        filteredItems,
        handleSearchChange,
        handleItemClick,
        handleItemKeyDown,
        handleDeleteClick,
        deleteSourceDocMutation,
        deleteMetatextMutation,
        docType
    } = useSearchableList({ title, filterKey, items, searchPlaceholder });

    const endElement = search ? (
        <CloseButton
            size="xs"
            onClick={() => {
                setSearch("");
                inputRef.current?.focus();
            }}
            me="-2"
        />
    ) : undefined;

    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loading}>
                <Box>

                    {/* Title */}
                    {title && (
                        <Heading pb="4">
                            Browse {title}
                        </Heading>
                    )}

                    {/* Search Input */}
                    <Field
                        data-testid="search-input"
                        helperText="Search..."
                        aria-label="Search items"
                    />
                    <InputGroup startElement={<HiMagnifyingGlass />} endElement={endElement}>
                        <Input
                            ref={inputRef}
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </InputGroup>

                    {/* List of items */}
                    <List.Root
                        data-testid="searchable-list"
                        role="list"
                        aria-label={`${filteredItems.length} ${filteredItems.length === 1 ? 'item' : 'items'} found`}
                    >
                        {filteredItems.length === 0 ? (
                            <List.Item>
                                {emptyMessage || `No ${title} found.`}
                            </List.Item>
                        ) : (
                            filteredItems.map((item: SourceDocumentSummary | MetatextSummary) => {
                                const displayText = String(item[filterKey] || '');
                                return (
                                    <List.Item key={item.id} role="listitem">
                                        <List.Indicator>
                                            <TooltipButton
                                                label={`${displayText}`}
                                                tooltip={`Select ${displayText}`}
                                                data-testid={`item-${item.id}`}
                                                onClick={() => handleItemClick(item.id)}
                                                onKeyDown={(e) => handleItemKeyDown(e, item.id)}
                                                tabIndex={0}
                                                me={10}
                                            />
                                            <TooltipButton
                                                label=""
                                                tooltip={`Delete ${displayText}`}
                                                icon={<HiOutlineTrash />}
                                                data-testid={`delete-button-${item.id}`}
                                                onClick={() => { handleDeleteClick(item.id); }}
                                                disabled={
                                                    docType === 'sourceDoc'
                                                        ? deleteSourceDocMutation.status === 'pending'
                                                        : deleteMetatextMutation.status === 'pending'
                                                }
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

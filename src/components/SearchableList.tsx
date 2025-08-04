// A list component that allows searching and displaying a list of items with delete functionality.
// This component supports filtering, navigation, and deletion of items.

import React from 'react';
import { Input } from '@chakra-ui/react/input';
import { InputGroup } from '@chakra-ui/react/input-group';
import { Stack } from '@chakra-ui/react/stack';
import { Box } from '@chakra-ui/react/box';
import { List } from '@chakra-ui/react/list';
import { CloseButton } from '@chakra-ui/react/button';
import { Heading } from '@chakra-ui/react/heading';
import { Text } from '@chakra-ui/react/text';
import { HiMagnifyingGlass, HiOutlineTrash } from "react-icons/hi2";
import { Boundary } from '@components/Boundaries';
import { Field } from '@components/ui/field';
import { TooltipButton } from '@components/TooltipButton'
import { Spinner } from '@chakra-ui/react/spinner';
import type { MetatextSummary, SourceDocumentSummary } from '@mtypes/documents';
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
        <Boundary fallback={<Spinner aria-label="Loading list" />}>
            <Box minWidth="300px" >
                {/* Title */}
                {title && (
                    <Heading py={2} size="4xl" >
                        Open
                    </Heading>
                )}
                {/* Search Input */}
                <InputGroup startElement={<HiMagnifyingGlass />} endElement={endElement} py="2">
                    <Input
                        ref={inputRef}
                        // placeholder={searchPlaceholder}
                        placeholder="Search..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                </InputGroup>
                {/* List of items */}
                {/* <Text> Documents</Text>. */}
                <List.Root
                    data-testid="searchable-list"
                    role="list"
                    aria-label={`${filteredItems.length} ${filteredItems.length === 1 ? 'item' : 'items'} found`}
                    variant="plain"
                    align="center"
                    py={4}

                >
                    {filteredItems.length === 0 ? (
                        <List.Item>
                            {emptyMessage || `No ${title} found.`}
                        </List.Item>
                    ) : (
                        filteredItems.map((item: SourceDocumentSummary | MetatextSummary) => {
                            const displayText = String(item[filterKey] || '');
                            return (
                                <List.Item key={item.id} role="listitem" width="100%">
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
                                        <TooltipButton
                                            label={`${displayText}`}
                                            tooltip={`View ${displayText} Metatext`}
                                            data-testid={`item-${item.id}`}
                                            onClick={() => handleItemClick(item.id)}
                                            onKeyDown={(e) => handleItemKeyDown(e, item.id)}
                                            tabIndex={0}
                                            paddingX="0"
                                            _hover={{ textDecoration: 'underline' }}
                                            width="auto"
                                            bg="bg.subtle"
                                            p="2"
                                            m="1"
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
                                            _hover={{ color: 'red.500' }}
                                            color="fg.muted"
                                            width="auto"
                                        />
                                    </Stack>
                                </List.Item>
                            );
                        })
                    )}
                </List.Root>
            </Box>
        </Boundary>
    );
}

export default SearchableList;

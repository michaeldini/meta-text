/**
 * SearchableTable.tsx
 * This file contains components and hooks for creating a searchable table interface.
 * It includes a search input, controlled table, and table row components and a hook for managing search results.
 */
import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, InputGroup, CloseButton, Box, Heading } from '@chakra-ui/react';
import { HiMagnifyingGlass } from "react-icons/hi2";
import { MetatextSummary, SourceDocumentSummary } from '@mtypes/index';
import { Table } from '@chakra-ui/react';
import { HiOutlineTrash } from "react-icons/hi2";
import { TooltipButton } from '@components/TooltipButton';
import { UseMutationResult } from '@tanstack/react-query';



// useSearchResults: Hook to manage search/filter state and results
// returns results that can be passed to a table component
export function useSearchResults(items: Array<SourceDocumentSummary | MetatextSummary>) {
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const results = useMemo(() => {
        if (!search) return items;
        return items.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
    }, [items, search]);
    return { search, setSearch, inputRef, results };
}


// SearchInput: Component for the search input field
// Accepts search state and a setter function, with an optional ref for focus management
export interface SearchInputProps {
    search: string;
    setSearch: (value: string) => void;
    inputRef?: React.RefObject<HTMLInputElement | null>;
}

// Utility function to clear search and focus input
function clearSearchAndFocus(setSearch: (value: string) => void, inputRef?: React.RefObject<HTMLInputElement | null>) {
    setSearch("");
    if (inputRef?.current) {
        inputRef.current.focus();
    }
}

export function SearchInput({ search, setSearch, inputRef }: SearchInputProps) {
    return (
        <Box minWidth="300px">
            {/* <Heading size="2xl">Open</Heading> */}
            <Heading size="sub">Open</Heading>
            <InputGroup startElement={<HiMagnifyingGlass />} endElement={search ? (
                <CloseButton
                    size="xs"
                    py="2"
                    me="-2"
                    onClick={() => clearSearchAndFocus(setSearch, inputRef)}
                />
            ) : undefined}>
                <Input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </InputGroup>
        </Box>
    );
}
// Example usage: combine useSearchResults, SearchInput, and ControlledTable
//
// export function SearchableTableWithSearch(props: Omit<ControlledTableProps, 'items'> & { items: Array<{ id: string | number; title: string }> }) {
//   const { items, ...tableProps } = props;
//   const { search, setSearch, inputRef, results } = useSearchResults(items);
//   return (
//     <Box>
//       <SearchInput search={search} setSearch={setSearch} inputRef={inputRef} />
//       <ControlledTable {...tableProps} items={results} />
//     </Box>
//   );
// }



// Simple table row component to keep the code clean
export interface TableRowProps {
    item: SourceDocumentSummary | MetatextSummary;
    navigate: (path: string) => void;
    navigateToBase: string;
    deleteItemMutation: UseMutationResult<any, any, any, any>;
}

export function TableRow({ item, navigate, navigateToBase, deleteItemMutation }: TableRowProps) {
    return (
        <Table.Row key={item.id} bg="none">
            <Table.Cell>
                <TooltipButton
                    label={item.title}
                    tooltip={`View ${item.title}`}
                    data-testid={`item-${item.id}`}
                    onClick={() => navigate(`${navigateToBase}${item.id}`)}
                    tabIndex={0}
                    _hover={{ textDecoration: 'underline' }}
                    width="auto"
                    pl="2"
                />
            </Table.Cell>
            <Table.Cell textAlign="center">
                <TooltipButton
                    label=""
                    tooltip={`Delete ${item.title}`}
                    icon={<HiOutlineTrash />}
                    data-testid={`delete-button-${item.id}`}
                    onClick={() => deleteItemMutation.mutate(item.id)}
                    _hover={{ color: 'red.500' }}
                    color="fg.muted"
                    width="auto"
                />
            </Table.Cell>
        </Table.Row>
    );
}



// ControlledTable: Pass the search results to this component
export interface ControlledTableProps {
    items: Array<SourceDocumentSummary | MetatextSummary>;
    navigateToBase: string;
    deleteItemMutation: UseMutationResult<any, any, any, any>;
}


export function ControlledTable({ items, navigateToBase, deleteItemMutation }: ControlledTableProps) {
    const navigate = useNavigate();

    // If no items are provided, display a message
    if (!items || items.length === 0) {
        return (
            <Box p={4} textAlign="center" color="fg.muted">
                No documents found.
            </Box>
        );
    }

    // Render the table with items
    return (
        <Table.ScrollArea borderWidth="1px" rounded="md" maxW="2xl" maxH="300px" >
            <Table.Root size="sm" stickyHeader >
                <Table.Header>
                    <Table.Row bg="bg.subtle">
                        <Table.ColumnHeader minW="220px">Title</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center"></Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body bg="none">
                    {items.map((item) => (
                        <TableRow key={item.id}
                            item={item}
                            navigate={navigate}
                            navigateToBase={navigateToBase}
                            deleteItemMutation={deleteItemMutation} />
                    ))}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
}



/* eslint-disable react-refresh/only-export-components */
/**
 * SearchableTable.tsx
 * This file contains components and hooks for creating a searchable table interface.
 * It includes a search input, controlled table, and table row components and a hook for managing search results.
*/
import React, { useState, useRef, useMemo } from 'react';
import { HiMagnifyingGlass, HiOutlineTrash } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { MetatextSummary, SourceDocumentSummary } from '@mtypes/index';
import { TooltipButton } from '@components/TooltipButton';
import { UseMutationResult } from '@tanstack/react-query';
import { styled, Box, Heading, Input, ClearButton } from '@styles';

// useSearchResults: Hook to manage search/filter state and results
// returns results that can be passed to a table component
export function useSearchResults(items: Array<SourceDocumentSummary | MetatextSummary>) {
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const results = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return items;
        return items.filter(item => item.title.toLowerCase().includes(q));
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

const InputGroupDiv = styled('div', {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
});

const IconLeft = styled('span', {
    display: 'inline-flex',
    alignItems: 'center',
    color: 'gray',
});

const InputStyled = Input;

export function SearchInput({ search, setSearch, inputRef }: SearchInputProps) {
    return (
        <InputGroupDiv>
            <IconLeft aria-hidden>
                <HiMagnifyingGlass />
            </IconLeft>
            <InputStyled
                ref={inputRef as any}
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search"
            />
            {search ? (
                <ClearButton onClick={() => clearSearchAndFocus(setSearch, inputRef)} aria-label="Clear search">
                    ×
                </ClearButton>
            ) : null}
        </InputGroupDiv>
    );
}

// Simple table row component to keep the code clean
export interface TableRowProps {
    item: SourceDocumentSummary | MetatextSummary;
    navigate: (path: string) => void;
    navigateToBase: string;
    deleteItemMutation: UseMutationResult<unknown, unknown, number, unknown>;
}

export function TableRow({ item, navigate, navigateToBase, deleteItemMutation }: TableRowProps) {
    const base = navigateToBase.endsWith('/') ? navigateToBase : `${navigateToBase}/`;
    return (
        <tr key={item.id}>
            <td>
                <div style={{ width: '100%' }}>
                    <div
                        onClick={() => navigate(`${base}${item.id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') navigate(`${base}${item.id}`); }}
                        style={{ width: '100%', cursor: 'pointer' }}
                        aria-label={`View ${item.title}`}
                    >
                        <TooltipButton
                            label={item.title}
                            tooltip={`View ${item.title}`}
                            data-testid={`item-${item.id}`}
                            tabIndex={-1}
                            style={{ width: '100%', textAlign: 'left' }}
                        />
                    </div>
                </div>
            </td>
            <td style={{ textAlign: 'center' }}>
                <TooltipButton
                    label=""
                    tooltip={`Delete ${item.title}`}
                    icon={<HiOutlineTrash />}
                    data-testid={`delete-button-${item.id}`}
                    onClick={() => deleteItemMutation.mutate(item.id)}
                    style={{ width: 'auto' }}
                />
            </td>
        </tr>
    );
}

// ControlledTable: Pass the search results to this component
export interface ControlledTableProps {
    items: Array<SourceDocumentSummary | MetatextSummary>;
    navigateToBase: string;
    deleteItemMutation: UseMutationResult<unknown, unknown, number, unknown>;
}

export function ControlledTable({ items, navigateToBase, deleteItemMutation }: ControlledTableProps) {
    const navigate = useNavigate();

    // If no items are provided, display a message
    if (!items || items.length === 0) {
        const Empty = styled('div', {
            padding: '16px',
            textAlign: 'center',
            color: '$colors$subtle',
        });
        return (
            <Empty>No documents found.</Empty>
        );
    }

    // Render the table with items
    const TableScrollArea = styled('div', {
        maxHeight: '32rem',
        overflow: 'auto',
    });

    const TableRoot = styled('table', {
        width: '100%',
        borderCollapse: 'collapse',
    });

    const THead = styled('thead', {
        position: 'sticky',
        top: 0,
        background: 'transparent',
    });

    const TRow = styled('tr', {
        background: 'transparent',
    });

    const Th = styled('th', {
        textAlign: 'left',
        padding: '8px',
        fontWeight: 600,
        borderBottom: '1px solid $colors$border',
    });

    const TBody = styled('tbody', {
        background: 'transparent',
    });

    return (
        <TableScrollArea>
            <TableRoot>
                <THead>
                    <TRow>
                        <Th>Title</Th>
                    </TRow>
                </THead>
                <TBody>
                    {items.map((item) => (
                        <TableRow key={item.id}
                            item={item}
                            navigate={navigate}
                            navigateToBase={navigateToBase}
                            deleteItemMutation={deleteItemMutation} />
                    ))}
                </TBody>
            </TableRoot>
        </TableScrollArea>
    );
}

interface SearchableTableProps {
    documents: Array<SourceDocumentSummary | MetatextSummary>;
    title: string;
    navigateToBase: string;
    // eslint - disable - next - line-- required shape
    deleteItemMutation: UseMutationResult<unknown, unknown, number, unknown>;
}

export function SearchableTable({ documents, title, navigateToBase, deleteItemMutation }: SearchableTableProps) {
    const { search, setSearch, inputRef, results } = useSearchResults(documents);

    const TableContainer = styled(Box, {
        padding: '16px',
        minWidth: '20rem',
        boxSizing: 'border-box',
    });

    return (
        <TableContainer>
            {title && <Heading>{title}</Heading>}
            <SearchInput
                search={search}
                setSearch={setSearch}
                inputRef={inputRef}
            />
            <ControlledTable
                items={results}
                navigateToBase={navigateToBase}
                deleteItemMutation={deleteItemMutation}
            />
        </TableContainer>
    );
}

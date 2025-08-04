// Custom hook for managing searchable list state and interactions.
// Used by multiple pages/components to provide search, filtering, navigation, and deletion logic.
import React, { useMemo } from 'react';

// React Router for navigation
import { useNavigate } from 'react-router-dom';

// Custom hook for filtering lists based on search input
// import { useFilteredList } from '@hooks/useFilteredList';

// Type for the mutation result, metatext, and source document
import type { UseMutationResult } from '@tanstack/react-query';
import type { MetatextSummary, SourceDocumentSummary } from '@mtypes/documents';



interface UseSearchableListProps {
    navigateToBase: string;
    filterKey: keyof (SourceDocumentSummary | MetatextSummary);
    items: Array<SourceDocumentSummary | MetatextSummary>;
    deleteItemMutation: UseMutationResult<any, any, any, any>;
}

export function useSearchableList({ navigateToBase, filterKey, items, deleteItemMutation }: UseSearchableListProps) {

    // State for search input
    const [search, setSearch] = React.useState('');

    // Reference for the search input element
    // This will get attached to the input element for focus management
    // and clearing the search.
    // The ref allows components to access the input element directly.
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Filtered items based on search input (Results that match the search query)
    const filteredItems = useFilteredList(items, search, filterKey);

    // Handler for search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

    // Navigate to the item detail page when an item is clicked
    const navigate = useNavigate();
    const handleItemClick = (id: number) => {
        navigate(navigateToBase + `${id}`);
    };

    // Handle deletion of an item
    const handleDeleteClick = async (id: number) => {
        await deleteItemMutation.mutateAsync(id);
    };

    return {
        search,
        setSearch,
        inputRef,
        filteredItems,
        handleSearchChange,
        handleItemClick,
        handleDeleteClick,
    };
}




export function useFilteredList(
    items: Array<SourceDocumentSummary | MetatextSummary>,
    search: string,
    keyOrFn?: keyof (SourceDocumentSummary | MetatextSummary) | ((item: (SourceDocumentSummary | MetatextSummary), search: string) => boolean)
): Array<SourceDocumentSummary | MetatextSummary> {
    return useMemo(() => {
        if (!search || !search.trim()) return items;

        if (typeof keyOrFn === 'function') {
            return items.filter(item => keyOrFn(item, search));
        }

        if (keyOrFn && typeof keyOrFn !== 'function') {
            return items.filter(item => {
                const value = item[keyOrFn];
                if (value == null) return false;
                return String(value).toLowerCase().includes(search.toLowerCase().trim());
            });
        }

        // Fallback: search all string properties if no key specified
        return items.filter(item => {
            return Object.values(item as Record<string, any>).some(value => {
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(search.toLowerCase().trim());
                }
                return false;
            });
        });
    }, [items, search, keyOrFn]);
}


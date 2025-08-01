// Custom hook for managing searchable list state and interactions.
// Used by multiple pages/components to provide search, filtering, navigation, and deletion logic.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteSourceDocument, useDeleteMetatext } from '../features/documents/useDocumentsData';
import { useFilteredList } from '@hooks/useFilteredList';
import type { MetatextSummary, SourceDocumentSummary } from '@mtypes/documents';

interface UseSearchableListProps {
    title: string;
    filterKey: keyof (SourceDocumentSummary | MetatextSummary);
    items: Array<SourceDocumentSummary | MetatextSummary>;
    searchPlaceholder?: string;
}

export function useSearchableList({ title, filterKey, items, searchPlaceholder }: UseSearchableListProps) {
    const [search, setSearch] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const deleteSourceDocMutation = useDeleteSourceDocument();
    const deleteMetatextMutation = useDeleteMetatext();
    const docType = title === 'Source Documents' ? 'sourceDoc' : 'metatext';
    const filteredItems = useFilteredList(items, search, filterKey);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);
    const handleItemClick = (id: number) => {
        navigate(docType === 'sourceDoc' ? `/sourcedoc/${id}` : `/metatext/${id}`);
    };
    const handleItemKeyDown = (event: React.KeyboardEvent, id: number) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleItemClick(id);
        }
    };
    const handleDeleteClick = async (id: number) => {
        if (docType === 'sourceDoc') {
            await deleteSourceDocMutation.mutateAsync(id);
        } else {
            await deleteMetatextMutation.mutateAsync(id);
        }
    };

    return {
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
        docType,
        searchPlaceholder,
    };
}

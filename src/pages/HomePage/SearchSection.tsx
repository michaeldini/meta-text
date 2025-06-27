import React from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingBoundary from '../../components/LoadingBoundary';
import SearchableList from '../../features/searchablelist/components/SearchableList';
import { Box } from '@mui/material';
import { DocType } from '../../types/docTypes';

export interface SearchSectionProps {
    loading: boolean;
    items: any[];
    onItemClick: (id: number) => void;
    onDeleteClick: (id: number, e: React.MouseEvent) => void;
    docType: DocType;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ loading, items, onItemClick, onDeleteClick, docType }) => {
    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loading}>
                <Box width="100%">
                    <SearchableList
                        items={items}
                        onItemClick={onItemClick}
                        onDeleteClick={onDeleteClick}
                        filterKey="title"
                        title={docType}
                    />
                </Box>
            </LoadingBoundary>
        </ErrorBoundary>
    );
};

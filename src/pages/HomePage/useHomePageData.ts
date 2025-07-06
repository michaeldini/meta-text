import React from 'react';
import { useDocumentsStore } from 'store';
import { DocType, ViewMode } from 'types';

export function useHomePageData() {
    // Zustand store
    const {
        sourceDocs,
        sourceDocsLoading,
        sourceDocsError,
        metaTexts,
        metaTextsLoading,
        metaTextsError,
        fetchSourceDocs,
        fetchMetaTexts,
    } = useDocumentsStore();

    // Toggles
    const [docType, setDocType] = React.useState<DocType>(DocType.MetaText);
    const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.Search);

    // Data refresh
    const refreshData = React.useCallback(() => {
        fetchSourceDocs();
        fetchMetaTexts();
    }, [fetchSourceDocs, fetchMetaTexts]);

    // Fetch on mount
    React.useEffect(() => {
        refreshData();
    }, [refreshData]);

    return {
        docType,
        setDocType,
        viewMode,
        setViewMode,
        sourceDocs,
        sourceDocsLoading,
        sourceDocsError,
        metaTexts,
        metaTextsLoading,
        metaTextsError,
        refreshData,
    };
}

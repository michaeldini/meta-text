import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import SearchableList from '../../features/searchablelist/components/SearchableList';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingBoundary from '../../components/LoadingBoundary';
import log from '../../utils/logger';
import { usePageLogger } from '../../hooks/usePageLogger';
import CreateForm from '../../features/createform/components';
import { Typography } from '@mui/material';
import { getErrorMessage } from '../../types/error';
import DocTypeSelect, { DocType } from '../../components/DocTypeSelect';
import { useDocumentsStore } from '../../store/documentsStore';
import { useNotifications } from '../../store/notificationStore';

// Constants to avoid magic strings
const DOC_TYPES = {
    SOURCE_DOC: 'sourceDoc' as const,
    META_TEXT: 'metaText' as const,
} as const;

const ROUTES = {
    SOURCE_DOC: '/sourceDocs',
    META_TEXT: '/metaText',
} as const;

const MESSAGES = {
    DELETE_SUCCESS: {
        [DOC_TYPES.SOURCE_DOC]: 'Source document deleted successfully.',
        [DOC_TYPES.META_TEXT]: 'Meta text deleted successfully.',
    },
    DELETE_ERROR: {
        [DOC_TYPES.SOURCE_DOC]: 'Failed to delete the source document. Please try again.',
        [DOC_TYPES.META_TEXT]: 'Failed to delete the meta text. Please try again.',
    },
} as const;

export default function HomePage() {
    // Use Zustand stores
    const {
        sourceDocs,
        sourceDocsLoading,
        sourceDocsError,
        metaTexts,
        metaTextsLoading,
        metaTextsError,
        fetchSourceDocs,
        fetchMetaTexts,
        deleteSourceDoc,
        deleteMetaText,
    } = useDocumentsStore();

    const { showSuccess, showError } = useNotifications();
    const navigate = useNavigate();
    const [docType, setDocType] = React.useState<DocType>(DOC_TYPES.META_TEXT);

    // Consolidated data refresh function
    const refreshData = React.useCallback(() => {
        fetchSourceDocs();
        fetchMetaTexts();
    }, [fetchSourceDocs, fetchMetaTexts]);

    usePageLogger('HomePage', {
        watched: [
            ['sourceDocsLoading', sourceDocsLoading],
            ['sourceDocsError', sourceDocsError],
            ['sourceDocs', sourceDocs?.length || 0],
            ['metaTextsLoading', metaTextsLoading],
            ['metaTextsError', metaTextsError],
            ['metaTexts', metaTexts?.length || 0]
        ]
    });

    // Fetch data on mount
    React.useEffect(() => {
        refreshData();
    }, [refreshData]);

    // Generic navigation handler
    const handleNavigation = React.useCallback((docType: DocType, id: number) => {
        const route = docType === DOC_TYPES.SOURCE_DOC ? ROUTES.SOURCE_DOC : ROUTES.META_TEXT;
        log.info(`Navigating to ${docType} with id: ${id}`);
        navigate(`${route}/${id}`);
    }, [navigate]);

    // Generic delete handler with error handling
    const handleDelete = React.useCallback(async (
        docType: DocType,
        id: number,
        e: React.MouseEvent
    ) => {
        if (e?.stopPropagation) e.stopPropagation();

        try {
            if (docType === DOC_TYPES.SOURCE_DOC) {
                await deleteSourceDoc(id);
            } else {
                await deleteMetaText(id);
            }
            showSuccess(MESSAGES.DELETE_SUCCESS[docType]);
        } catch (error: unknown) {
            log.error(`Delete ${docType} failed`, error);
            showError(getErrorMessage(error, MESSAGES.DELETE_ERROR[docType]));
        }
    }, [deleteSourceDoc, deleteMetaText, showSuccess, showError]);

    // Specific handlers using the generic ones
    const handleSourceDocClick = React.useCallback((id: number) =>
        handleNavigation(DOC_TYPES.SOURCE_DOC, id), [handleNavigation]);

    const handleMetaTextClick = React.useCallback((id: number) =>
        handleNavigation(DOC_TYPES.META_TEXT, id), [handleNavigation]);

    const handleDeleteSourceDoc = React.useCallback((id: number, e: React.MouseEvent) =>
        handleDelete(DOC_TYPES.SOURCE_DOC, id, e), [handleDelete]);

    const handleDeleteMetaText = React.useCallback((id: number, e: React.MouseEvent) =>
        handleDelete(DOC_TYPES.META_TEXT, id, e), [handleDelete]);

    // Current document configuration
    const currentDocConfig = React.useMemo(() => {
        return docType === DOC_TYPES.SOURCE_DOC
            ? {
                items: sourceDocs || [],
                loading: sourceDocsLoading,
                onItemClick: handleSourceDocClick,
                onDeleteClick: handleDeleteSourceDoc,
            }
            : {
                items: metaTexts || [],
                loading: metaTextsLoading,
                onItemClick: handleMetaTextClick,
                onDeleteClick: handleDeleteMetaText,
            };
    }, [
        docType,
        sourceDocs,
        sourceDocsLoading,
        metaTexts,
        metaTextsLoading,
        handleSourceDocClick,
        handleMetaTextClick,
        handleDeleteSourceDoc,
        handleDeleteMetaText,
    ]);

    return (
        <PageContainer>
            <DocTypeSelect value={docType} onChange={setDocType} />
            <Typography variant="h5" gutterBottom>
                Create
            </Typography>
            <CreateForm
                sourceDocs={sourceDocs || []}
                sourceDocsLoading={sourceDocsLoading}
                sourceDocsError={sourceDocsError}
                onSuccess={refreshData}
                docType={docType}
            />
            <ErrorBoundary>
                <LoadingBoundary loading={currentDocConfig.loading}>
                    <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                        Search
                    </Typography>
                    <SearchableList
                        items={currentDocConfig.items}
                        onItemClick={currentDocConfig.onItemClick}
                        onDeleteClick={currentDocConfig.onDeleteClick}
                        filterKey="title"
                    />
                </LoadingBoundary>
            </ErrorBoundary>
        </PageContainer>
    );
}

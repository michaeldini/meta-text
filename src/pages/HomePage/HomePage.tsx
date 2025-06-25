import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import SearchableList from '../../features/searchablelist/components/SearchableList';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingBoundary from '../../components/LoadingBoundary';
import log from '../../utils/logger';
import { usePageLogger } from '../../hooks/usePageLogger';
import { CreateForm } from '../../features/createform/components';
import { getErrorMessage } from '../../types/error';
import { useDocumentsStore } from '../../store/documentsStore';
import { useNotifications } from '../../store/notificationStore';
import { Box, Typography } from '@mui/material';
import ToggleSelector from '../../components/ToggleSelector';
import FlexBox from '../../components/FlexBox';
import { useTheme } from '@mui/material/styles';
import WelcomeText from './WelcomeText';

// Constants to avoid magic strings
const DOC_TYPES = {
    SOURCE_DOC: 'sourceDoc' as const,
    META_TEXT: 'metaText' as const,
} as const;

const ROUTES = {
    SOURCE_DOC: '/source-document',
    META_TEXT: '/metaText',
} as const;

const MESSAGES = {
    DELETE_SUCCESS: {
        sourceDoc: 'Source document deleted successfully.',
        metaText: 'Meta text deleted successfully.',
    } as const satisfies Record<DocType, string>,
    DELETE_ERROR: {
        sourceDoc: 'Failed to delete the source document. Please try again.',
        metaText: 'Failed to delete the meta text. Please try again.',
    } as const satisfies Record<DocType, string>,
} as const;

// Type for DocType based on DOC_TYPES
export type DocType = typeof DOC_TYPES[keyof typeof DOC_TYPES];

// Extracted SearchSection component
function SearchSection({ loading, items, onItemClick, onDeleteClick, docType }: {
    loading: boolean;
    items: any[];
    onItemClick: (id: number) => void;
    onDeleteClick: (id: number, e: React.MouseEvent) => void;
    docType: DocType;
}) {
    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loading}>
                <Box sx={{ minWidth: '70vw' }}>
                    <SearchableList
                        items={items}
                        onItemClick={onItemClick}
                        onDeleteClick={onDeleteClick}
                        filterKey="title"
                        title="Search"
                    />
                </Box>
            </LoadingBoundary>
        </ErrorBoundary>
    );
}

// Extracted CreateSection component
function CreateSection({
    sourceDocs,
    sourceDocsLoading,
    sourceDocsError,
    onSuccess,
    docType
}: {
    sourceDocs: any[];
    sourceDocsLoading: boolean;
    sourceDocsError: any;
    onSuccess: () => void;
    docType: any;
}) {
    return (
        <ErrorBoundary>
            <LoadingBoundary loading={sourceDocsLoading}>
                <Box sx={{ minWidth: '70vw' }}>
                    <CreateForm
                        sourceDocs={sourceDocs}
                        sourceDocsLoading={sourceDocsLoading}
                        sourceDocsError={sourceDocsError}
                        onSuccess={onSuccess}
                        docType={docType}
                        title="Create"
                    />
                </Box>
            </LoadingBoundary>

        </ErrorBoundary>

    );
}

export enum ViewMode {
    Search = 'search',
    Create = 'create'
}

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
    // Use a single viewKey to represent the current view
    const [docType, setDocType] = React.useState<DocType>(DOC_TYPES.META_TEXT);
    const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.Search);
    // viewKey is a string like 'metaText-search', 'sourceDoc-create', etc.
    const viewKey = `${docType}-${viewMode}`;
    const theme = useTheme();

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
            showSuccess(MESSAGES.DELETE_SUCCESS[docType as keyof typeof MESSAGES.DELETE_SUCCESS]);
        } catch (error: unknown) {
            log.error(`Delete ${docType} failed`, error);
            showError(getErrorMessage(error, MESSAGES.DELETE_ERROR[docType as keyof typeof MESSAGES.DELETE_ERROR]));
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

    // Flip on any toggle input
    const handleDocTypeChange = (value: DocType) => {
        setDocType(value);
    };
    const handleViewModeChange = (value: ViewMode) => {
        setViewMode(value);
    };

    // Render the correct content for the current view
    let content: React.ReactNode = null;
    if (viewMode === ViewMode.Search) {
        content = (
            <SearchSection
                loading={docType === DOC_TYPES.SOURCE_DOC ? sourceDocsLoading : metaTextsLoading}
                items={docType === DOC_TYPES.SOURCE_DOC ? (sourceDocs || []) : (metaTexts || [])}
                onItemClick={docType === DOC_TYPES.SOURCE_DOC ? handleSourceDocClick : handleMetaTextClick}
                onDeleteClick={docType === DOC_TYPES.SOURCE_DOC ? handleDeleteSourceDoc : handleDeleteMetaText}
                docType={docType}
            />
        );
    } else {
        content = (
            <CreateSection
                sourceDocs={sourceDocs || []}
                sourceDocsLoading={sourceDocsLoading}
                sourceDocsError={sourceDocsError}
                onSuccess={refreshData}
                docType={docType}
            />
        );
    }

    return (
        <PageContainer>
            <FlexBox flexDirection="row" alignItems="start" >
                <Box>
                    <WelcomeText />
                    <ToggleSelector
                        value={docType}
                        onChange={handleDocTypeChange}
                        options={[
                            { value: DOC_TYPES.META_TEXT, label: 'Meta-Text', ariaLabel: 'Meta-Text' },
                            { value: DOC_TYPES.SOURCE_DOC, label: 'Source Document', ariaLabel: 'Source Document' },
                        ]}
                        sx={{ my: 2 }}
                    />
                    <ToggleSelector
                        value={viewMode}
                        onChange={handleViewModeChange}
                        options={[
                            { value: ViewMode.Search, label: 'Search', ariaLabel: 'Search' },
                            { value: ViewMode.Create, label: 'Create', ariaLabel: 'Create' },
                        ]}
                        sx={{ mb: 2 }}
                    />
                </Box>
                {content}
            </FlexBox>
        </PageContainer >
    );
}

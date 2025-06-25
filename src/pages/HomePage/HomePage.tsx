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
import { useDocumentsStore } from '../../store/documentsStore';
import { useNotifications } from '../../store/notificationStore';
import { Box } from '@mui/material';
import ToggleSelector from '../../components/ToggleSelector';
import FlexBox from '../../components/FlexBox';
import { useTheme } from '@mui/material/styles';

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
function SearchSection({ loading, items, onItemClick, onDeleteClick }: {
    loading: boolean;
    items: any[];
    onItemClick: (id: number) => void;
    onDeleteClick: (id: number, e: React.MouseEvent) => void;
}) {
    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loading}>
                <Box sx={{ minWidth: '70vw' }}>
                    <Typography variant="h5" gutterBottom>
                        Search
                    </Typography>
                    <div style={{ height: '100%' }}>
                        <SearchableList
                            items={items}
                            onItemClick={onItemClick}
                            onDeleteClick={onDeleteClick}
                            filterKey="title"
                        />
                    </div>
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
        <Box sx={{ minWidth: '70vw' }}>
            <Typography variant="h5" gutterBottom>
                Create
            </Typography>
            <div style={{ height: '100%' }}>
                <CreateForm
                    sourceDocs={sourceDocs}
                    sourceDocsLoading={sourceDocsLoading}
                    sourceDocsError={sourceDocsError}
                    onSuccess={onSuccess}
                    docType={docType}
                />
            </div>
        </Box>
    );
}

export enum ViewMode {
    Search = 'search',
    Create = 'create'
}

// Minimal flipping styles for HomePage (reset, simple flip only)
const flippingContainerSx = {
    perspective: 1200,
    width: '70vw',
    minHeight: 600,
    margin: '0 auto',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const flippingContentSx = (flipped: boolean) => ({
    width: '100%',
    height: '100%',
    position: 'relative',
    transition: 'transform 0.5s cubic-bezier(.68,-0.55,.27,1.55)',
    transformStyle: 'preserve-3d',
    transform: flipped ? 'rotateY(180deg)' : 'none',
});

const flippingSideSx = {
    width: '100%',
    height: '100%',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    backfaceVisibility: 'hidden' as const,
    boxSizing: 'border-box' as const,
    overflow: 'auto',
};

const flippingBackSx = {
    ...flippingSideSx,
    transform: 'rotateY(180deg)',
};

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
    const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.Search);
    const [flipped, setFlipped] = React.useState(false);
    // For always-forward flip
    const [pendingDocType, setPendingDocType] = React.useState<DocType>(docType);
    const [pendingViewMode, setPendingViewMode] = React.useState<ViewMode>(viewMode);
    const [isAnimating, setIsAnimating] = React.useState(false);
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
        setFlipped(f => !f);
        setDocType(value);
    };
    const handleViewModeChange = (value: ViewMode) => {
        setFlipped(f => !f);
        setViewMode(value);
    };

    return (
        <PageContainer>
            <FlexBox sx={{ minWidth: '600px', height: '100%' }}>
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
                <Box sx={flippingContainerSx}>
                    <Box sx={flippingContentSx(flipped)}>
                        {/* Front side */}
                        <Box sx={flippingSideSx}>
                            {!flipped && (viewMode === ViewMode.Search ? (
                                <SearchSection
                                    loading={docType === DOC_TYPES.SOURCE_DOC ? sourceDocsLoading : metaTextsLoading}
                                    items={docType === DOC_TYPES.SOURCE_DOC ? (sourceDocs || []) : (metaTexts || [])}
                                    onItemClick={docType === DOC_TYPES.SOURCE_DOC ? handleSourceDocClick : handleMetaTextClick}
                                    onDeleteClick={docType === DOC_TYPES.SOURCE_DOC ? handleDeleteSourceDoc : handleDeleteMetaText}
                                />
                            ) : (
                                <CreateSection
                                    sourceDocs={sourceDocs || []}
                                    sourceDocsLoading={sourceDocsLoading}
                                    sourceDocsError={sourceDocsError}
                                    onSuccess={refreshData}
                                    docType={docType}
                                />
                            ))}
                        </Box>
                        {/* Back side */}
                        <Box sx={flippingBackSx}>
                            {flipped && (viewMode === ViewMode.Search ? (
                                <SearchSection
                                    loading={docType === DOC_TYPES.SOURCE_DOC ? sourceDocsLoading : metaTextsLoading}
                                    items={docType === DOC_TYPES.SOURCE_DOC ? (sourceDocs || []) : (metaTexts || [])}
                                    onItemClick={docType === DOC_TYPES.SOURCE_DOC ? handleSourceDocClick : handleMetaTextClick}
                                    onDeleteClick={docType === DOC_TYPES.SOURCE_DOC ? handleDeleteSourceDoc : handleDeleteMetaText}
                                />
                            ) : (
                                <CreateSection
                                    sourceDocs={sourceDocs || []}
                                    sourceDocsLoading={sourceDocsLoading}
                                    sourceDocsError={sourceDocsError}
                                    onSuccess={refreshData}
                                    docType={docType}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </FlexBox>
        </PageContainer >
    );
}

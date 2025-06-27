import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import { getErrorMessage } from '../../types/error';
import { useDocumentsStore } from '../../store/documentsStore';
import { useNotifications } from '../../store/notificationStore';
import { Box, Typography } from '@mui/material';
import ToggleSelector from '../../components/ToggleSelector';
import FlexBox from '../../components/FlexBox';
import { useTheme } from '@mui/material/styles';
import WelcomeText from './WelcomeText';
import { ROUTES, MESSAGES } from '../../components/constants';
import { SearchSection } from './SearchSection';
import { CreateSection } from './CreateSection';
import { DocType } from '../../types/docTypes';
import { usePageLogger } from '../../hooks/usePageLogger';
import log from '../../utils/logger';

export enum ViewMode {
    Search = 'search',
    Create = 'create'
}

const DOC_TYPE_OPTIONS = [
    { value: DocType.MetaText, label: 'Meta-Text', ariaLabel: 'Meta-Text' },
    { value: DocType.SourceDoc, label: 'Source Document', ariaLabel: 'Source Document' },
];

const VIEW_MODE_OPTIONS = [
    { value: ViewMode.Search, label: 'Search', ariaLabel: 'Search' },
    { value: ViewMode.Create, label: 'Create', ariaLabel: 'Create' },
];

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
    const [docType, setDocType] = React.useState<DocType>(DocType.MetaText);
    const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.Search);


    // Consolidated data refresh function
    const refreshData = React.useCallback(() => {
        fetchSourceDocs();
        fetchMetaTexts();
    }, [fetchSourceDocs, fetchMetaTexts]);

    // Fetch data on mount
    React.useEffect(() => {
        refreshData();
    }, [refreshData]);


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

    const deleteActions = {
        [DocType.SourceDoc]: deleteSourceDoc,
        [DocType.MetaText]: deleteMetaText,
    };

    const routeMap = {
        [DocType.SourceDoc]: ROUTES.SOURCE_DOC,
        [DocType.MetaText]: ROUTES.META_TEXT,
    };

    // Generic navigation handler
    const handleNavigation = React.useCallback(
        (docType: DocType, id: number) => {
            log.info(`Navigating to ${docType} with id: ${id}`);
            navigate(`${routeMap[docType]}/${id}`);
        },
        [navigate]
    );

    // Generic delete handler with error handling
    const handleDelete = React.useCallback(
        async (docType: DocType, id: number, e: React.MouseEvent) => {
            if (e?.stopPropagation) e.stopPropagation();

            try {
                await deleteActions[docType](id);
                showSuccess(MESSAGES.DELETE_SUCCESS[docType as keyof typeof MESSAGES.DELETE_SUCCESS]);
            } catch (error: unknown) {
                log.error(`Delete ${docType} failed`, error);
                showError(getErrorMessage(error, MESSAGES.DELETE_ERROR[docType as keyof typeof MESSAGES.DELETE_ERROR]));
            }
        },
        [showSuccess, showError, navigate, deleteSourceDoc, deleteMetaText]
    );

    // Specific handlers using the generic ones
    const handleSourceDocClick = React.useCallback((id: number) =>
        handleNavigation(DocType.SourceDoc, id), [handleNavigation]);

    const handleMetaTextClick = React.useCallback((id: number) =>
        handleNavigation(DocType.MetaText, id), [handleNavigation]);

    const handleDeleteSourceDoc = React.useCallback((id: number, e: React.MouseEvent) =>
        handleDelete(DocType.SourceDoc, id, e), [handleDelete]);

    const handleDeleteMetaText = React.useCallback((id: number, e: React.MouseEvent) =>
        handleDelete(DocType.MetaText, id, e), [handleDelete]);

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
                loading={docType === DocType.SourceDoc ? sourceDocsLoading : metaTextsLoading}
                items={docType === DocType.SourceDoc ? (sourceDocs || []) : (metaTexts || [])}
                onItemClick={docType === DocType.SourceDoc ? handleSourceDocClick : handleMetaTextClick}
                onDeleteClick={docType === DocType.SourceDoc ? handleDeleteSourceDoc : handleDeleteMetaText}
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
                        options={DOC_TYPE_OPTIONS}
                        sx={{ my: 2 }}
                    />
                    <ToggleSelector
                        value={viewMode}
                        onChange={handleViewModeChange}
                        options={VIEW_MODE_OPTIONS}
                        sx={{ mb: 2 }}
                    />
                </Box>

                {/* Render the correct content for the current view */}
                {content}
            </FlexBox>
        </PageContainer >
    );
}

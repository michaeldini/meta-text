import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, useTheme } from '@mui/material';
import { PageContainer } from 'components';
import { useDocumentsStore, useNotifications } from 'store';
import { ToggleSelector, FlexBox } from 'components';
import { CreateForm, SearchableList } from 'features';
import { usePageLogger } from 'hooks';

import WelcomeText from './WelcomeText';
import { DocType } from 'types';
import { getHomePageStyles } from '../../styles/styles';
import {
    getDeleteActions,
    getRouteMap,
    handleNavigationFactory,
    handleDeleteFactory,
    handleSourceDocClickFactory,
    handleMetaTextClickFactory,
    handleDeleteSourceDocFactory,
    handleDeleteMetaTextFactory
} from './HomePage.handlers';

enum ViewMode {
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
    const theme = useTheme();
    const styles = getHomePageStyles(theme);
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

    const deleteActions = getDeleteActions(deleteSourceDoc, deleteMetaText);
    const routeMap = getRouteMap();
    const handleNavigation = React.useCallback(handleNavigationFactory(navigate, routeMap), [navigate, routeMap]);
    const handleDelete = React.useCallback(handleDeleteFactory(deleteActions, showSuccess, showError, navigate), [deleteActions, showSuccess, showError, navigate]);
    const handleSourceDocClick = React.useCallback(handleSourceDocClickFactory(handleNavigation), [handleNavigation]);
    const handleMetaTextClick = React.useCallback(handleMetaTextClickFactory(handleNavigation), [handleNavigation]);
    const handleDeleteSourceDoc = React.useCallback(handleDeleteSourceDocFactory(handleDelete), [handleDelete]);
    const handleDeleteMetaText = React.useCallback(handleDeleteMetaTextFactory(handleDelete), [handleDelete]);

    // Flip on any toggle input
    const handleDocTypeChange = (value: DocType) => {
        setDocType(value);
    };
    const handleViewModeChange = (value: ViewMode) => {
        setViewMode(value);
    };

    // Render the correct content for the current view
    const isSourceDoc = docType === DocType.SourceDoc;
    const listProps = isSourceDoc
        ? {
            items: sourceDocs || [],
            onItemClick: handleSourceDocClick,
            onDeleteClick: handleDeleteSourceDoc,
            loading: sourceDocsLoading
        }
        : {
            items: metaTexts || [],
            onItemClick: handleMetaTextClick,
            onDeleteClick: handleDeleteMetaText,
            loading: metaTextsLoading
        };

    let content: React.ReactNode = null;
    if (viewMode === ViewMode.Search) {
        content = (
            <SearchableList
                {...listProps}
                filterKey="title"
                title={docType}
            />
        );
    } else {
        content = (
            <CreateForm
                sourceDocs={sourceDocs || []}
                sourceDocsLoading={sourceDocsLoading}
                sourceDocsError={sourceDocsError}
                onSuccess={refreshData}
                docType={docType}
                title={docType}
            />
        );
    }

    return (
        <PageContainer>
            <Box sx={styles.homePageContainer}>
                <FlexBox flexDirection="column" alignItems="start" >
                    <WelcomeText />
                    <FlexBox flexDirection='column' sx={styles.toggleContainer}>
                        <ToggleSelector
                            value={docType}
                            onChange={handleDocTypeChange}
                            options={DOC_TYPE_OPTIONS}
                        />
                        <ToggleSelector
                            value={viewMode}
                            onChange={handleViewModeChange}
                            options={VIEW_MODE_OPTIONS}
                        />
                    </FlexBox>
                </FlexBox>

                {/* Render the correct content for the current view */}
                <Paper sx={styles.contentContainer}>
                    {content}
                </Paper>
            </Box>
        </PageContainer >
    );
}

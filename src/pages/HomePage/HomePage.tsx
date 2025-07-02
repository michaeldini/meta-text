import React from 'react';
import { Box, Paper, useTheme } from '@mui/material';

import { useDocumentsStore } from 'store';
import { usePageLogger } from 'hooks';
import { CreateForm, SearchableList } from 'features';
import { PageContainer, FlexBox } from 'components';
import { DocType, ViewMode } from 'types';

import { getHomePageStyles } from '../../styles/styles';
import WelcomeText from './WelcomeText';
import { HomePageToggles } from './HomePageToggles';


export default function HomePage() {
    // Use Zustand stores to get lists of doc and meta summaries
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

    // const { showSuccess, showError } = useNotifications();
    // const navigate = useNavigate();
    const theme = useTheme();
    const styles = getHomePageStyles(theme);
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

    // Render the correct content for the current view
    const isSourceDoc = docType === DocType.SourceDoc;


    let content: React.ReactNode = null;
    if (viewMode === ViewMode.Search) {
        content = (
            <SearchableList
                items={isSourceDoc ? sourceDocs : metaTexts}
                filterKey={"title"}
                title={docType}
            />
        );
    } else {
        content = (
            <CreateForm
                sourceDocs={sourceDocs}
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
                    <HomePageToggles
                        docType={docType}
                        setDocType={setDocType}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        styles={styles}
                    />
                </FlexBox>

                {/* Render the correct content for the current view */}
                <Paper sx={styles.contentContainer}>
                    {content}
                </Paper>
            </Box>
        </PageContainer >
    );
}

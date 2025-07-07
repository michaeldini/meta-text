// INTRODUCTION:
// The homepage component for the MetaText application
// This component serves as the main entry point for users, allowing them to create or search for documents
// It includes toggles for switching between document types and view modes, and displays a welcome message

// HOOKS:
// useHomePageData: manages the state for toggles, document lists, and data fetching
// useHomePageContent: custom hook to determine the content to be displayed on the homepage based on the current state


import React from 'react';
import { Box, Paper, useTheme } from '@mui/material';

import { usePageLogger } from 'hooks';
import { PageContainer, FlexBox } from 'components';
import { DocType, ViewMode } from 'types';

import { getHomePageStyles } from '../../styles/styles';
import WelcomeText from './components/WelcomeText';
import { HomePageToggles } from './components/HomePageToggles';
import { useHomePageData } from './useHomePageData';
import { useHomePageContent } from './useHomePageContent';


export default function HomePage() {

    // Get the theme and styles for the home page
    const theme = useTheme();
    const styles = getHomePageStyles(theme);

    // Get the document type and view mode state, along with the data fetching functions
    const {
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
    } = useHomePageData();


    // Render the correct content for the current view
    const content = useHomePageContent({
        docType,
        viewMode,
        sourceDocs,
        sourceDocsLoading,
        sourceDocsError,
        metaTexts,
        refreshData,
    });

    return (
        <PageContainer>
            <Box sx={styles.homePageContainer}>
                <WelcomeText />
                <HomePageToggles
                    docType={docType}
                    setDocType={setDocType}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    styles={styles}
                />
                <Paper sx={styles.contentContainer}>
                    {content}
                </Paper>
            </Box>
        </PageContainer >
    );
}

// This page serves as the entry point for users, guiding them to the main functionalities of the application.
// It includes a welcome message and navigation buttons to direct users to the SourceDocs and MetaText pages.
// Data prefetching: This page proactively loads data for both SourceDoc and MetaText pages in the background,
// improving perceived performance when users navigate to those pages.


import { Box, Slide, useTheme } from '@mui/material';
import type { ReactElement } from 'react';
import { useEffect } from 'react';

import { PageContainer } from 'components';
import { getAppStyles } from 'styles';
import { useDocumentsStore } from 'store';

import WelcomeText from './components/WelcomeText';
import NavigationButtons from './components/NavigationButtons';
import { FADE_IN_DURATION } from 'constants';

function HomePage(): ReactElement {
    // Get store state and actions
    const {
        fetchSourceDocs,
        fetchMetaTexts,
        sourceDocsLoading,
        metaTextsLoading,
        sourceDocsError,
        metaTextsError
    } = useDocumentsStore();

    // Prefetch data for both SourceDoc and MetaText pages in the background
    // This improves perceived performance when users navigate to those pages
    useEffect(() => {
        // Only fetch if not already loading to avoid duplicate requests
        if (!sourceDocsLoading && !sourceDocsError) {
            fetchSourceDocs();
        }
        if (!metaTextsLoading && !metaTextsError) {
            fetchMetaTexts();
        }
    }, [fetchSourceDocs, fetchMetaTexts, sourceDocsLoading, metaTextsLoading, sourceDocsError, metaTextsError]);

    // Set up styles for the HomePage component
    const theme = useTheme();
    const styles = getAppStyles(theme);

    return (
        <PageContainer
            loading={false}
            data-testid="homepage-container"
        >
            <Slide in={true} direction="up" timeout={FADE_IN_DURATION}>
                <Box
                    sx={styles.homePage.container}
                    data-testid="homepage-content"
                >
                    <WelcomeText welcomeTextStyles={styles.welcomeText} />

                    <NavigationButtons styles={styles.homePage.navigationButtons} />
                </Box>
            </Slide>
        </PageContainer>
    );
}

export default HomePage;

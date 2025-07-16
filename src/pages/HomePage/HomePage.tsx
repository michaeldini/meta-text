// This page serves as the entry point for users, guiding them to the main functionalities of the application.
// It includes a welcome message and navigation buttons to direct users to the SourceDocs and Metatext pages.
// Data prefetching: This page proactively loads data for both SourceDoc and Metatext pages in the background,
// improving perceived performance when users navigate to those pages.


import { Box, Slide, useTheme } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { useHydrateUserConfig } from 'hooks';

import { PageContainer } from 'components';
import { getAppStyles } from 'styles';
import { useDocumentsStore } from 'store';

import WelcomeText from './components/WelcomeText';
import NavigationButtons from './components/NavigationButtons';
import { FADE_IN_DURATION } from 'constants';


function HomePage(): ReactElement {
    // Hydrate user config on page load
    useHydrateUserConfig();

    // Prefetch data for both SourceDoc and Metatext pages in the background
    // This improves perceived performance when users navigate to those pages
    const { fetchSourceDocs, fetchMetatexts } = useDocumentsStore();

    useEffect(() => {
        // Prefetch data without blocking the UI or showing loading states
        // Only fetch if not already loading to avoid duplicate requests
        const { sourceDocsLoading, metatextsLoading } = useDocumentsStore.getState();

        if (!sourceDocsLoading) {
            fetchSourceDocs();
        }
        if (!metatextsLoading) {
            fetchMetatexts();
        }
    }, [fetchSourceDocs, fetchMetatexts]);

    // Set up the theme and styles for the HomePage component
    const theme: Theme = useTheme();
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

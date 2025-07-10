// This page serves as the entry point for users, guiding them to the main functionalities of the application.
// It includes a welcome message and navigation buttons to direct users to the SourceDocs and MetaText pages.


import { Box, Slide, useTheme } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';

import { PageContainer } from 'components';
import { getAppStyles } from 'styles';

import WelcomeText from './components/WelcomeText';
import NavigationButtons from './components/NavigationButtons';

function HomePage(): ReactElement {

    // Set up the theme and styles for the HomePage component
    const theme: Theme = useTheme();
    const styles = getAppStyles(theme);

    return (
        <PageContainer
            loading={false}
            data-testid="homepage-container"
        >
            <Slide in={true} direction="up" timeout={500}>
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

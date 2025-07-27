/**
 * @module pages
 * This page serves as the entry point for users, guiding them to the main functionalities of the application.
 * It includes a welcome message and navigation buttons to direct users to the SourceDocs and Metatext pages.
 * Data prefetching: This page proactively loads data for both SourceDoc and Metatext pages in the background,
 * improving perceived performance when users navigate to those pages.
 */

import type { ReactElement } from 'react';

import { useHydrateUserConfig } from 'hooks';
import { PageContainer } from 'components';
import { useSourceDocuments, useMetatexts } from 'features';

import WelcomeText from './components/WelcomeText';
import NavigationButtons from './components/NavigationButtons';
import HomePageDetails from './components/HomePageDetails';
import { Center } from "@chakra-ui/react/center"
import { Stack } from "@chakra-ui/react/stack"


/* HomePage component
 * - Hydrates user configuration on page load
 * - Prefetches data for SourceDoc and Metatext pages
 * - Displays a welcome message and navigation buttons
 */
function HomePage(): ReactElement {

    // Hydrate user config on page load
    useHydrateUserConfig();

    // Prefetch source documents & metatexts using TanStack Query
    // This will automatically fetch and cache the list in the background
    useSourceDocuments();
    useMetatexts();

    return (
        <PageContainer
            loading={false}
            data-testid="homepage-container"
        >
            <Stack data-testid="homepage-content" maxWidth="2xl">
                <WelcomeText />
                <Center>
                    <NavigationButtons />
                </Center>
                <HomePageDetails />
            </Stack>

        </PageContainer>
    );
}


/* HomePage component
 * - Hydrates user configuration on page load
 * - Prefetches data for SourceDoc and Metatext pages
 * - Displays a welcome message and navigation buttons
 */
export default HomePage;

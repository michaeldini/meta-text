/**
 * HomePage component
 * - calls useHomepage hook for navigation logic, prefetching data, and hydrating user config
 * - Displays a welcome message and navigation buttons
 */

import type { ReactElement } from 'react';

import { PageContainer } from 'components';

import WelcomeText from './components/WelcomeText';
import HomePageDetails from './components/HomePageDetails';
import { Center } from "@chakra-ui/react/center"
import { Stack } from "@chakra-ui/react/stack"
import { TooltipButton } from 'components';

import { useHomepage } from './useHomepage';

function HomePage(): ReactElement {

    const {
        handleNavigateToSourceDocs,
        handleNavigateToMetatexts,
    } = useHomepage();

    return (
        <PageContainer
            loading={false}
            data-testid="homepage-container"
        >
            <Stack data-testid="homepage-content" maxWidth="2xl">
                <WelcomeText />
                <Center>
                    <Stack direction="row">
                        <TooltipButton
                            label="Browse SourceDocs"
                            onClick={handleNavigateToSourceDocs}
                            data-testid="navigate-to-source-docs"
                        />
                        <TooltipButton
                            label="Browse Metatexts"
                            onClick={handleNavigateToMetatexts}
                            data-testid="navigate-to-metatexts"
                        />
                    </Stack>
                </Center>
                <HomePageDetails />
            </Stack>

        </PageContainer>
    );
}
export default HomePage;

/**
 * HomePage component
 * - calls useHomepage hook for navigation logic, prefetching data, and hydrating user config
 * - Displays a welcome message and navigation buttons
 */

import type { ReactElement } from 'react';

import { PageContainer } from '@components/PageContainer';

import WelcomeText from './components/WelcomeText';
import HomePageDetails from './components/HomePageDetails';
import { Center } from "@chakra-ui/react/center"
import { Stack } from "@chakra-ui/react/stack"


import { TooltipButton } from '../../components/TooltipButton';
import { MetaTextLogoIcon } from '../../components/icons';

import { useHomepage } from './hooks/useHomepage';

function HomePage(): ReactElement {

    const {
        handleNavigateToSourceDocs,
        handleNavigateToMetatexts,
        isLoading,
    } = useHomepage();

    return (
        <PageContainer
            loading={isLoading}
            data-testid="homepage-container"
        >
            <Stack data-testid="homepage-content" maxWidth="2xl">
                <WelcomeText />
                <Center>
                    <Stack direction="row" gap={4} p={4} align="center" justify="center">
                        <TooltipButton
                            label="Browse SourceDocs"
                            icon={<MetaTextLogoIcon />}
                            onClick={handleNavigateToSourceDocs}
                            data-testid="navigate-to-source-docs"
                            disabled={isLoading}
                            loading={isLoading}
                        />
                        <TooltipButton
                            label="Browse Metatexts"
                            icon={<MetaTextLogoIcon />}
                            onClick={handleNavigateToMetatexts}
                            data-testid="navigate-to-metatexts"
                            disabled={isLoading}
                            loading={isLoading}
                        />
                    </Stack>
                </Center>
                <HomePageDetails />
            </Stack>

        </PageContainer>
    );
}
export default HomePage;

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
import { Stack, StackSeparator } from "@chakra-ui/react/stack"

import { TooltipButton } from '../../components/TooltipButton';
import { MetaTextLogoIcon } from '../../components/icons';

import { useHomepage } from './hooks/useHomepage';
import MetatextPage from '@pages/Metatext/MetatextPage'
import SourceDocPage from '@pages/SourceDocument/SourceDocPage';

function HomePage(): ReactElement {

    const {
        sourceDocs,
        metatexts,
        refetchSourceDocs,
        refetchMetatexts,
        isLoading,
    } = useHomepage();

    return (
        <PageContainer
            loading={isLoading}
            data-testid="homepage-container"
        >
            <Stack
                data-testid="homepage-content"
                justify="center"
                // alignItems="center"
                separator={<StackSeparator />}
            >
                <WelcomeText />
                <MetatextPage metatexts={metatexts} sourceDocs={sourceDocs} refetch={refetchMetatexts} isLoading={isLoading} />
                <SourceDocPage sourceDocs={sourceDocs} refetch={refetchSourceDocs} isLoading={isLoading} />
                <HomePageDetails />
            </Stack>

        </PageContainer>
    );
}
export default HomePage;

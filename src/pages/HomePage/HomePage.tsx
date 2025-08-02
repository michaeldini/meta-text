/**
 * HomePage component
 * - calls useHomepage hook for navigation logic, prefetching data, and hydrating user config
 * - Displays a welcome message and navigation buttons
 */

import type { ReactElement } from 'react';
import { Stack, StackSeparator } from "@chakra-ui/react/stack"

import { PageContainer } from '@components/PageContainer';

import WelcomeText from './components/WelcomeText';
import HomePageDetails from './components/HomePageDetails';

import { useHomepage } from './hooks/useHomepage';
import MetatextPage from '@pages/Metatext/MetatextPage'
import SourceDocPage from '@pages/SourceDocument/SourceDocPage';

function HomePage(): ReactElement {
    const {
        sourceDocs,
        metatexts,
        refetchSourceDocs,
        refetchMetatexts,
    } = useHomepage();

    return (
        // pages are wrapped in Suspense and Error boundary to handle loading states
        <PageContainer>
            <Stack
                data-testid="homepage-content"
                justify="center"
                separator={<StackSeparator />}
                gap={10}
            >
                <WelcomeText />
                <MetatextPage metatexts={metatexts} sourceDocs={sourceDocs} refetch={refetchMetatexts} />
                <SourceDocPage sourceDocs={sourceDocs} refetch={refetchSourceDocs} />
                <HomePageDetails />
            </Stack>
        </PageContainer>
    );
}


export default HomePage;

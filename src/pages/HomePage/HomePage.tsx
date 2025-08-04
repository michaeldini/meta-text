/**
 * HomePage component
 * - calls useHomepage hook for navigation logic, prefetching data, and hydrating user config
 * - Displays a welcome message and navigation buttons
 */

import type { ReactElement } from 'react';
import { Stack, StackSeparator } from "@chakra-ui/react/stack"

import { PageContainer } from '@components/PageContainer';


import MetatextPage from '@pages/Metatext/MetatextPage'
import SourceDocPage from '@pages/SourceDocument/SourceDocPage';
import { commonStackProps, commonHeadingProps, WelcomeText, AppInstructions } from './homepage.constants';
import { useSourceDocuments, useMetatexts } from '@features/documents/useDocumentsData';

function HomePage(): ReactElement {


    const sourceDocsQuery = useSourceDocuments();
    const metatextsQuery = useMetatexts();


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
                <MetatextPage
                    metatexts={metatextsQuery.data}
                    sourceDocs={sourceDocsQuery.data}
                    refetch={metatextsQuery.refetch}
                    stackProps={commonStackProps}
                    headingProps={commonHeadingProps}
                />
                <SourceDocPage
                    sourceDocs={sourceDocsQuery.data}
                    refetch={sourceDocsQuery.refetch}
                    stackProps={commonStackProps}
                    headingProps={commonHeadingProps}
                />
                <AppInstructions />
            </Stack>
        </PageContainer>
    );
}


export default HomePage;

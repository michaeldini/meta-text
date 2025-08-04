/**
 * HomePage component
 * - Displays a welcome messages, source documents and metatexts sections, and app instructions.
 */


// The homepage has a vertical stack layout.
import React from 'react';
import type { ReactElement } from 'react';
import { Stack, StackSeparator } from "@chakra-ui/react/stack"

// The whole page is wrapped in a PageContainer for consistent styling
import { PageContainer } from '@components/PageContainer';

// Import the MetatextPage and SourceDocPage components.
// they were previously pages, hence, the namespace.
import MetatextPage from '@pages/Metatext/MetatextPage'
import SourceDocPage from '@pages/SourceDocument/SourceDocPage';


// Import constants, keeping this file clean and focused on the HomePage logic.
// Check out the file for the constants used in this page.
import { commonStackProps, commonHeadingProps, WelcomeText, AppInstructions } from './homepage.constants';

// Import hooks to fetch source documents and metatexts.
// These hooks are used to get the data for the SourceDocPage and MetatextPage
import { useSourceDocuments, useMetatexts } from '@features/documents/useDocumentsData';


// HomePage component
function HomePage(): ReactElement {

    // Fetch source documents and metatexts using react-query hooks.
    const sourceDocsQuery = useSourceDocuments();
    const metatextsQuery = useMetatexts();


    return (
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

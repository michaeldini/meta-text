/**
 * HomePage component
 * - Displays a welcome message, source documents and metatexts sections, app instructions, and keyboard shortcuts.
 */


// The homepage has a vertical stack layout.
import React from 'react';
import type { ReactElement } from 'react';
import { Stack, StackSeparator } from "@chakra-ui/react/stack"

// The whole page is wrapped in a PageContainer for consistent styling
import { PageContainer } from '@components/PageContainer';
import { KeyboardShortcutsDisplay } from '@components/KeyboardShortcutsDisplay';

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

    // Fetch source documents and metatexts
    // This componenent has subcomponents that display the data, so we fetch it in the parent component.
    const sourceDocsQuery = useSourceDocuments();
    const metatextsQuery = useMetatexts();


    return (
        <PageContainer>
            <Stack
                data-testid="homepage-content"
                justify="center"
                separator={<StackSeparator />}
                gap={{ base: 5, lg: 10 }} // Responsive gap
            >
                <WelcomeText />
                <MetatextPage
                    metatexts={metatextsQuery.data ?? []}
                    sourceDocs={sourceDocsQuery.data ?? []}
                    stackProps={commonStackProps}
                    headingProps={commonHeadingProps}
                />
                <SourceDocPage
                    sourceDocs={sourceDocsQuery.data ?? []}
                    stackProps={commonStackProps}
                    headingProps={commonHeadingProps}
                />
                <AppInstructions />
                <KeyboardShortcutsDisplay />
            </Stack>
        </PageContainer>
    );
}


export default HomePage;

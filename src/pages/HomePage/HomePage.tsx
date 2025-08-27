/**
 * HomePage component
 * - Displays a welcome message, source documents and metatexts sections, app instructions, and keyboard shortcuts.
 * - The component is very simple: it fetches a list of source docs and metatexts and passes it to the source doc and metatext components.
 */
import React from 'react';
import type { ReactElement } from 'react';

// UI Components
import MetatextManager from '@sections/Metatext/MetatextManager';
import SourceDocumentsManager from '@sections/SourceDocuments/SourceDocumentsManager';
import { PageContainer } from '@components/PageContainer';
import { Stack, StackSeparator } from "@chakra-ui/react/stack"

// UI Constants
import { WelcomeText, AppInstructions } from './homepage.constants';

// Data Fetching Hooks
import { useSourceDocuments, useMetatexts } from '@features/documents/useDocumentsData';
import { Link } from '@chakra-ui/react';


// HomePage component
function HomePage(): ReactElement {

    // Fetch source documents and metatexts
    const sourceDocsQuery = useSourceDocuments();
    const metatextsQuery = useMetatexts();

    return (
        <PageContainer>
            <Link href="/experiments" color="blue.500" fontWeight="bold">
                Go to Experiments
            </Link>
            <Link px="4" href="/russiandolls" color="blue.500" fontWeight="bold">
                Go to Experiments 2
            </Link>
            <Stack
                data-testid="homepage-content"
                justify="center"
                separator={<StackSeparator />}
                gap={{ base: 5, lg: 10 }} // Responsive gap
            >
                <WelcomeText />
                <MetatextManager
                    metatexts={metatextsQuery.data ?? []}
                    sourceDocs={sourceDocsQuery.data ?? []}
                />
                <SourceDocumentsManager
                    sourceDocs={sourceDocsQuery.data ?? []}
                />
                <AppInstructions />
            </Stack>
        </PageContainer>
    );
}


export default HomePage;

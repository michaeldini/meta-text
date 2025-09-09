/**
 * HomePage component
 * - Displays a welcome message, source documents and metatexts sections, app instructions, and keyboard shortcuts.
 * - The component is very simple: it fetches a list of source docs and metatexts and passes it to the source doc and metatext components.
 */
import React from 'react';
import type { ReactElement } from 'react';

// UI Components
import { Wrap, Box } from "@chakra-ui/react"

// Data Fetching Hooks
import { useSourceDocuments, useMetatexts, useDeleteMetatext, useDeleteSourceDocument } from '@features/documents/useDocumentsData';
import { Link } from '@chakra-ui/react';
import MetatextCreateForm from '@sections/Metatext/MetatextCreateForm';
import { SearchableTable } from '@components/SearchableTable';
import SourceDocUploadForm from '@sections/SourceDocuments/SourceDocUploadForm';


// HomePage component
function HomePage(): ReactElement {

    // Fetch source documents and metatexts
    const sourceDocsQuery = useSourceDocuments();
    const metatextsQuery = useMetatexts();

    return (
        <Box>
            <Wrap
                data-testid="homepage-content"
                justify="center"
                gap={{ base: 5, lg: 10 }} // Responsive gap

            >
                <SearchableTable
                    documents={metatextsQuery.data ?? []}
                    title="Metatexts"
                    navigateToBase="/metatext/"
                    deleteItemMutation={useDeleteMetatext()}
                />
                <MetatextCreateForm
                    sourceDocs={sourceDocsQuery.data ?? []}
                    sourceDocsLoading={sourceDocsQuery.isLoading}
                />
                <SourceDocUploadForm />
                <SearchableTable
                    documents={sourceDocsQuery.data ?? []}
                    title='SourceDocs'
                    navigateToBase="/sourcedoc/"
                    deleteItemMutation={useDeleteSourceDocument()}
                />
            </Wrap>

            <Link href="/experiments" color="blue.500" fontWeight="bold">
                Go to Experiments
            </Link>
            <Link px="4" href="/russiandolls" color="blue.500" fontWeight="bold">
                Go to Experiments 2
            </Link>
        </Box>
    );
}


export default HomePage;

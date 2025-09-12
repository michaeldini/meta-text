/**
 * HomePage component
 * - Displays a welcome message, source documents and metatexts sections, app instructions, and keyboard shortcuts.
 * - The component is very simple: it fetches a list of source docs and metatexts and passes it to the source doc and metatext components.
 */
import React from 'react';
import type { ReactElement } from 'react';

// Data Fetching Hooks
import { useSourceDocuments, useMetatexts, useDeleteMetatext, useDeleteSourceDocument } from '@features/documents/useDocumentsData';
// styling (stitches)
import { Box, Flex, Link } from '@styles';
import MetatextCreateForm from '@sections/Metatext/MetatextCreateForm';
import { SearchableTable } from '@components/SearchableTable';
import SourceDocUploadForm from '@sections/SourceDocuments/SourceDocUploadForm';

// HomePage component
// Use Box and Flex directly, with variants if needed

function HomePage(): ReactElement {
    // Fetch source documents and metatexts
    const sourceDocsQuery = useSourceDocuments();
    const metatextsQuery = useMetatexts();

    return (
        <Box>
            <Flex
                data-testid="homepage-content"
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
                    title="SourceDocs"
                    navigateToBase="/sourcedoc/"
                    deleteItemMutation={useDeleteSourceDocument()}
                />
            </Flex>

            <Link href="/experiments">
                Go to Experiments
            </Link>
            <Link href="/russiandolls" css={{ paddingLeft: '1rem' }}>
                Go to Experiments 2
            </Link>
        </Box>
    );
}


export default HomePage;

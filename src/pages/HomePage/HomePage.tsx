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
import { Box, Row, Link } from '@styles';
import MetatextCreateForm from '@pages/HomePage/components/MetatextCreateForm';
import { SearchableTable, SourceDocUploadForm } from '@pages/HomePage/components';
import Alert from '@components/Alert';
function HomePage(): ReactElement {
    // Fetch source documents and metatexts
    const sourceDocsQuery = useSourceDocuments();
    const metatextsQuery = useMetatexts();

    return (
        <Box center>
            <Alert message="test" type="warning" autoDismiss />
            {/* delete this when it is no longer amusing */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128" aria-label="Monoline vehicle icon">
                <g stroke="#de0f0fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    {/* Seat */}
                    <path d="M20 20 H44 V26 H20 Z" />
                    {/* Seat support */}
                    <path d="M32 26 V34" />
                    {/* Wheel */}
                    <circle cx="32" cy="44" r="10" />
                    {/* Wave / ground */}
                    <path d="M8 56 C20 52 44 60 56 56" />
                </g>
            </svg>


            <Row
                data-testid="homepage-content"
                gap="3"
                justifyCenter
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
            </Row>

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

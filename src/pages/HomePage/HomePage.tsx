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
import { styled, Box, Flex, Link } from '@styles';
import MetatextCreateForm from '@sections/Metatext/MetatextCreateForm';
import { SearchableTable } from '@components/SearchableTable';
import SourceDocUploadForm from '@sections/SourceDocuments/SourceDocUploadForm';
// ...existing code...

// HomePage component
const Container = Box;
const WrapContainer = styled(Flex, {
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    '@bp1': { gap: '40px' },
});

const StyledLink = Link;

function HomePage(): ReactElement {
    // Fetch source documents and metatexts
    const sourceDocsQuery = useSourceDocuments();
    const metatextsQuery = useMetatexts();

    return (
        <Container>
            <WrapContainer data-testid="homepage-content">
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
            </WrapContainer>

            <StyledLink href="/experiments">
                Go to Experiments
            </StyledLink>
            <StyledLink href="/russiandolls" style={{ paddingLeft: '1rem' }}>
                Go to Experiments 2
            </StyledLink>
        </Container>
    );
}


export default HomePage;

// Landing page for managing Metatext documents, allowing users to create and browse existing Metatexts.
// Uses DocumentManagementLayout for consistent layout with other document management pages.
// Provides a searchable list of Metatexts and a form to create new Metatexts from source documents.

import React, { ReactElement } from 'react';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { SearchableList } from '@components/SearchableList'

import MetatextCreateForm from './components/MetatextCreateForm';
import { MetatextSummary, SourceDocumentSummary } from '@mtypes/index';
import { useDeleteMetatext } from '@features/documents/useDocumentsData';

interface MetatextPageProps {
    metatexts: MetatextSummary[] | undefined;
    sourceDocs: SourceDocumentSummary[] | undefined;
    stackProps?: any;
    headingProps?: any;
}

function MetatextPage({
    metatexts,
    sourceDocs,
    stackProps,
    headingProps,
}: MetatextPageProps): ReactElement {
    return (
        <Box>
            <Stack {...stackProps}>
                <Heading {...headingProps}>Metatexts</Heading>
                <SearchableList
                    items={metatexts || []}
                    filterKey="title"
                    navigateToBase="/metatext/"
                    deleteItemMutation={useDeleteMetatext()}
                />
                <MetatextCreateForm
                    sourceDocs={sourceDocs || []}
                    sourceDocsLoading={false}
                />
            </Stack>
        </Box>
    );
}

export default MetatextPage;

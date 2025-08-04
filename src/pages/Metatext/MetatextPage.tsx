// Landing page for managing Metatext documents, allowing users to create and browse existing Metatexts.
// Uses DocumentManagementLayout for consistent layout with other document management pages.
// Provides a searchable list of Metatexts and a form to create new Metatexts from source documents.

import React, { ReactElement } from 'react';
import { Box, Heading, Stack } from '@chakra-ui/react';

import MetatextCreateForm from './components/MetatextCreateForm';
import { MetatextSummary, SourceDocumentSummary } from '@mtypes/index';
import { useDeleteMetatext } from '@features/documents/useDocumentsData';
import { SearchInput, ControlledTable, useSearchResults } from '@components/SearchableTable';
interface MetatextPageProps {
    metatexts: MetatextSummary[];
    sourceDocs: SourceDocumentSummary[];
    stackProps?: any;
    headingProps?: any;
}

function MetatextPage({
    metatexts,
    sourceDocs,
    stackProps,
    headingProps,
}: MetatextPageProps): ReactElement {

    const { search, setSearch, inputRef, results } = useSearchResults(metatexts);
    return (
        <Box>
            <Stack {...stackProps}>
                <Heading {...headingProps}>Metatexts</Heading>
                <Box>

                    <SearchInput
                        search={search}
                        setSearch={setSearch}
                        inputRef={inputRef}
                    />

                    <ControlledTable
                        items={results}
                        navigateToBase="/metatext/"
                        deleteItemMutation={useDeleteMetatext()}
                    />
                </Box>

                <MetatextCreateForm
                    sourceDocs={sourceDocs || []}
                    sourceDocsLoading={false}
                />
            </Stack>
        </Box>
    );
}

export default MetatextPage;

/**
 * Section for selecting and creating metatexts.
 * This page displays a list of metatexts and allows users to create or delete metatexts.
 */

// The layout is a heading and a stack of components.
import React, { ReactElement } from 'react';
import { Box } from '@chakra-ui/react/box';
import { Heading } from '@chakra-ui/react/heading';
import { Stack } from '@chakra-ui/react/stack';

// Import the form for creating a new Metatext.
import MetatextCreateForm from './components/MetatextCreateForm';

// Import types for Metatext and SourceDocument summaries.
import { MetatextSummary, SourceDocumentSummary } from '@mtypes/index';

// Import the delete mutation for Metatexts. 
import { useDeleteMetatext } from '@features/documents/useDocumentsData';

// Import components for search functionality and table display.
import { SearchInput, ControlledTable, useSearchResults } from '@components/SearchableTable';


// This componenent uses the metatexts for display and the source documents for the creation form.
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


    // Deconstruct the search functionality from the custom hook.
    // The search input is used to filter the metatexts displayed in the table.
    // The results are passed to the ControlledTable for display.
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

// Source Document Page Component
import React, { ReactElement } from 'react';

// Chakra UI components
import { Box } from '@chakra-ui/react/box';
import { Heading } from '@chakra-ui/react/heading';
import { Stack } from '@chakra-ui/react/stack';

// Import the SourceDocUploadForm component for uploading source documents
import SourceDocUploadForm from '@pages/SourceDocument/components/SourceDocUploadForm'


// Import the useDeleteSourceDocument hook to handle deletion of source documents in the list
import { useDeleteSourceDocument } from '@features/documents/useDocumentsData';

// Import types for source documents
import { SourceDocumentSummary } from '@mtypes/documents';

import { SearchInput, ControlledTable, useSearchResults } from '@components/SearchableTable';

// The source document component takes a list of source documents and displays them in a table. 
interface SourceDocPageProps {
    sourceDocs: SourceDocumentSummary[];
    stackProps?: any;
    headingProps?: any;
}

function SourceDocPage({ sourceDocs, stackProps, headingProps }: SourceDocPageProps): ReactElement {
    const { search, setSearch, inputRef, results } = useSearchResults(sourceDocs);
    return (
        <Box>
            <Stack  {...stackProps}>
                <Heading {...headingProps}>Sources</Heading>
                <Box>

                    <SearchInput
                        search={search}
                        setSearch={setSearch}
                        inputRef={inputRef}
                    />
                    <ControlledTable
                        items={results}
                        navigateToBase="/sourcedoc/"
                        deleteItemMutation={useDeleteSourceDocument()}
                    />
                </Box>

                <SourceDocUploadForm />
            </Stack>
        </Box>
    );
}

export default SourceDocPage;

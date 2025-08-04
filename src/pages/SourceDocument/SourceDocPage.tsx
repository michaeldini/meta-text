// Source Document Page Component
import React, { ReactElement } from 'react';

// Chakra UI components
import { Box } from '@chakra-ui/react/box';
import { Heading } from '@chakra-ui/react/heading';
import { Stack } from '@chakra-ui/react/stack';

// Import the SourceDocUploadForm component for uploading source documents
import SourceDocUploadForm from '@pages/SourceDocument/components/SourceDocUploadForm'

// Import the SearchableList component to display source documents
import { SearchableList } from '@components/SearchableList'

// Import the useDeleteSourceDocument hook to handle deletion of source documents in the list
import { useDeleteSourceDocument } from '@features/documents/useDocumentsData';

// Import types for source documents
import { SourceDocumentSummary } from '@mtypes/documents';



interface SourceDocPageProps {
    sourceDocs: SourceDocumentSummary[] | undefined;
    stackProps?: any;
    headingProps?: any;
}

function SourceDocPage({ sourceDocs, stackProps, headingProps }: SourceDocPageProps): ReactElement {
    return (
        <Box>
            <Stack  {...stackProps}>
                <Heading {...headingProps}>Sources</Heading>
                <SearchableList
                    items={sourceDocs ?? []}
                    filterKey="title"
                    navigateToBase="/sourcedoc/"
                    deleteItemMutation={useDeleteSourceDocument()}
                />
                <SourceDocUploadForm
                // onSuccess={refetch}
                />
            </Stack>
        </Box>
    );
}

export default SourceDocPage;

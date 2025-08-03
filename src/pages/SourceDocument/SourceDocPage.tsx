// Landing page for source document management, allowing users to upload and manage source documents.
// Uses DocumentManagementLayout for consistent layout with other document management pages.
// Provides a searchable list of source documents and an upload form for new documents.



import React, { ReactElement } from 'react';

import { Box, Heading, Stack } from '@chakra-ui/react';
import { StackSeparator } from '@chakra-ui/react/stack';
import SourceDocUploadForm from '@pages/SourceDocument/components/SourceDocUploadForm'
import { SearchableList } from '@components/SearchableList'
import { SourceDocumentSummary } from '@mtypes/documents';




interface SourceDocPageProps {
    sourceDocs: SourceDocumentSummary[] | undefined;
    refetch: () => void;
    stackProps?: any;
    headingProps?: any;
}

function SourceDocPage({ sourceDocs, refetch, stackProps, headingProps }: SourceDocPageProps): ReactElement {
    return (
        <Box>
            <Stack {...stackProps}>
                <Heading {...headingProps}>Sources</Heading>
                <SearchableList
                    items={sourceDocs ?? []}
                    filterKey="title"
                    title="Source Documents"
                    // loading={isLoading}
                    searchPlaceholder="Search source documents..."
                    emptyMessage="No source documents found. Upload some documents to get started."
                    ariaLabel="List of source documents"
                />
                <SourceDocUploadForm
                    onSuccess={refetch}
                />
            </Stack>
        </Box>
    );
}

export default SourceDocPage;

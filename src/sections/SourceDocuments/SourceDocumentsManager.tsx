/**
 * SourceDocumentsManager
 * -----------------------------------------------------------------------------
 * Home/dashboard section for listing, searching, deleting, and uploading Source
 * Documents. Formerly `SourceDocPage`; now a pure sectional manager without
 * route-level responsibilities.
 */
import React, { ReactElement } from 'react';
import SourceDocUploadForm from './SourceDocUploadForm';
import { SearchableTable } from '@components/SearchableTable';
import { Heading } from '@chakra-ui/react/heading';
import { Stack } from '@chakra-ui/react/stack';
import { useDeleteSourceDocument } from '@features/documents/useDocumentsData';
import { SourceDocumentSummary } from '@mtypes/documents';

interface SourceDocumentsManagerProps {
    sourceDocs: SourceDocumentSummary[];
    stackProps?: any;
    headingProps?: any;
}

function SourceDocumentsManager({
    sourceDocs,
    stackProps,
    headingProps,
}: SourceDocumentsManagerProps): ReactElement {
    const deleteItemMutation = useDeleteSourceDocument();

    return (
        <Stack {...stackProps}>
            <Heading {...headingProps}>Sources</Heading>
            <SearchableTable
                documents={sourceDocs}
                showTitle={true}
                navigateToBase="/sourcedoc/"
                deleteItemMutation={deleteItemMutation}
            />
            <SourceDocUploadForm />
        </Stack>
    );
}

export default SourceDocumentsManager;

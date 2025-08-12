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
import SectionStack from '@components/SectionStack';
import { useDeleteSourceDocument } from '@features/documents/useDocumentsData';
import { SourceDocumentSummary } from '@mtypes/documents';

interface SourceDocumentsManagerProps {
    sourceDocs: SourceDocumentSummary[];
}

function SourceDocumentsManager({
    sourceDocs,
}: SourceDocumentsManagerProps): ReactElement {
    const deleteItemMutation = useDeleteSourceDocument();

    return (
        <SectionStack>
            <Heading size="sub">Sources</Heading>
            <SearchableTable
                documents={sourceDocs}
                showTitle={true}
                navigateToBase="/sourcedoc/"
                deleteItemMutation={deleteItemMutation}
            />
            <SourceDocUploadForm />
        </SectionStack>
    );
}

export default SourceDocumentsManager;

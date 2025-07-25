// Landing page for source document management, allowing users to upload and manage source documents.
// Uses DocumentManagementLayout for consistent layout with other document management pages.
// Provides a searchable list of source documents and an upload form for new documents.



import React, { ReactElement } from 'react';
import { useSourceDocuments } from 'features';

import {
    DocumentManagementLayout,
    PageContainer,
    SourceDocUploadForm,
    SearchableList,
    AppAlert
} from 'components';
// import { FADE_IN_DURATION } from 'constants';

import { useNotifications } from 'store';


function SourceDocPage(): ReactElement {
    // Fetch source documents using the new hook
    const { data: sourceDocs, isLoading: sourceDocsLoading, error: sourceDocsError, refetch } = useSourceDocuments();
    const { showSuccess, showError, showWarning, showInfo } = useNotifications();

    // Show error notification if there's an error fetching source documents
    if (sourceDocsError) {
        showError(`Failed to load source documents: ${sourceDocsError.message}`);
    }

    return (
        <PageContainer
            loading={sourceDocsLoading}
            data-testid="sourcedoc-list-page"
        >
            <DocumentManagementLayout
                title="Source Documents"
                subtitle="Upload a new source document or browse existing ones."
                formComponent={
                    <SourceDocUploadForm
                        onSuccess={refetch}
                    />
                }
                listComponent={
                    <SearchableList
                        items={sourceDocs ?? []}
                        filterKey="title"
                        title="Source Documents"
                        loading={sourceDocsLoading}
                        searchPlaceholder="Search source documents..."
                        emptyMessage="No source documents found. Upload some documents to get started."
                        ariaLabel="List of source documents"
                    />
                }
            />
        </PageContainer>
    );
}

export default SourceDocPage;

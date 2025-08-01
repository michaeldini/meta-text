// Landing page for source document management, allowing users to upload and manage source documents.
// Uses DocumentManagementLayout for consistent layout with other document management pages.
// Provides a searchable list of source documents and an upload form for new documents.



import React, { ReactElement } from 'react';
import { useSourceDocuments } from '@features/documents/useDocumentsData';


import DocumentManagementLayout from '@components/DocumentManagementLayout'
import { PageContainer } from '@components/PageContainer'
import SourceDocUploadForm from '@pages/SourceDocument/components/SourceDocUploadForm'
import { SearchableList } from '@components/SearchableList'


function SourceDocPage(): ReactElement {

    const { data: sourceDocs, isLoading, refetch } = useSourceDocuments();

    return (
        <PageContainer
            loading={isLoading}
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
                        loading={isLoading}
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

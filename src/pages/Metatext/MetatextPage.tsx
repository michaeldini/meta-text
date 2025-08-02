// Landing page for managing Metatext documents, allowing users to create and browse existing Metatexts.
// Uses DocumentManagementLayout for consistent layout with other document management pages.
// Provides a searchable list of Metatexts and a form to create new Metatexts from source documents.

import React, { ReactElement } from 'react';
import { PageContainer, } from '@components/PageContainer';
import DocumentManagementLayout from '@components/DocumentManagementLayout'
import { SearchableList } from '@components/SearchableList'

import MetatextCreateForm from './components/MetatextCreateForm';
import { MetatextSummary, SourceDocumentSummary } from '@mtypes/index';

interface MetatextPageProps {
    metatexts: MetatextSummary[] | undefined;
    refetch: () => void;
    sourceDocs: SourceDocumentSummary[] | undefined;
    isLoading: boolean;
}

function MetatextPage({
    metatexts,
    refetch,
    sourceDocs,
    isLoading
}: MetatextPageProps): ReactElement {
    return (
        <PageContainer
            loading={isLoading}
            data-testid="metatext-list-page"
        >
            <DocumentManagementLayout
                title="Metatexts"
                subtitle=""
                formComponent={
                    <MetatextCreateForm
                        sourceDocs={sourceDocs || []}
                        sourceDocsLoading={isLoading}
                        onSuccess={refetch}
                    />
                }
                listComponent={
                    <SearchableList
                        items={metatexts || []}
                        filterKey="title"
                        title="Metatext"
                        loading={isLoading}
                        searchPlaceholder="Search Metatext documents..."
                        emptyMessage="No Metatext documents found. Create some Metatexts from your source documents to get started."
                        ariaLabel="List of Metatext documents"
                    />
                }
            />
        </PageContainer>
    );
}

export default MetatextPage;

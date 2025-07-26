// Landing page for managing Metatext documents, allowing users to create and browse existing Metatexts.
// Uses DocumentManagementLayout for consistent layout with other document management pages.
// Provides a searchable list of Metatexts and a form to create new Metatexts from source documents.

import React, { ReactElement, useEffect } from 'react';

import { useSourceDocuments, useMetatexts } from 'features';
import {
    PageContainer,
    DocumentManagementLayout,
    SearchableList
} from 'components';

import MetatextCreateForm from './components/MetatextCreateForm';

function MetatextPage(): ReactElement {
    // Fetch metatexts and source documents using TanStack Query hooks
    const { data: metatexts, isLoading: metatextsLoading, refetch: refetchMetatexts } = useMetatexts();
    const { data: sourceDocs, isLoading: sourceDocsLoading } = useSourceDocuments();

    return (
        <PageContainer
            loading={metatextsLoading}
            data-testid="metatext-list-page"
        >
            <DocumentManagementLayout
                title="Metatext Documents"
                subtitle="Create new Metatext from a source document or browse existing ones."
                formComponent={
                    <MetatextCreateForm
                        sourceDocs={sourceDocs || []}
                        sourceDocsLoading={sourceDocsLoading}
                        onSuccess={refetchMetatexts}
                    />
                }
                listComponent={
                    <SearchableList
                        items={metatexts || []}
                        filterKey="title"
                        title="Metatext"
                        loading={metatextsLoading}
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

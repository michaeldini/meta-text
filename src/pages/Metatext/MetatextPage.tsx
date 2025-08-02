// Landing page for managing Metatext documents, allowing users to create and browse existing Metatexts.
// Uses DocumentManagementLayout for consistent layout with other document management pages.
// Provides a searchable list of Metatexts and a form to create new Metatexts from source documents.

import React, { ReactElement } from 'react';

import { useMetatextPage } from './hooks/useMetatextPage';
import { PageContainer, } from '@components/PageContainer';
import DocumentManagementLayout from '@components/DocumentManagementLayout'
import { SearchableList } from '@components/SearchableList'

import MetatextCreateForm from './components/MetatextCreateForm';

function MetatextPage(): ReactElement {
    // Use custom hook for all page logic
    const {
        metatexts,
        metatextsLoading,
        refetchMetatexts,
        sourceDocs,
        sourceDocsLoading
    } = useMetatextPage();

    return (
        <PageContainer
            loading={metatextsLoading}
            data-testid="metatext-list-page"
        >
            <DocumentManagementLayout
                title="Metatexts"
                subtitle=""
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

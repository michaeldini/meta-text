// Landing page for managing Metatext documents, allowing users to create and browse existing Metatexts.
// Uses DocumentManagementLayout for consistent layout with other document management pages.
// Provides a searchable list of Metatexts and a form to create new Metatexts from source documents.

import React, { ReactElement, useEffect } from 'react';
import { Slide } from '@mui/material';

import { useDocumentsStore } from 'store';
import {
    PageContainer,
    DocumentManagementLayout,
    SearchableList
} from 'components';
import { FADE_IN_DURATION } from 'constants';

import MetatextCreateForm from './components/temp_MetatextCreateForm';

function MetatextPage(): ReactElement {

    const {
        metatexts,
        metatextsLoading,
        metatextsError, // TODO
        fetchMetatexts,
        sourceDocs,
        sourceDocsLoading,
        sourceDocsError,
        fetchSourceDocs,
    } = useDocumentsStore();



    // Fetch documents when component mounts, but only if not already loaded or loading
    useEffect(() => {
        if (!metatexts.length && !metatextsLoading) {
            fetchMetatexts();
        }
        if (!sourceDocs.length && !sourceDocsLoading) {
            fetchSourceDocs(); // Needed for the create form
        }
    }, [fetchMetatexts, fetchSourceDocs, metatexts.length, metatextsLoading, sourceDocs.length, sourceDocsLoading]);

    // Refresh data after successful creation
    const handleCreateSuccess = () => {
        fetchMetatexts();
    };
    return (
        <PageContainer
            loading={metatextsLoading}
            data-testid="metatext-list-page"
        >
            {/* Smooth slide-up animation for the page content */}
            <Slide in={true} direction="up" timeout={FADE_IN_DURATION}>
                <DocumentManagementLayout
                    title="Metatext Documents"
                    subtitle="Create new Metatext from a source document or browse existing ones."
                    formComponent={
                        <MetatextCreateForm
                            sourceDocs={sourceDocs}
                            sourceDocsLoading={sourceDocsLoading}
                            sourceDocsError={sourceDocsError}
                            onSuccess={handleCreateSuccess}
                        />
                    }
                    listComponent={
                        <SearchableList
                            items={metatexts}
                            filterKey="title"
                            title="Metatext"
                            loading={metatextsLoading}
                            searchPlaceholder="Search Metatext documents..."
                            emptyMessage="No Metatext documents found. Create some Metatexts from your source documents to get started."
                            ariaLabel="List of Metatext documents"
                        />
                    }
                />
            </Slide>
        </PageContainer>
    );
}

// Export with a more descriptive name for TypeDoc
export { MetatextPage };

// Default export for React component usage
export default MetatextPage;

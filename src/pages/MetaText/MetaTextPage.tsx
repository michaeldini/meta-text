// Landing page for managing MetaText documents, allowing users to create and browse existing MetaTexts.
// Uses DocumentManagementLayout for consistent layout with other document management pages.
// Provides a searchable list of MetaTexts and a form to create new MetaTexts from source documents.

import React, { ReactElement, useEffect } from 'react';
import { Slide } from '@mui/material';

import { useDocumentsStore } from 'store';
import {
    PageContainer,
    DocumentManagementLayout,
    SearchableList
} from 'components';

import MetaTextCreateForm from './components/MetaTextCreateForm';

function MetaTextPage(): ReactElement {

    const {
        metaTexts,
        metaTextsLoading,
        metaTextsError, // TODO
        fetchMetaTexts,
        sourceDocs,
        sourceDocsLoading,
        sourceDocsError,
        fetchSourceDocs,
    } = useDocumentsStore();

    // Fetch documents when component mounts
    useEffect(() => {
        fetchMetaTexts();
        fetchSourceDocs(); // Needed for the create form
    }, [fetchMetaTexts, fetchSourceDocs]);

    // Refresh data after successful creation
    const handleCreateSuccess = () => {
        fetchMetaTexts();
    };
    return (
        <PageContainer
            loading={metaTextsLoading}
            data-testid="metatext-list-page"
        >
            {/* Smooth slide-up animation for the page content */}
            <Slide in={true} direction="up" timeout={500}>
                <DocumentManagementLayout
                    title="MetaText Documents"
                    subtitle="Create new MetaText from a source document or browse existing ones."
                    formComponent={
                        <MetaTextCreateForm
                            sourceDocs={sourceDocs}
                            sourceDocsLoading={sourceDocsLoading}
                            sourceDocsError={sourceDocsError}
                            onSuccess={handleCreateSuccess}
                        />
                    }
                    listComponent={
                        <SearchableList
                            items={metaTexts}
                            filterKey="title"
                            title="MetaText"
                            loading={metaTextsLoading}
                            searchPlaceholder="Search MetaText documents..."
                            emptyMessage="No MetaText documents found. Create some MetaTexts from your source documents to get started."
                            ariaLabel="List of MetaText documents"
                        />
                    }
                />
            </Slide>
        </PageContainer>
    );
}

// Export with a more descriptive name for TypeDoc
export { MetaTextPage };

// Default export for React component usage
export default MetaTextPage;

// Landing page for source document management, allowing users to upload and manage source documents.
// Uses DocumentManagementLayout for consistent layout with other document management pages.
// Provides a searchable list of source documents and an upload form for new documents.


import React, { ReactElement, useEffect } from 'react';
import { Slide } from '@mui/material';

import { useDocumentsStore } from 'store';

import {
    DocumentManagementLayout,
    PageContainer,
    SourceDocUploadForm,
    SearchableList,
    AppAlert
} from 'components';
import { FADE_IN_DURATION } from 'constants';

function SourceDocPage(): ReactElement {

    const {
        sourceDocs,
        sourceDocsLoading,
        sourceDocsError,
        fetchSourceDocs
    } = useDocumentsStore();

    // Fetch source documents when the component mounts, but only if not already loaded or loading
    useEffect(() => {
        if (!sourceDocs.length && !sourceDocsLoading) {
            fetchSourceDocs();
        }
    }, [fetchSourceDocs, sourceDocs.length, sourceDocsLoading]);

    return (
        <PageContainer
            loading={sourceDocsLoading}
            data-testid="sourcedoc-list-page"
        >
            {sourceDocsError && (
                <AppAlert severity="error">
                    {sourceDocsError}
                </AppAlert>
            )}
            {/* Smooth slide-up animation for the page content */}
            <Slide in={true} direction="up" timeout={FADE_IN_DURATION}>
                <div>
                    <DocumentManagementLayout
                        title="Source Documents"
                        subtitle="Upload a new source document or browse existing ones."
                        formComponent={
                            <SourceDocUploadForm
                                onSuccess={fetchSourceDocs}
                            />
                        }
                        listComponent={
                            <SearchableList
                                items={sourceDocs}
                                filterKey="title"
                                title="Source Documents"
                                loading={sourceDocsLoading}
                                searchPlaceholder="Search source documents..."
                                emptyMessage="No source documents found. Upload some documents to get started."
                                ariaLabel="List of source documents"
                            />
                        }
                    />
                </div>
            </Slide>
        </PageContainer>
    );
}

export default SourceDocPage;

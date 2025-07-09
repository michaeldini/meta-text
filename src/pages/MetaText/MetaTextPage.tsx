import React, { ReactElement, useEffect } from 'react';
import { useDocumentsStore } from '../../store/documentsStore';
import { Slide } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    PageContainer,
    DocumentListLayout,
} from 'components';
import MetaTextCreateForm from './components/MetaTextCreateForm';
import { SearchableList } from 'features';

function MetaTextPage(): ReactElement {

    const {
        metaTexts,
        metaTextsLoading,
        metaTextsError,
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
                <DocumentListLayout
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

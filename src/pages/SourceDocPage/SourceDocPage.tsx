/**
 * @fileoverview SourceDocPage component for the MetaText application
 * 
 * This page component provides a comprehensive interface for source document management,
 * including uploading new source documents and browsing/searching existing ones.
 * Users can upload documents and navigate to detailed views for analysis.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-09
 */

import React, { ReactElement, useEffect } from 'react';
import { useDocumentsStore } from '../../store/documentsStore';
import { Slide } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getAppStyles } from '../../styles/styles';
import { usePageLogger } from '../../hooks/usePageLogger';
import PageContainer from '../../components/PageContainer';
import SourceDocUploadForm from '../../components/SourceDocUploadForm';
import SearchableList from '../../features/searchablelist/components/SearchableList';
import DocumentListLayout from '../../components/DocumentListLayout';

/**
 * SourceDocPage Component
 * 
 * A comprehensive page component that provides the main interface for source document
 * management. This component serves as the central hub for users to upload new source
 * documents and browse/search existing source documents.
 * 
 * Features:
 * - Upload form for new source documents
 * - Searchable list of all source documents
 * - Document filtering and search functionality
 * - Navigation to detailed document view
 * - Loading states during data fetching
 * - Error handling for API failures
 * - Delete functionality for document management
 * - Responsive design with smooth animations
 * 
 * @category Components
 * @subcategory Pages
 * @component
 * @example
 * ```tsx
 * // Used in React Router configuration
 * <Route 
 *   path="/sourcedoc" 
 *   component={SourceDocPage} 
 * />
 * ```
 * 
 * @returns {ReactElement} The rendered SourceDocPage component
 */
function SourceDocPage(): ReactElement {
    // Initialize page logging
    usePageLogger('SourceDocPage');

    /**
     * Source documents data and state management
     * 
     * This manages:
     * - Fetching source documents list from the API
     * - Loading state management during data fetch
     * - Error handling and user feedback
     * - Document deletion operations
     */
    const {
        sourceDocs,
        sourceDocsLoading,
        sourceDocsError,
        fetchSourceDocs
    } = useDocumentsStore();

    /**
     * Fetch source documents when component mounts
     */
    useEffect(() => {
        fetchSourceDocs();
    }, [fetchSourceDocs]);

    /**
     * Get the current theme for styling
     */
    const theme = useTheme();
    const styles = getAppStyles(theme);
    return (
        <PageContainer
            loading={sourceDocsLoading}
            data-testid="sourcedoc-list-page"
        >
            {/* Smooth slide-up animation for the page content */}
            <Slide in={true} direction="up" timeout={500}>
                <DocumentListLayout
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
            </Slide>
        </PageContainer>
    );
}

export default SourceDocPage;

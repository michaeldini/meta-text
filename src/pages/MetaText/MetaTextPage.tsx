/**
 * @fileoverview MetaTextPage component for the MetaText application
 * 
 * This page component provides a comprehensive interface for MetaText document management,
 * including creation of new MetaText documents and browsing/searching existing ones.
 * Users can create MetaTexts from source documents and navigate to detailed views.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-09
 */

import React, { ReactElement, useEffect } from 'react';
import { useDocumentsStore } from '../../store/documentsStore';
import { Slide } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { usePageLogger } from '../../hooks/usePageLogger';
import {
    PageContainer,
    DocumentListLayout,
} from '../../components';
import MetaTextCreateForm from './components/MetaTextCreateForm';
import SearchableList from '../../features/searchablelist/components/SearchableList';

/**
 * MetaTextPage Component
 * 
 * A comprehensive page component that provides the main interface for MetaText document
 * management. This component serves as the central hub for users to create new MetaText
 * documents from source documents and browse/search existing MetaText documents.
 * 
 * Features:
 * - Create form for new MetaText documents from source documents
 * - Searchable list of all MetaText documents
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
 *   path="/metatext" 
 *   component={MetaTextPage} 
 * />
 * ```
 * 
 * @returns {ReactElement} The rendered MetaTextPage component
 */
function MetaTextPage(): ReactElement {
    // Initialize page logging
    usePageLogger('MetaTextPage');

    /**
     * Documents data and state management
     * 
     * This manages:
     * - Fetching MetaText documents list from the API
     * - Fetching source documents for the create form
     * - Loading state management during data fetch
     * - Error handling and user feedback
     * - Document deletion operations
     */
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

    /**
     * Fetch documents when component mounts
     */
    useEffect(() => {
        fetchMetaTexts();
        fetchSourceDocs(); // Needed for the create form
    }, [fetchMetaTexts, fetchSourceDocs]);

    /**
     * Refresh data after successful creation
     */
    const handleCreateSuccess = () => {
        fetchMetaTexts();
    };

    /**
     * Get the current theme for styling
     */
    const theme = useTheme();
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

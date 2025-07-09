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

import { useEffect } from 'react';
import { Box, Typography, Slide } from '@mui/material';
import type { ReactElement } from 'react';

import { SearchableList } from 'features';
import { PageContainer, MetaTextCreateForm } from 'components';
import { useDocumentsStore } from 'store';
import { usePageLogger } from 'hooks';

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
        fetchSourceDocs
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

    return (
        <PageContainer
            loading={metaTextsLoading}
            data-testid="metatext-list-page"
        >
            {/* Smooth slide-up animation for the page content */}
            <Slide in={true} direction="up" timeout={500}>
                <Box data-testid="metatext-list-content">
                    {/* Page header */}
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 'bold',
                                mb: 1,
                                color: 'text.primary'
                            }}
                        >
                            MetaText Documents
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Create new MetaText from a source document or browse existing ones.
                        </Typography>
                    </Box>

                    {/* Create form for new MetaText documents */}
                    <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 10 }}>
                        <MetaTextCreateForm
                            sourceDocs={sourceDocs}
                            sourceDocsLoading={sourceDocsLoading}
                            sourceDocsError={sourceDocsError}
                            onSuccess={handleCreateSuccess}
                            sx={{ mb: { xs: 3, md: 0 } }}
                        />

                        {/* Searchable list of MetaText documents */}
                        <SearchableList
                            items={metaTexts}
                            filterKey="title"
                            title="MetaText"
                            loading={metaTextsLoading}
                            searchPlaceholder="Search MetaText documents..."
                            emptyMessage="No MetaText documents found. Create some MetaTexts from your source documents to get started."
                            ariaLabel="List of MetaText documents"
                        />
                    </Box>
                </Box>
            </Slide>
        </PageContainer>
    );
}

// Export with a more descriptive name for TypeDoc
export { MetaTextPage };

// Default export for React component usage
export default MetaTextPage;

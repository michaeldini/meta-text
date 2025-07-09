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

import { useEffect } from 'react';
import { Box, Typography, Slide } from '@mui/material';
import type { ReactElement } from 'react';

import { SearchableList } from 'features';
import { PageContainer, SourceDocUploadForm } from 'components';
import { useDocumentsStore } from 'store';
import { usePageLogger } from 'hooks';

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

    return (
        <PageContainer
            loading={sourceDocsLoading}
            data-testid="sourcedoc-list-page"
        >
            {/* Smooth slide-up animation for the page content */}
            <Slide in={true} direction="up" timeout={500}>
                <Box data-testid="sourcedoc-list-content"
                    sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    {/* Page header */}
                    <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 'bold',
                                mb: 1,
                                color: 'text.primary'
                            }}
                        >
                            Source Documents
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Upload a new source document or browse existing ones.
                        </Typography>
                    </Box>

                    {/* Upload form for new documents */}
                    <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 10 }}>
                        <SourceDocUploadForm
                            onSuccess={fetchSourceDocs}
                            sx={{ mb: 3 }}
                        />

                        {/* Searchable list of source documents */}
                        <SearchableList
                            items={sourceDocs}
                            filterKey="title"
                            title="Source Documents"
                            loading={sourceDocsLoading}
                            searchPlaceholder="Search source documents..."
                            emptyMessage="No source documents found. Upload some documents to get started."
                            ariaLabel="List of source documents"
                        />
                    </Box>
                </Box>
            </Slide>
        </PageContainer>
    );
}

// Export with a more descriptive name for TypeDoc
export { SourceDocPage };

// Default export for React component usage
export default SourceDocPage;

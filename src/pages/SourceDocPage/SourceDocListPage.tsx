/**
 * @fileoverview SourceDocListPage component for the MetaText application
 * 
 * This page component displays a list of all available source documents, providing
 * users with the ability to search, browse, and select source documents for viewing.
 * Users can then navigate to the detailed view of any selected document.
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
 * SourceDocListPage Component
 * 
 * A comprehensive page component that displays a searchable list of source documents.
 * This component serves as the entry point for users to browse and select source
 * documents for detailed viewing and analysis.
 * 
 * Features:
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
 *   component={SourceDocListPage} 
 * />
 * ```
 * 
 * @returns {ReactElement} The rendered SourceDocListPage component
 */
function SourceDocListPage(): ReactElement {
    // Initialize page logging
    usePageLogger('SourceDocListPage');

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
                <Box data-testid="sourcedoc-list-content">
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
                            Source Documents
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Browse and select source documents to view their detailed content and analysis.
                        </Typography>
                    </Box>

                    {/* Upload form for new documents */}
                    <Box sx={{ mb: 4 }}>
                        <SourceDocUploadForm
                            onSuccess={fetchSourceDocs}
                            sx={{ mb: 3 }}
                        />
                    </Box>

                    {/* Searchable list of source documents */}
                    <SearchableList
                        items={sourceDocs}
                        filterKey="title"
                        title="sourceDoc"
                        loading={sourceDocsLoading}
                        searchPlaceholder="Search source documents..."
                        emptyMessage="No source documents found. Upload some documents to get started."
                        ariaLabel="List of source documents"
                    />
                </Box>
            </Slide>
        </PageContainer>
    );
}

// Export with a more descriptive name for TypeDoc
export { SourceDocListPage };

// Default export for React component usage
export default SourceDocListPage;

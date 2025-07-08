/**
 * @fileoverview SourceDocDetailPage component for the MetaText application
 * 
 * This page component displays the detailed view of a source document, providing
 * users with the ability to view, analyze, and interact with original source
 * documents that serve as the foundation for MetaText generation and analysis.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-08
 */

import { useParams } from 'react-router-dom';
import { Alert, Box, Slide } from '@mui/material';
import type { ReactElement } from 'react';

import { SourceDocInfo, SourceDoc } from 'features';
import { useSourceDocDetailData } from './useSourceDocDetailData';
import { log } from 'utils';
import { PageContainer } from 'components';
import { usePageLogger } from 'hooks';
import { GenerateSourceDocInfoButton, StyleControls, DocumentHeader } from 'components';

/**
 * SourceDocDetailPage Component
 * 
 * A comprehensive page component that displays the detailed view of a source document.
 * This component serves as the primary interface for users to review and analyze
 * original source documents, providing tools for document information generation
 * and style customization.
 * 
 * Features:
 * - Dynamic route parameter handling for source document ID
 * - Document header with title and action controls
 * - Source document information display and generation
 * - Style controls for user customization
 * - Full document content rendering
 * - Error handling for missing documents
 * - Responsive design with smooth animations
 * - Loading states during data fetching
 * 
 * @category Components
 * @subcategory Pages
 * @component
 * @example
 * ```tsx
 * // Used in React Router configuration
 * <Route 
 *   path="/sourcedoc/:sourceDocId" 
 *   component={SourceDocDetailPage} 
 * />
 * 
 * // Direct usage (not recommended - use routing)
 * <SourceDocDetailPage />
 * ```
 * 
 * @returns {ReactElement} The rendered SourceDocDetailPage component
 */
function SourceDocDetailPage(): ReactElement {
    /**
     * Extract source document ID from URL parameters
     * @type {string | undefined}
     */
    const { sourceDocId } = useParams<{ sourceDocId?: string }>();

    /**
     * Source document data, loading state, and error handling
     * 
     * This hook manages:
     * - Fetching source document detail data from the API
     * - Loading state management during data fetch
     * - Error handling and user feedback
     * - Data refetch functionality for updates
     * - Document validation and transformation
     */
    const { doc, loading, error, refetch } = useSourceDocDetailData(sourceDocId);


    return (
        <PageContainer
            loading={loading}
            data-testid="sourcedoc-detail-page"
        >
            {/* Smooth slide-up animation for the page content */}
            <Slide in={true} direction="up" timeout={500}>
                <Box data-testid="sourcedoc-detail-content">
                    {doc ? (
                        <>
                            {/* Document header with title and action controls */}
                            <DocumentHeader title={doc.title}>
                                {/* Generate source document information button */}
                                <GenerateSourceDocInfoButton
                                    sourceDocumentId={doc.id}
                                />

                                {/* Style customization controls */}
                                <StyleControls />

                                {/* Source document information display */}
                                <SourceDocInfo sourceDocumentId={doc.id} />
                            </DocumentHeader>

                            {/* Main content area displaying the full source document */}
                            <SourceDoc doc={doc} />
                        </>
                    ) : (
                        // Error state when document is not found
                        <Alert
                            severity="info"
                            data-testid="sourcedoc-not-found"
                        >
                            Document not found.
                        </Alert>
                    )}
                </Box>
            </Slide>
        </PageContainer>
    );
}

// Export with a more descriptive name for TypeDoc
export { SourceDocDetailPage };

// Default export for React component usage
export default SourceDocDetailPage;

/**
 * @fileoverview MetaTextDetailPage component for the MetaText application
 * 
 * This page component displays the detailed view of a MetaText document, allowing users
 * to review and interact with document chunks. It provides tools for navigation, editing,
 * and analysis of MetaText content with associated source document information.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-08
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, useTheme, Alert, Fade, Typography, Slide } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';

import { log } from 'utils';
import { LoadingBoundary, PageContainer, ReviewButton } from 'components';
import { usePageLogger } from 'hooks';
import { ChunkToolButtons, SourceDocInfo } from 'features';
import { PaginatedChunks } from 'features';
import { FADE_IN_DURATION } from 'constants';
import { useMetaTextDetailData } from './useMetaTextDetailData';

import { getMetaTextPageStyles } from './MetaText.styles';
import { GenerateSourceDocInfoButton, StyleControls, DocumentHeader } from 'components';

/**
 * MetaTextDetailPage Component
 * 
 * A comprehensive page component that displays the detailed view of a specific MetaText
 * document. This component serves as the main interface for users to review, analyze,
 * and interact with MetaText content organized into chunks.
 * 
 * Features:
 * - Dynamic route parameter handling for MetaText ID
 * - Document header with title and action buttons
 * - Review functionality for document analysis
 * - Source document information integration
 * - Style controls for user customization
 * - Chunk-based content navigation and interaction
 * - Responsive design with smooth animations
 * - Loading states and error handling
 * 
 * @category Components
 * @subcategory Pages
 * @component
 * @example
 * ```tsx
 * // Used in React Router configuration
 * <Route 
 *   path="/metatext/:metaTextId" 
 *   component={MetaTextDetailPage} 
 * />
 * 
 * // Direct usage (not recommended - use routing)
 * <MetaTextDetailPage />
 * ```
 * 
 * @returns {ReactElement | null} The rendered MetaTextDetailPage component or null if invalid ID
 */
function MetaTextDetailPage(): ReactElement | null {
    /**
     * Extract MetaText ID from URL parameters
     * @type {string | undefined}
     */
    const { metaTextId } = useParams<{ metaTextId: string }>();

    /**
     * Early validation and guard clause for invalid MetaText ID
     * Returns null if the ID is missing or not a valid number
     */
    if (!metaTextId || Number.isNaN(Number(metaTextId))) {
        return null;
    }

    /**
     * Material-UI theme object for accessing design tokens
     * @type {Theme}
     */
    const theme: Theme = useTheme();

    /**
     * Computed styles for the MetaTextDetailPage based on the current theme
     * @type {ReturnType<typeof getMetaTextPageStyles>}
     */
    const styles = getMetaTextPageStyles(theme);

    /**
     * MetaText data, loading state, and error handling
     * 
     * This hook manages:
     * - Fetching MetaText detail data from the API
     * - Loading state management during data fetch
     * - Error handling and user feedback
     * - Data validation and transformation
     */
    const { metaText, loading, errors } = useMetaTextDetailData(metaTextId);

    return (
        <PageContainer
            loading={loading}
            data-testid="metatext-detail-page"
        >
            {metaText ? (
                // Smooth slide-up animation for the page content
                <Slide in={true} direction="up" timeout={500}>
                    <Box sx={styles.container} data-testid="metatext-detail-content">
                        {/* Document header with title and action controls */}
                        <DocumentHeader title={metaText.title}>
                            {/* Review functionality button */}
                            <ReviewButton metaTextId={metaText.id} />

                            {/* Generate source document information button */}
                            <GenerateSourceDocInfoButton
                                sourceDocumentId={metaText.source_document_id}
                            />

                            {/* Style customization controls */}
                            <StyleControls />

                            {/* Source document information display */}
                            <SourceDocInfo
                                sourceDocumentId={metaText.source_document_id}
                            />
                        </DocumentHeader>

                        {/* Main content area displaying document chunks */}
                        <PaginatedChunks metaTextId={metaText.id} />

                        {/* Floating navigation toolbar for chunk tools */}
                        <ChunkToolButtons />
                    </Box>
                </Slide>
            ) : null}
        </PageContainer>
    );
}

// Export with a more descriptive name for TypeDoc
export { MetaTextDetailPage };

// Default export for React component usage
export default MetaTextDetailPage;

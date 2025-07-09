/**
 * @fileoverview MetaTextReviewPage component for the MetaText application
 * 
 * This page component provides a comprehensive review interface for MetaText documents,
 * offering multiple learning and analysis tools including flashcards, phrase explanations,
 * and chunk summaries. It serves as a study and analysis hub for processed MetaText content.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-08
 */

import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';

import { LoadingIndicator, ErrorAlert, Header, ReviewContent } from 'components';
import { useMetaTextReviewData } from 'hooks';

import { getMetaTextReviewStyles } from './MetaText.styles';

/**
 * MetaTextReviewPage Component
 * 
 * A comprehensive review page that provides multiple learning and analysis tools
 * for MetaText documents. This component serves as a study hub, offering flashcards,
 * phrase explanations, and chunk summaries in an organized, collapsible interface.
 * 
 * Features:
 * - Dynamic route parameter handling for MetaText ID
 * - Concurrent data fetching for wordlist, chunks, and phrase explanations
 * - Interactive flashcard system for vocabulary learning
 * - Phrase explanations for contextual understanding
 * - Chunk summary and notes table for content overview
 * - Collapsible accordion interface for organized content
 * - Loading states and comprehensive error handling
 * - Navigation integration with back button
 * - Responsive design for various screen sizes
 * 
 * @category Components
 * @subcategory Pages
 * @component
 * @example
 * ```tsx
 * // Used in React Router configuration
 * <Route 
 *   path="/metaText/:metaTextId/review" 
 *   component={MetaTextReviewPage} 
 * />
 * 
 * // Direct usage (not recommended - use routing)
 * <MetaTextReviewPage />
 * ```
 * 
 * @returns {ReactElement} The rendered MetaTextReviewPage component
 */
function MetaTextReviewPage(): ReactElement {
    /**
     * Extract MetaText ID from URL parameters and convert to number
     */
    const { metaTextId: metatextIdParam } = useParams<{ metaTextId?: string }>();
    const metatextId: number | undefined = metatextIdParam ? Number(metatextIdParam) : undefined;

    /**
     * React Router navigation function for programmatic navigation
     */
    const navigate = useNavigate();

    /**
     * Material-UI theme object for accessing design tokens
     */
    const theme: Theme = useTheme();

    /**
     * Computed styles for the MetaTextReviewPage based on the current theme
     */
    const styles = getMetaTextReviewStyles(theme);

    /**
     * Custom hook for fetching all review data
     */
    const { wordlist, chunkSummariesNotes, phraseExplanations, loading, error } =
        useMetaTextReviewData(metatextId);

    // Early returns for loading and error states
    if (loading) return (
        <Box sx={styles.root} data-testid="metatext-review-loading">
            <LoadingIndicator styles={styles} />
        </Box>
    );

    if (error) return (
        <Box sx={styles.root} data-testid="metatext-review-error">
            <ErrorAlert message={error} />
        </Box>
    );

    return (
        <Box sx={styles.root} data-testid="metatext-review-page">
            {/* Page header with navigation and title */}
            <Header metatextId={metatextId} navigate={navigate} styles={styles} />

            {/* Review content sections */}
            <ReviewContent
                phraseExplanations={phraseExplanations}
                wordlist={wordlist}
                chunkSummariesNotes={chunkSummariesNotes}
            />
        </Box>
    );
}

// Export with a more descriptive name for TypeDoc
export { MetaTextReviewPage };

// Default export for React component usage
export default MetaTextReviewPage;

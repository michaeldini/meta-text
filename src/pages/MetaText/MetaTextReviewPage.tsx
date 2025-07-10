// Review page for a MetaText document, providing a comprehensive review interface with flashcards, phrase explanations, and chunk data table.

import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';

import { AppAlert } from 'components';
import { LoadingIndicator, Header, ReviewContent } from './components';
import { useMetaTextReviewData } from './hooks/useMetaTextReviewData';

import { getMetaTextReviewStyles } from './MetaText.styles';

function MetaTextReviewPage(): ReactElement {

    // Extract MetaText ID from URL parameters and convert to number
    const { metaTextId: metatextIdParam } = useParams<{ metaTextId?: string }>();

    // Convert the metatextIdParam to a number, or undefined if not present TODO: handle invalid IDs gracefully
    const metatextId: number | undefined = metatextIdParam ? Number(metatextIdParam) : undefined;

    // React Router navigation function for programmatic navigation
    const navigate = useNavigate();


    // Custom hook for fetching all review data
    const { wordlist, chunkSummariesNotes, phraseExplanations, loading, error } =
        useMetaTextReviewData(metatextId);

    const theme: Theme = useTheme();
    const styles = getMetaTextReviewStyles(theme);

    // Early returns for loading and error states
    if (loading) return (
        <Box sx={styles.root} data-testid="metatext-review-loading">
            <LoadingIndicator />
        </Box>
    );

    if (error) return (
        <Box sx={styles.root} data-testid="metatext-review-error">
            <AppAlert severity="error" >
                {error}
            </AppAlert>
        </Box>
    );

    return (
        <Box sx={styles.root} data-testid="metatext-review-page">
            {/* Page header with navigation and title */}
            <Header metatextId={metatextId} navigate={navigate} styles={styles} />

            {/* Review content sections */}
            <ReviewContent
                phraseExplanations={phraseExplanations}
                flashcards={wordlist}
                chunkSummariesNotes={chunkSummariesNotes}
            />
        </Box>
    );
}

// Default export for React component usage
export default MetaTextReviewPage;

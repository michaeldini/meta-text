// Review page for a Metatext document, providing a comprehensive review interface with flashcards, phrase explanations, and chunk data table.

import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';
import { useMemo } from 'react';

import { AppAlert } from 'components';
import { LoadingIndicator, Header, ReviewContent } from './components';
import { useMetatextReviewData } from './hooks/useMetatextReviewData';
import { useValidatedIdParam } from 'utils';

import { getMetatextReviewStyles } from './Metatext.styles';

function MetatextReviewPage(): ReactElement {

    // Extract Metatext ID from URL parameters and validate it
    const { metatextId: metatextIdParam } = useParams<{ metatextId?: string }>();

    // Validate and parse the ID parameter using utility hook
    const { id: metatextId, isValid: isValidId, originalValue } = useValidatedIdParam(metatextIdParam);

    // React Router navigation function for programmatic navigation
    const navigate = useNavigate();

    // Custom hook for fetching all review data
    const { wordList, chunks, phraseList, loading, error } =
        useMetatextReviewData(metatextId);
    console.log('MetatextReviewPage data:', {
        wordList,
        phraseList,
        chunks
    });
    const theme: Theme = useTheme();
    const styles = getMetatextReviewStyles(theme);

    // Handle invalid ID parameter
    if (metatextIdParam && !isValidId) {
        return (
            <Box sx={styles.root} data-testid="metatext-review-invalid-id">
                <AppAlert severity="error">
                    Invalid Metatext ID "{originalValue}". Please provide a valid positive number.
                </AppAlert>
            </Box>
        );
    }

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
                wordList={wordList}
                phraseList={phraseList}
                chunkReviewTable={chunks}
            />
        </Box>
    );
}

// Default export for React component usage
export default MetatextReviewPage;

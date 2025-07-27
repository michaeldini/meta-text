// Review page for a Metatext document, providing a comprehensive review interface with flashcards, phrases, and chunk data table.

import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react/box';
import { Spinner } from '@chakra-ui/react/spinner';
import type { ReactElement } from 'react';

import { AppAlert } from 'components';
import { Header, ReviewContent } from './components';
import { useMetatextReviewData } from './hooks/useMetatextReviewData';
function MetatextReviewPage(): ReactElement {

    // Get the raw Metatext ID string from the URL parameters (may be undefined or invalid)
    const { metatextId } = useParams<{ metatextId?: string }>();
    const parsedId = metatextId ? Number(metatextId) : undefined;


    // React Router navigation function for programmatic navigation
    const navigate = useNavigate();

    // Custom hook for fetching all review data
    const { wordList, phraseList, chunks, loading, error } =
        useMetatextReviewData(parsedId);


    // Early returns for loading and error states
    if (loading) return (
        <Box data-testid="metatext-review-loading">
            <Spinner />
        </Box>
    );

    if (error) return (
        <Box data-testid="metatext-review-error">
            <AppAlert severity="error" >
                {error}
            </AppAlert>
        </Box>
    );

    return (
        <Box data-testid="metatext-review-page">
            {/* Page header with navigation and title */}
            <Header metatextId={parsedId} navigate={navigate} />

            {/* Review content sections */}
            <ReviewContent
                flashcards={wordList}
                phrases={phraseList}
                chunkReviewTable={chunks}
            />
        </Box>
    );
}

// Default export for React component usage
export default MetatextReviewPage;

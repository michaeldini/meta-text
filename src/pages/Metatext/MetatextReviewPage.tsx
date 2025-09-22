// Review page for a Metatext document, providing a comprehensive review interface with flashcards, phrases, and chunk data table.

import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@styles';
import type { ReactElement } from 'react';

import { Header, ReviewContent } from './components';
import { useMetatextReviewData } from './hooks/useMetatextReviewData';

function MetatextReviewPage(): ReactElement {
    // Get the raw Metatext ID string from the URL parameters (may be undefined or invalid)
    const { metatextId } = useParams<{ metatextId?: string }>();
    const parsedId = metatextId ? Number(metatextId) : undefined;
    const navigate = useNavigate();

    // Fetch review data using the custom hook
    const { wordList, phraseList, chunks } = useMetatextReviewData(parsedId ?? 0);

    // Use Boundary to handle loading and error states for the review data
    return (
        <Box data-testid="metatext-review-page" p="2">
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

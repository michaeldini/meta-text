// Review page for a Metatext document, providing a comprehensive review interface with flashcards, phrases, and chunk data table.

import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react/box';
import type { ReactElement } from 'react';

import { Boundary } from '@components/Boundaries';
import { Header, ReviewContent } from './components';
import { useMetatextReviewData } from './hooks/useMetatextReviewData';

function MetatextReviewPage(): ReactElement {
    // Get the raw Metatext ID string from the URL parameters (may be undefined or invalid)
    const { metatextId } = useParams<{ metatextId?: string }>();
    const parsedId = metatextId ? Number(metatextId) : undefined;
    const navigate = useNavigate();

    // Use Boundary to handle loading and error states for the review data
    return (
        <Boundary fallbackText="Loading review data...">
            <MetatextReviewContent parsedId={parsedId} navigate={navigate} />
        </Boundary>
    );
}

// Extracted content component to be wrapped by Boundary
function MetatextReviewContent({ parsedId, navigate }: { parsedId?: number, navigate: ReturnType<typeof useNavigate> }) {
    const { wordList, phraseList, chunks } = useMetatextReviewData(parsedId);
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

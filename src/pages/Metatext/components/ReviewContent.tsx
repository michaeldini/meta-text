// A component to display review content including explanations, flashcards, and a review table
// Composed of multiple accordion sections for better organization and user experience

import type { ReactElement } from 'react';
import { FlashCards, ReviewTable, Phrases } from '@features/review';
import { ChunkType, } from '@mtypes/documents';
import { Explanation } from '@mtypes/MetatextReview.types'
import { useState } from 'react';
import { Box, Button, Stack } from '@styles';

interface ReviewContentProps {
    flashcards: Explanation[];
    phrases: Explanation[];
    chunkReviewTable: ChunkType[];
}

/**
 * ReviewContent component
 * - Displays explanations, flashcards, and a review table in separate sections
 *
 * @param {ReviewContentProps} props - Contains flashcards, phrases, and chunkReviewTable data
 * @returns {ReactElement} The rendered ReviewContent component
 */
export function ReviewContent({ flashcards, phrases, chunkReviewTable }: ReviewContentProps): ReactElement {
    const [showExplanations, setShowExplanations] = useState(true);
    const [showFlashcards, setShowFlashcards] = useState(true);
    const [showReviewTable, setShowReviewTable] = useState(true);

    return (
        <>
            <Stack>
                <Button
                    data-testid="explanations-toggle"
                    onClick={() => setShowExplanations((v) => !v)}
                    size="sm"
                    css={{ marginBottom: 8 }}
                >
                    {showExplanations ? 'Hide' : 'Show'} Explanations
                </Button>
                {showExplanations && <Phrases phrases={phrases} />}
                <Button
                    data-testid="flashcards-toggle"
                    onClick={() => setShowFlashcards((v) => !v)}
                    size="sm"
                    css={{ marginBottom: 8 }}
                >
                    {showFlashcards ? 'Hide' : 'Show'} Flashcards
                </Button>
                {showFlashcards && <FlashCards flashcardItems={flashcards} />}
                <Button
                    data-testid="reviewtable-toggle"
                    onClick={() => setShowReviewTable((v) => !v)}
                    size="sm"
                    css={{ marginBottom: 8 }}
                >
                    {showReviewTable ? 'Hide' : 'Show'} Review Table
                </Button>
                {showReviewTable && <ReviewTable chunks={chunkReviewTable} />}
            </Stack>
        </>
    );
}

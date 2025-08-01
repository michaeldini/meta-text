// A component to display review content including explanations, flashcards, and a review table
// Composed of multiple accordion sections for better organization and user experience

import type { ReactElement } from 'react';
import { FlashCards, ReviewTable, Phrases } from '@features/review';
import { ChunkType, } from '@mtypes/documents';
import { Explanation } from '@mtypes/MetatextReview.types'
import { ReviewSection } from './ReviewSection';

interface ReviewContentProps {
    flashcards: Explanation[];
    phrases: Explanation[];
    chunkReviewTable: ChunkType[];
}

/**
 * ReviewContent component
 * - Displays explanations, flashcards, and a review table in separate sections
 * - Uses ReviewSection for each part to allow expansion/collapse
 *
 * @param {ReviewContentProps} props - Contains flashcards, phrases, and chunkReviewTable data
 * @returns {ReactElement} The rendered ReviewContent component
 */
export function ReviewContent({
    flashcards,
    phrases,
    chunkReviewTable
}: ReviewContentProps): ReactElement {
    console.log('ReviewContent data:', {
        flashcards,
        phrases,
        chunkReviewTable
    });
    return (
        <>
            <ReviewSection
                title="Explanations"
                testId="explanations-accordion"
            >
                <Phrases phrases={phrases} />
            </ReviewSection>

            <ReviewSection
                title="Flashcards"
                testId="flashcards-accordion"
            >
                <FlashCards flashcardItems={flashcards} />
            </ReviewSection>

            <ReviewSection
                title="ReviewTable"
                testId="chunks-accordion"
            >
                <ReviewTable chunks={chunkReviewTable} />
            </ReviewSection>
        </>
    );
}

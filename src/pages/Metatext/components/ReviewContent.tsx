// A component to display review content including explanations, flashcards, and a review table
// Composed of multiple accordion sections for better organization and user experience

import type { ReactElement } from 'react';
import { FlashCards, ReviewTable, Phrases } from 'features';
// import { PhraseExplanation } from 'services';
import { ChunkType, Explanation } from 'types';
import { ReviewSection } from './ReviewSection';

interface ReviewContentProps {
    flashcards: Explanation[];
    phrases: Explanation[];
    chunkReviewTable: ChunkType[];
}

export function ReviewContent({
    flashcards,
    phrases,
    chunkReviewTable
}: ReviewContentProps): ReactElement {
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

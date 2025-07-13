// A component to display review content including explanations, flashcards, and a review table
// Composed of multiple accordion sections for better organization and user experience

import type { ReactElement } from 'react';
import { FlashCards, ReviewTable, ExplanationReview } from 'features';
import { PhraseExplanation } from 'services';
import { ChunkType, FlashcardItem } from 'types';
import { ReviewSection } from './ReviewSection';

interface ReviewContentProps {
    // Array of phrase explanations to display
    phraseExplanations: PhraseExplanation[];
    // Array of words for flashcard generation
    flashcards: FlashcardItem[];
    // Array of chunk data for the review table
    chunkReviewTable: ChunkType[];
}

export function ReviewContent({
    phraseExplanations,
    flashcards,
    chunkReviewTable
}: ReviewContentProps): ReactElement {
    return (
        <>
            <ReviewSection
                title="Explanations"
                testId="explanations-accordion"
            >
                <ExplanationReview data={phraseExplanations} />
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

// A component to display review content including explanations, flashcards, and a review table
// Composed of multiple accordion sections for better organization and user experience

import type { ReactElement } from 'react';
import { FlashCards, ReviewTable, ExplanationReview } from 'features';
// import { PhraseExplanation } from 'services';
import { ChunkType, Explanation } from 'types';
import { ReviewSection } from './ReviewSection';

interface ReviewContentProps {
    wordList: Explanation[];
    phraseList: Explanation[];
    chunkReviewTable: ChunkType[];
}

export function ReviewContent({
    wordList,
    phraseList,
    chunkReviewTable
}: ReviewContentProps): ReactElement {
    return (
        <>
            <ReviewSection
                title="Explanations"
                testId="explanations-accordion"
            >
                <ExplanationReview data={phraseList} />
            </ReviewSection>

            <ReviewSection
                title="Flashcards"
                testId="flashcards-accordion"
            >
                <FlashCards flashcardItems={wordList} />
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

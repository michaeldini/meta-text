import type { ReactElement } from 'react';
import { FlashCards, ReviewTable, ExplanationReview } from 'features';
import { PhraseExplanation } from 'services';
import { ChunkType, WordlistRow } from 'types';
import { ReviewSection } from './ReviewSection';

interface ReviewContentProps {
    // Array of phrase explanations to display
    phraseExplanations: PhraseExplanation[];
    // Array of words for flashcard generation
    wordlist: WordlistRow[];
    // Array of chunk summaries and notes
    chunkSummariesNotes: ChunkType[];
}

export function ReviewContent({
    phraseExplanations,
    wordlist,
    chunkSummariesNotes
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
                <FlashCards wordlist={wordlist} />
            </ReviewSection>

            <ReviewSection
                title="ReviewTable"
                testId="chunks-accordion"
            >
                <ReviewTable chunks={chunkSummariesNotes} />
            </ReviewSection>
        </>
    );
}

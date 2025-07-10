/**
 * @fileoverview ReviewContent component for MetaText Review
 * 
 * Renders the main content sections of the review page in a clean, organized layout.
 * Separates the content structure from the main component logic.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-09
 */

import type { ReactElement } from 'react';
import { FlashCards, ReviewTable, ExplanationReview } from 'features';
import { PhraseExplanation } from 'services';
import { ChunkType, WordlistRow } from 'types';
import { ReviewSection } from './ReviewSection';

/**
 * ReviewContent Component Props
 */
interface ReviewContentProps {
    /** Array of phrase explanations to display */
    phraseExplanations: PhraseExplanation[];
    /** Array of words for flashcard generation */
    wordlist: WordlistRow[];
    /** Array of chunk summaries and notes */
    chunkSummariesNotes: ChunkType[];
}

/**
 * ReviewContent Component
 * 
 * Renders the main content sections of the review page in a clean, organized layout.
 * Separates the content structure from the main component logic.
 * 
 * @param props - Component props
 * @param props.phraseExplanations - Array of phrase explanations to display
 * @param props.wordlist - Array of words for flashcard generation
 * @param props.chunkSummariesNotes - Array of chunk summaries and notes
 * @returns {ReactElement} The review content sections
 * 
 * @example
 * ```tsx
 * <ReviewContent
 *   phraseExplanations={phraseExplanations}
 *   wordlist={wordlist}
 *   chunkSummariesNotes={chunkSummariesNotes}
 * />
 * ```
 */
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


export interface FlashcardItem {
    /** Unique identifier for the word entry */
    id: number;
    /** The word or term */
    words: string;
    /** Standard definition of the word */
    explanation: string;
    /** Definition with contextual usage */
    definition_in_context: string;
    /** Optional context where the word appears in the document */
    context: string;
    type: 'word' | 'phrase'; // Type of the flashcard item
}

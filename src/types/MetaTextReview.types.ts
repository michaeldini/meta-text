
export interface FlashcardItem {
    /** Unique identifier for the word entry */
    id: number;
    /** The word or term */
    word: string;
    /** Standard definition of the word */
    definition: string;
    /** Definition with contextual usage */
    definition_with_context: string;
    /** Optional context where the word appears in the document */
    context: string;
}

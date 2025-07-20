// Type definitions for explanations attached to metatext reviews.
// Used throughout the frontend for type safety and clarity.

/**
 * Represents an explanation for a word or phrase from a metatext.
 */
export interface Explanation {
    /** Unique identifier for the explanation */
    id: number;
    /** The word or phrase being explained */
    words: string;
    /** The context in which the word or phrase appears */
    context: string;
    /** The explanation text */
    explanation: string;
    /** The explanation as it appears in context */
    explanation_in_context: string;
    /** Type of explanation: 'word' or 'phrase' */
    type: 'word' | 'phrase';
    /** Timestamp when the explanation was created (ISO string) */
    created_at: string;
    /** ID of the user who created the explanation */
    user_id: number;
    /** ID of the associated metatext */
    metatext_id: number;
}


/**
 * @fileoverview Type definitions for MetaText Review functionality
 * 
 * This module contains TypeScript interfaces and types used throughout
 * the MetaText Review components and features.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-09
 */

/**
 * WordlistRow Interface
 * 
 * Represents a single word entry in the wordlist for flashcard generation.
 * Contains the word, its definition, contextual definition, and optional context.
 * 
 * @interface WordlistRow
 * @example
 * ```typescript
 * const wordEntry: WordlistRow = {
 *   id: 1,
 *   word: "exemplify",
 *   definition: "to serve as a typical example of",
 *   definition_with_context: "to exemplify the principles discussed in the text",
 *   context: "The author uses this example to exemplify the main concept."
 * };
 * ```
 */
export interface WordlistRow {
    /** Unique identifier for the word entry */
    id: number;
    /** The word or term */
    word: string;
    /** Standard definition of the word */
    definition: string;
    /** Definition with contextual usage */
    definition_with_context: string;
    /** Optional context where the word appears in the document */
    context?: string;
}

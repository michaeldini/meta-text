
// =============================================================================
// NOTES TOOL TYPES
// =============================================================================

/**
 * Props for notes tool components
 */
export interface NotesToolProps {
    summary?: string;
    note?: string;
    onSummaryBlur?: (val: string) => void;
    onNoteBlur?: (val: string) => void;
    summaryFieldSx?: object;
    noteFieldSx?: object;
}

// =============================================================================
// CHUNKTYPE ATTRIBUTE TOOL TYPES
// =====================================================
// for chunktype
export type AiImage = {
    id: number;
    prompt: string;
    path: string;
    chunk_id: number;
};

// for chunktype
export interface Rewrite {
    id: number;
    title: string;
    rewrite_text: string;
    chunk_id: number;
}

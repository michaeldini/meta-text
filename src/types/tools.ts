import { ChunkType, Rewrite } from '@mtypes/documents';

// =============================================================================
// CORE TOOL TYPES
// =============================================================================

/**
 * Generic result wrapper for all tool operations
 */
export interface ToolResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Base interface for all chunk-related components
 */
export interface BaseChunkProps {
    chunk: ChunkType;
}



/**
 * Props for image generation dialog component
 */

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
// MERGE CHUNKS TOOL TYPES
// =============================================================================

/**
 * Props for merge chunks tool components
 */
export interface MergeChunksToolProps {
    chunkIndices: number[];
    onComplete?: (success: boolean, result?: any) => void;
}

// =============================================================================
// REWRITE TOOL TYPES
// =============================================================================

/**
 * State interface for rewrite hook
 */
export interface UseRewriteState {
    rewrites: Rewrite[];
    selectedId: number | '';
    loading: boolean;
    error: string | null;
}

/**
 * Actions interface for rewrite hook
 */
export interface UseRewriteActions {
    setSelectedId: (id: number | '') => void;
    onRewriteCreated: () => void;
}

/**
 * Return type for rewrite hook
 */
export interface UseRewriteReturn extends UseRewriteState, UseRewriteActions {
    selected: Rewrite | undefined;
}

/**
 * Props for rewrite tool button component
 */
export interface RewriteToolButtonProps {
    onClick: () => void;
    disabled: boolean;
}

/**
 * Props for rewrite display tool extending base chunk props
 */
export interface RewriteDisplayToolProps extends BaseChunkProps {
    onRewriteCreated?: () => void;
}

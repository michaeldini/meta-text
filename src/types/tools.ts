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

// =============================================================================
// IMAGE TOOL TYPES
// =============================================================================

/**
 * Props for image tool components
 */
export interface ImageToolProps extends BaseChunkProps {
    prompt?: string;
}

/**
 * Return type for the useImageTool hook
 */
export interface UseImageToolReturn {
    /** Function to generate an AI image with given parameters */
    generateImage: (props: ImageToolProps) => Promise<ToolResult<ImageResult>>;
    /** Function to delete the current image */
    deleteImage: () => Promise<ToolResult<{ deleted: boolean }>>;
    /** Function to retry generation with the last used prompt */
    retryGeneration: () => Promise<ToolResult<ImageResult>>;
    /** Current internal state of the hook */
    state: ImageToolState;
    /** Helper function to get the complete image source URL */
    getImgSrc: () => string;
    /** Function to open the image generation dialog */
    openDialog: () => void;
    /** Function to close the image generation dialog */
    closeDialog: () => void;
    /** Handler for prompt input changes */
    handlePromptChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Boolean indicating if image generation is in progress */
    loading: boolean;
    /** Current error message, null if no error */
    error: string | null;
    /** Boolean indicating if an image currently exists */
    hasImage: boolean;
}

/**
 * Internal state interface for the useImageTool hook
 */
export interface ImageToolState {
    /** Whether an image generation operation is currently in progress */
    loading: boolean;
    /** Error message from the last failed operation, null if no error */
    error: string | null;
    /** Path to the current image data, null if no image exists */
    data: string | null;
    /** Current user input for the image generation prompt */
    prompt: string;
    /** Whether the image generation dialog is currently open */
    dialogOpen: boolean;
}

/**
 * Result of successful image generation operation
 */
export interface ImageResult {
    /** The relative path to the generated image file */
    imagePath: string;
    /** The prompt that was used to generate the image */
    prompt: string;
}

/**
 * Props for image generation dialog component
 */
export interface ImageGenerationDialogProps {
    open: boolean;
    onClose: () => void;
    prompt: string;
    onPromptChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    loading: boolean;
    error: string | null;
}

/**
 * Props for image display component
 */
export interface ImageDisplayProps {
    src: string;
    alt?: string;
    height?: string | number;
    showModal?: boolean;
}

// =============================================================================
// EVALUATION TOOL TYPES
// =============================================================================

/**
 * Props for evaluation tool components
 */
export interface EvaluationToolProps extends BaseChunkProps {
    onComparisonUpdate?: (text: string) => void;
}

/**
 * Result of evaluation operation
 */
export interface EvaluationResult {
    evaluationText: string;
}

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

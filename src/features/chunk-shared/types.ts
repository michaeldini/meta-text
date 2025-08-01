import { ChunkType, UpdateChunkFieldFn, Rewrite } from '@mtypes/documents';

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
 * Configuration object for style options (used across rewrite components)
 */
export interface StyleOption {
    /** The internal value used for the style */
    value: string;
    /** The human-readable label displayed to the user */
    label: string;
}

// =============================================================================
// TAB COMPONENT TYPES
// =============================================================================

/**
 * Props for simple tab components that need to update chunk fields
 */
export interface SimpleTabProps extends BaseChunkProps {
    updateChunkField: UpdateChunkFieldFn;
}

// =============================================================================
// TOOL COMPONENT TYPES
// =============================================================================

/**
 * Props for copy tool component
 */
export interface CopyToolProps {
    /** The chunk text to copy */
    chunkText: string;
    /** Test ID for testing */
    'data-testid'?: string;
    /** Custom styling for the copy button */
    sx?: object;
}

/**
 * Props for image tool components
 */
export interface ImageToolProps extends BaseChunkProps {
    prompt?: string;
}

/**
 * Props for rewrite tool components
 */
export interface RewriteToolProps extends BaseChunkProps {
    onRewriteCreated?: () => void;
}

/**
 * Props for evaluation tool components
 */
export interface EvaluationToolProps extends BaseChunkProps {
    onComparisonUpdate?: (text: string) => void;
}

/**
 * Props for explanation tool components
 */
export interface ExplanationToolProps {
    /** The word or phrase to explain */
    word?: string;
    /** The chunk containing context for the explanation */
    chunk: ChunkType;
    /** Callback when explanation is updated */
    onExplanationUpdate?: (explanation: string) => void;
    /** Optional callback fired when explanation interaction completes */
    onComplete?: (success: boolean, result?: any) => void;
}

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

/**
 * Props for merge chunks tool components
 */
export interface MergeChunksToolProps {
    chunkIndices: number[];
    onComplete?: (success: boolean, result?: any) => void;
}

/**
 * Props for split chunk tool components
 */
export interface SplitChunkToolProps extends BaseChunkProps {
    chunkId: number;
    chunkIdx: number;
    word: string;
    wordIdx: number;
    onComplete?: (success: boolean, result?: any) => void;
}

// =============================================================================
// HOOK TYPES
// =============================================================================

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

// =============================================================================
// RESULT TYPES
// =============================================================================

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
 * Result of evaluation operation
 */
export interface EvaluationResult {
    evaluationText: string;
}

// =============================================================================
// UI COMPONENT TYPES
// =============================================================================

/**
 * Props for rewrite tool button component
 */
export interface RewriteToolButtonProps {
    onClick: () => void;
    disabled: boolean;
}

/**
 * Props for rewrite display component
 */
export interface RewriteDisplayProps {
    selected: Rewrite | undefined;
}

/**
 * Props for rewrite dialog component
 */
export interface RewriteDialogProps {
    /** Controls whether the dialog is open or closed */
    open: boolean;
    /** Callback function to close the dialog */
    onClose: () => void;
    /** The currently selected rewrite style */
    style: string;
    /** Callback function to handle style selection changes */
    onStyleChange: (value: string) => void;
    /** Array of available rewrite style options */
    options: StyleOption[];
    /** Loading state for save operation */
    loading: boolean;
    /** Error message (null if no error) */
    error: string | null;
    /** Callback function to save the rewrite */
    onSave: () => void;
    /** Loading state for save operation (alias for loading) */
    saving: boolean;
    /** Whether the save button should be enabled */
    canSave: boolean;
}

/**
 * Props for rewrite style select component
 */
export interface RewriteStyleSelectProps {
    style: string;
    onChange: (value: string) => void;
    options: StyleOption[];
}

/**
 * Props for rewrite preview component
 */
export interface RewritePreviewProps {
    preview: string | null;
}

/**
 * Props for rewrite select component
 */
export interface RewriteSelectProps {
    rewrites: Rewrite[];
    selectedId: number | '';
    setSelectedId: (id: number) => void;
}

/**
 * Props for rewrite display tool extending base chunk props
 */
export interface RewriteDisplayToolProps extends BaseChunkProps {
    onRewriteCreated?: () => void;
}

/**
 * Props for rewrite empty state component
 */
export interface RewriteEmptyStateProps extends BaseChunkProps {
    onRewriteCreated: () => void;
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

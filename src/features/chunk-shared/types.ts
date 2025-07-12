import { ChunkType, UpdateChunkFieldFn, ChunkCompression } from 'types';

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
 * Configuration object for style options (used across compression components)
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
 * Props for compression tool components
 */
export interface CompressionToolProps extends BaseChunkProps {
    onCompressionCreated?: () => void;
}

/**
 * Props for comparison tool components
 */
export interface ComparisonToolProps extends BaseChunkProps {
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
    notes?: string;
    onSummaryBlur?: (val: string) => void;
    onNotesBlur?: (val: string) => void;
    summaryFieldSx?: object;
    notesFieldSx?: object;
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
 * State interface for compression hook
 */
export interface UseCompressionState {
    compressions: ChunkCompression[];
    selectedId: number | '';
    loading: boolean;
    error: string | null;
}

/**
 * Actions interface for compression hook
 */
export interface UseCompressionActions {
    setSelectedId: (id: number | '') => void;
    onCompressionCreated: () => void;
}

/**
 * Return type for compression hook
 */
export interface UseCompressionReturn extends UseCompressionState, UseCompressionActions {
    selected: ChunkCompression | undefined;
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
 * Result of comparison operation
 */
export interface ComparisonResult {
    comparisonText: string;
}

// =============================================================================
// UI COMPONENT TYPES
// =============================================================================

/**
 * Props for compression tool button component
 */
export interface CompressionToolButtonProps {
    onClick: () => void;
    disabled: boolean;
}

/**
 * Props for compression display component
 */
export interface CompressionDisplayProps {
    selected: ChunkCompression | undefined;
    styles: any;
}

/**
 * Props for compression dialog component
 */
export interface CompressionDialogProps {
    /** Controls whether the dialog is open or closed */
    open: boolean;
    /** Callback function to close the dialog */
    onClose: () => void;
    /** The currently selected compression style */
    style: string;
    /** Callback function to handle style selection changes */
    onStyleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Array of available compression style options */
    options: StyleOption[];
    /** Callback function to trigger compression preview generation */
    onPreview: () => void;
    /** Loading state for preview generation */
    loading: boolean;
    /** The generated preview text (null if no preview available) */
    preview: string | null;
    /** Error message (null if no error) */
    error: string | null;
    /** Callback function to save the compression */
    onSave: () => void;
    /** Loading state for save operation */
    saving: boolean;
    /** Whether the preview button should be enabled */
    canPreview: boolean;
    /** Whether the save button should be enabled */
    canSave: boolean;
}

/**
 * Props for compression style select component
 */
export interface CompressionStyleSelectProps {
    style: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    options: StyleOption[];
}

/**
 * Props for compression preview component
 */
export interface CompressionPreviewProps {
    preview: string | null;
}

/**
 * Props for compression select component
 */
export interface CompressionSelectProps {
    compressions: ChunkCompression[];
    selectedId: number | '';
    setSelectedId: (id: number) => void;
    styles: any;
}

/**
 * Props for compression display tool extending base chunk props
 */
export interface CompressionDisplayToolProps extends BaseChunkProps {
    onCompressionCreated?: () => void;
}

/**
 * Props for compression empty state component
 */
export interface CompressionEmptyStateProps extends BaseChunkProps {
    onCompressionCreated: () => void;
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

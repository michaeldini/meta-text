import { ChunkType, UpdateChunkFieldFn } from 'types';



export interface ToolResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface BaseChunk {
    chunk: ChunkType;
}

export interface ImageToolProps extends BaseChunk {
    prompt?: string;
}

// Tab-specific props

export interface SimpleTabProps extends BaseChunk {
    updateChunkField: UpdateChunkFieldFn;
}


// Tool-specific props
export interface CompressionToolProps extends BaseChunk {
    onCompressionCreated?: () => void;
}
export interface ComparisonToolComponentProps extends BaseChunk {
    onComparisonUpdate: (text: string) => void;
}


export interface ExplanationToolProps extends BaseChunk {
    onExplanationUpdate?: (text: string) => void;
}


export interface ImageToolComponentProps extends BaseChunk {
    prompt?: string;
}


export interface NotesToolComponentProps {
    summary?: string;
    notes?: string;
    onSummaryBlur?: (val: string) => void;
    onNotesBlur?: (val: string) => void;
    summaryFieldSx?: object;
    notesFieldSx?: object;
}


// Word Chunk Tools
export interface MergeChunksToolComponentProps {
    chunkIndices: number[];
    chunks?: ChunkType[];
    onComplete?: (success: boolean, result?: any) => void;
}

export interface SplitChunkToolComponentProps extends BaseChunk {
    chunk: ChunkType;
    chunkIdx: number;
    word: string;
    wordIdx: number;
    onComplete?: (success: boolean, result?: any) => void;
}

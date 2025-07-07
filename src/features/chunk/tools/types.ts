import { ChunkType, UpdateChunkFieldFn } from 'types';



export interface ToolResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface BaseChunkProps {
    chunk: ChunkType;
}

export interface ImageToolProps extends BaseChunkProps {
    prompt?: string;
}

// Tab-specific props

export interface SimpleTabProps extends BaseChunkProps {
    updateChunkField: UpdateChunkFieldFn;
}


// Tool-specific props
export interface CompressionToolProps extends BaseChunkProps {
    onCompressionCreated?: () => void;
}
export interface ComparisonToolComponentProps extends BaseChunkProps {
    onComparisonUpdate: (text: string) => void;
}


export interface ExplanationToolProps extends BaseChunkProps {
    chunkId: number;
    chunkIdx: number;
    word: string;
    wordIdx: number;
    onComplete?: (success: boolean, result?: any) => void;
}


export interface ImageToolComponentProps extends BaseChunkProps {
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
    // onComplete?: (success: boolean, result?: any) => void;
}

export interface SplitChunkToolComponentProps extends BaseChunkProps {
    chunkId: number;
    chunk: ChunkType;
    chunkIdx: number;
    word: string;
    wordIdx: number;
    onComplete?: (success: boolean, result?: any) => void;
}

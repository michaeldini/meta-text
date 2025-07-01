/**
 * Common types and interfaces for chunk tools
 */

export interface ChunkToolProps {
    /** The chunk index */
    chunkIdx: number;
    /** Optional chunk data */
    chunk: {
        id: number;
        meta_text_id: number;
        content?: string;
        [key: string]: any;
    };
}

export interface WordToolProps extends ChunkToolProps {
    /** The word to operate on */
    word: string;
    /** The word index within the chunk */
    wordIdx: number;
    /** Context around the word */
    // context: string;
}

export interface MultiChunkToolProps {
    /** Array of chunk indices */
    chunkIndices: number[];
    /** Optional chunks data */
    chunks?: Array<{
        id?: string | number;
        meta_text_id?: string | number;
        content?: string;
        [key: string]: any;
    }>;
}

export interface ToolResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface ChunkTool {
    /** Unique tool identifier */
    id: string;
    /** Display name */
    name: string;
    /** Tool description */
    description: string;
    /** Whether the tool requires user input */
    requiresInput: boolean;
    /** Tool execution function */
    execute: (...args: any[]) => Promise<ToolResult>;
}

// Tool-specific interfaces
export interface SplitChunkToolProps extends WordToolProps { }

// export interface DefineWordToolProps extends WordToolProps { }

export interface MergeChunksToolProps extends MultiChunkToolProps { }

export interface ComparisonToolProps extends ChunkToolProps { }

export interface ImageToolProps extends ChunkToolProps {
    /** Prompt for image generation */
    prompt?: string;
}

export interface NotesToolProps extends ChunkToolProps {
    /** User input for notes/summary */
    userInput?: string;
}

export interface ExplainPhraseToolProps extends ChunkToolProps {
    /** The phrase to explain */
    phrase: string;
    /** Context around the phrase */
    context?: string;
}

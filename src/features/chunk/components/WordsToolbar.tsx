// Toolbar for word-level tools in a chunk
// This component provides a popover with tools for splitting and defining words in a chunk

import React, { memo } from 'react';
import { Popover, Box } from '@chakra-ui/react';
import { SplitChunkTool } from 'features/chunk-split';
import { WordsExplanationTool } from 'features/chunk-explanation';

export interface WordsToolbarProps {
    onClose: () => void;
    word: string;
    wordIdx: number;
    chunkIdx: number;
    chunk: any;
}


/**
 * WordsToolbar - Layout component that presents word-level tools
 * This is a layout component that uses the split and define tools
 */
export function WordsToolbar({ onClose, word, wordIdx, chunkIdx, chunk }: WordsToolbarProps) {
    // Called when a tool completes
    const handleToolComplete = (success: boolean, result?: any) => {
        onClose();
    };
    return (
        <Box>
            <SplitChunkTool
                chunkId={chunk.id}
                chunkIdx={chunkIdx}
                wordIdx={wordIdx}
                word={word}
                chunk={chunk}
                onComplete={handleToolComplete}
            />
            <WordsExplanationTool
                word={word}
                chunk={chunk}
                onComplete={handleToolComplete}
            />
        </Box>
    );
}

export default memo(WordsToolbar);
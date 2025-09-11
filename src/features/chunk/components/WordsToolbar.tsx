// Toolbar for word-level tools in a chunk

import React, { memo } from 'react';
import { Stack } from '@styles';
import { SplitChunkTool } from '@features/chunk-split';
import { WordsExplanationTool } from '@features/chunk-explanation';
import type { ChunkType } from '@mtypes/documents';

export interface WordsToolbarProps {
    onClose: () => void;
    word: string;
    wordIdx: number | null;
    chunk: ChunkType;
}

/**
 * WordsToolbar - Layout component that presents word-level tools
 * This is a layout component that uses the split and define tools
 */
export function WordsToolbar({ onClose, word, wordIdx, chunk }: WordsToolbarProps) {
    return (
        <Stack css={{ gap: 16, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <SplitChunkTool
                wordIdx={wordIdx}
                word={word}
                chunk={chunk}
                onComplete={onClose}
            />
            <WordsExplanationTool
                word={word}
                chunk={chunk}
            />
        </Stack>
    );
}

export default memo(WordsToolbar);
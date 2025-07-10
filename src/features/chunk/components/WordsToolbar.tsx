// Toolbar for word-level tools in a chunk
// This component provides a popover with tools for splitting and defining words in a chunk

import React, { memo } from 'react';
import { Popover, Box, useTheme } from '@mui/material';
import SplitChunkTool from '../tools/split/SplitChunkTool';
import WordsExplanationTool from '../tools/explanation/WordsExplanationTool';
import { getChunkComponentsStyles } from '../Chunk.styles';

export interface WordsToolbarProps {
    anchorEl: HTMLElement | null;
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
const WordsToolbar: React.FC<WordsToolbarProps> = memo(({
    anchorEl,
    onClose,
    word,
    wordIdx,
    chunkIdx,
    chunk,
}) => {
    const theme = useTheme();
    const styles = getChunkComponentsStyles(theme);
    const open = Boolean(anchorEl);

    const handleSplitToolComplete = (success: boolean, result?: any) => {
        console.log('SplitChunkTool completed:', { success, result });
        if (success) {
            onClose();
        }
    };

    const handleDefineToolComplete = (success: boolean, result?: any) => {
        console.log('WordsExplanationTool completed:', { success, result });
        if (success) {
            onClose();
        }
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <Box sx={styles.wordsToolBarContainer}>
                <SplitChunkTool
                    chunkId={chunk.id}
                    chunkIdx={chunkIdx}
                    wordIdx={wordIdx}
                    word={word}
                    chunk={chunk}
                    onComplete={handleSplitToolComplete}
                />
                <WordsExplanationTool
                    word={word}
                    chunk={chunk}
                    onComplete={handleDefineToolComplete}
                />
            </Box>
        </Popover >
    );
});

WordsToolbar.displayName = 'WordsToolbar';

export default WordsToolbar;

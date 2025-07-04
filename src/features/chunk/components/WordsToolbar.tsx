import React, { memo } from 'react';
import { Popover, Box, useTheme } from '@mui/material';
import SplitChunkTool from '../tools/split/SplitChunkTool';
import WordsExplanationTool from '../tools/explanation/WordsExplanationTool';
// import ExplainPhraseTool from '../tools/explain/ExplainPhraseTool';
import { getWordsStyles } from '../Chunk.styles';
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
    const styles = getWordsStyles(theme);
    const open = Boolean(anchorEl);

    const handleSplitToolComplete = (success: boolean, result?: any) => {
        if (success) {
            onClose();
        }
    };

    const handleDefineToolComplete = (success: boolean, result?: any) => {
        if (success) {
            // Define tool completed successfully
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
            <Box sx={styles.wordActionDialogContainer}>
                <SplitChunkTool
                    chunkIdx={chunkIdx}
                    wordIdx={wordIdx}
                    word={word}
                    chunk={chunk}
                    onComplete={handleSplitToolComplete}
                />
                <WordsExplanationTool
                    chunkIdx={chunkIdx}
                    wordIdx={wordIdx}
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

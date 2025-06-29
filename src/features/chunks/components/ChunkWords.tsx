import React, { memo, useState, useMemo } from 'react';
import { Box, IconButton, Paper, useTheme } from '@mui/material';
import { MergeChunksTool } from '../tools';
import WordActionDialog from '../layouts/dialogs/WordActionDialog';
import { getChunkStyles } from './styles/Chunk.styles';

export interface ChunkWordsProps {
    words: string[];
    chunkIdx: number;
    chunk?: { meta_text_id?: string | number;[key: string]: any };
}

/**
 * ChunkWords - Layout component for displaying words within a chunk
 * Uses the new tool system for word actions and chunk merging
 */
const ChunkWords = memo(function ChunkWords({
    words,
    chunkIdx,
    chunk
}: ChunkWordsProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null);
    const theme = useTheme();
    const styles = useMemo(() => getChunkStyles(theme), [theme]);

    const handleWordDialogOpen = (idx: number, event: React.MouseEvent<HTMLElement>) => {
        console.log('handleWordDialogOpen', { words, idx, word: words[idx] });
        setSelectedWordIdx(idx);
        setAnchorEl(event.currentTarget);
    };

    const handleDialogClose = () => {
        setAnchorEl(null);
        setSelectedWordIdx(null);
    };

    const handleMergeComplete = (success: boolean, result?: any) => {
        if (success) {
            console.log('Merge completed successfully:', result);
        }
    };

    return (
        <Box>
            <Box sx={{ ...styles.wordsContainer, ...theme.typography.body2 }}>
                {words.map((word, wordIdx) => (
                    <Box
                        key={wordIdx}
                        component="span"
                        onClick={e => handleWordDialogOpen(wordIdx, e)}
                        sx={styles.chunkWordBox}
                    >
                        {word}
                    </Box>
                ))}
                {/* Show merge tool after all words, inline with the text */}
                <Box component="span" sx={styles.chunkUndoIconButton}>
                    <MergeChunksTool
                        chunkIndices={[chunkIdx, chunkIdx + 1]}
                        chunks={chunk ? [chunk] : undefined}
                        onComplete={handleMergeComplete}
                    />
                </Box>
            </Box>

            <WordActionDialog
                anchorEl={anchorEl}
                onClose={handleDialogClose}
                word={selectedWordIdx !== null ? words[selectedWordIdx] : ''}
                wordIdx={selectedWordIdx || 0}
                chunkIdx={chunkIdx}
                context={words.join(' ')}
                metaTextId={chunk?.meta_text_id}
            />
        </Box>
    );
});

export default ChunkWords;

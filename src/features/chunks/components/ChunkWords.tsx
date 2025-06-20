import React, { memo, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import MergeChunksTool from '../tools/merge/MergeChunksTool';
import WordActionDialog from '../layouts/dialogs/WordActionDialog';
import { chunkWordBox, wordsContainer, chunkUndoIconButton, chunkTextBox } from '../styles/styles';

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
        <Box sx={chunkTextBox}>
            <Box sx={wordsContainer}>
                {words.map((word, wordIdx) => (
                    <Box
                        key={wordIdx}
                        component="span"
                        onClick={e => handleWordDialogOpen(wordIdx, e)}
                        sx={chunkWordBox(wordIdx, words.length)}
                    >
                        {word}
                    </Box>
                ))}
                {/* Show merge tool after all words, inline with the text */}
                <Box component="span" sx={chunkUndoIconButton}>
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

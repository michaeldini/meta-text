import React, { memo, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { UndoArrowIcon } from '../../../components/icons';
import WordActionDialog from './WordActionDialog';
import { chunkWordBox, wordsContainer, chunkUndoIconButton, chunkTextBox } from '../styles/styles';
import { useChunkStore } from '../../../store/chunkStore';

export interface ChunkWordsProps {
    words: string[];
    chunkIdx: number;
    chunk?: { meta_text_id?: string | number;[key: string]: any };
}

const ChunkWords = memo(function ChunkWords({
    words,
    chunkIdx,
    chunk
}: ChunkWordsProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null);
    const handleWordClick = useChunkStore(state => state.handleWordClick);
    const handleRemoveChunk = useChunkStore(state => state.handleRemoveChunk);

    const handleWordDialogOpen = (idx: number, event: React.MouseEvent<HTMLElement>) => {
        // Debug: log words and clicked index
        // eslint-disable-next-line no-console
        console.log('handleWordDialogOpen', { words, idx, word: words[idx] });
        setSelectedWordIdx(idx);
        setAnchorEl(event.currentTarget);
    };
    const handleDialogClose = () => {
        setAnchorEl(null);
        setSelectedWordIdx(null);
    };
    const handleSplit = () => {
        if (selectedWordIdx !== null) {
            // Debug: log before splitting
            // eslint-disable-next-line no-console
            console.log('handleSplit', { chunkIdx, selectedWordIdx, word: words[selectedWordIdx], words });
            handleWordClick(chunkIdx, selectedWordIdx);
        }
        handleDialogClose();
    };

    return (
        <Box sx={chunkTextBox}>
            <Box sx={wordsContainer}>
                {words.map((word, wordIdx) => (
                    <React.Fragment key={wordIdx} >
                        <Box
                            component="span"
                            onClick={e => handleWordDialogOpen(wordIdx, e)}
                            sx={chunkWordBox(wordIdx, words.length)}
                        >
                            {word}
                            {wordIdx === words.length - 1 && (
                                <IconButton
                                    size="small"
                                    onClick={e => { e.stopPropagation(); handleRemoveChunk(chunkIdx); }}
                                    title="Undo split (merge with next chunk)"
                                    aria-label="Undo split (merge with next chunk)"
                                    sx={chunkUndoIconButton}
                                >
                                    <UndoArrowIcon />
                                </IconButton>
                            )}
                        </Box>
                    </React.Fragment>
                ))}
            </Box>

            <WordActionDialog
                anchorEl={anchorEl}
                onClose={handleDialogClose}
                word={selectedWordIdx !== null ? words[selectedWordIdx] : ''}
                onSplit={handleSplit}
                context={words.join(' ')}
                metaTextId={chunk?.meta_text_id}
            />
        </Box>
    );
});

export default ChunkWords;

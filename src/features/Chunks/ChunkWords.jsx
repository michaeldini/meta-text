import React, { memo, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import UndoArrowIcon from '../../components/icons/UndoArrowIcon';
import WordActionDialog from './WordActionDialog';
import { chunkWordBox, chunkUndoIconButton, wordsContainer } from './Chunks.styles';

const ChunkWords = memo(function ChunkWords({
    words,
    chunkIdx,
    handleWordClick,
    handleRemoveChunk,
    chunk
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedWordIdx, setSelectedWordIdx] = useState(null);

    const handleWordDialogOpen = (idx, event) => {
        setSelectedWordIdx(idx);
        setAnchorEl(event.currentTarget);
    };
    const handleDialogClose = () => {
        setAnchorEl(null);
        setSelectedWordIdx(null);
    };
    const handleSplit = () => {
        if (selectedWordIdx !== null) {
            handleWordClick(chunkIdx, selectedWordIdx);
        }
        handleDialogClose();
    };

    return (
        <>
            <Box sx={wordsContainer}>
                {words.map((word, wordIdx) => (
                    <React.Fragment key={wordIdx}>
                        <Box
                            component="span"
                            onClick={e => handleWordDialogOpen(wordIdx, e)}
                            sx={chunkWordBox(wordIdx, words.length)}
                        >
                            {word}
                            {/* Show Undo icon only after the last word in a chunk, if not the last chunk */}
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
                onLookupContext={() => { }}
                context={words.join(' ')}
                metaTextId={chunk?.meta_text_id}
            />
        </>
    );
});

export default ChunkWords;

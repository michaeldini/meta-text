import React, { memo, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import UndoArrowIcon from '../components/icons/UndoArrowIcon';
import WordActionDialog from './WordActionDialog';

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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {words.map((word, wordIdx) => (
                    <React.Fragment key={wordIdx}>
                        <Box
                            component="span"
                            onClick={e => handleWordDialogOpen(wordIdx, e)}
                            sx={{
                                cursor: 'pointer',
                                borderRadius: 1,
                                transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
                                boxShadow: 0,
                                '&:hover': {
                                    bgcolor: 'primary.light',
                                    color: 'primary.contrastText',
                                    boxShadow: 1,
                                },
                                display: 'inline-flex',
                                alignItems: 'center',
                                fontSize: 16,
                                fontWeight: 500,
                                mr: wordIdx < words.length - 1 ? 0.5 : 0,
                                position: 'relative',
                            }}
                        >
                            {word}
                            {/* Show Undo icon only after the last word in a chunk, if not the last chunk */}
                            {wordIdx === words.length - 1 && (
                                <IconButton
                                    size="small"
                                    onClick={e => { e.stopPropagation(); handleRemoveChunk(chunkIdx); }}
                                    title="Undo split (merge with next chunk)"
                                    aria-label="Undo split (merge with next chunk)"
                                    sx={{
                                        ml: 1,
                                        borderRadius: '50%',
                                        bgcolor: 'background.paper',
                                        boxShadow: 1,
                                        transition: 'box-shadow 0.2s, background 0.2s, transform 0.1s',
                                        '&:hover': {
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                            boxShadow: 4,
                                            transform: 'rotate(-10deg) scale(1.1)'
                                        },
                                    }}
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

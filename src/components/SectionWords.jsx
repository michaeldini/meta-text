import React, { memo } from 'react';
import { Box, IconButton } from '@mui/material';
import UndoArrowIcon from './icons/UndoArrowIcon';

const SectionWords = memo(function SectionWords({
    words,
    sectionIdx,
    handleWordClick,
    handleRemoveSection,
    isLastSection
}) {
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {words.map((word, wordIdx) => (
                <React.Fragment key={wordIdx}>
                    <Box
                        component="span"
                        onClick={() => handleWordClick(sectionIdx, wordIdx)}
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
                        {/* Remove section button inline if not last section */}
                        {wordIdx === words.length - 1 && !isLastSection && (
                            <IconButton
                                size="small"
                                onClick={e => { e.stopPropagation(); handleRemoveSection(sectionIdx); }}
                                title="Undo split (merge with next section)"
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
    );
});

export default SectionWords;

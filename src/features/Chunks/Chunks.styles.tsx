// Chunks feature-specific styles using Material UI's sx prop style objects
import { Button } from '@mui/material';
import React from 'react';

export const chunksContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    mt: 4,
};

export const chunkMainBox = {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: 2,
    p: 2,
    mb: 8,
    border: '1px solid transparent',
    borderRadius: 2,
    '&:hover': {
        borderColor: 'secondary.main',
        borderWidth: 1,
        borderStyle: 'solid',
    }
};

export const chunkTextBox = { flex: 2, minWidth: 0, p: 2 };

export const chunkDetailsCol = {
    flex: 1,
    minWidth: 220,
    maxWidth: 400,
    width: 350,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    zIndex: 10,
    color: 'text.chunk_text',
};

export const chunkTextField = {
    color: 'text.chunk_text',
    borderRadius: 2,
    transition: 'box-shadow 0.2s, transform 0.2s',
    boxShadow: 0,
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        transition: 'box-shadow 0.2s, transform 0.2s',
        boxShadow: 0,
        '&.Mui-focused': {
            boxShadow: 6,
            transform: 'scale(1.02)'
        }
    }
};

export const chunkImageBtnBox = {
    mt: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
};

export const toolStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    p: 1,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1,
};

export const chunkWordBox = (wordIdx: number, totalWords: number) => ({
    display: 'inline-block',
    borderRadius: 1,
    position: 'relative',
    cursor: 'pointer',
    transition: 'background 0.2s',
    '&:hover': {
        bgcolor: 'secondary.main',
        color: 'background.paper',
    },
});

export const wordsContainer = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1,
}

export const chunkUndoIconButton = {
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'rotate(-45deg)',
    },
}
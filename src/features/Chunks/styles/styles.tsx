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
        borderWidth: '1px',
        borderStyle: 'solid',
    }
};

export const chunkTextBox = { minWidth: '60vw', p: 2, fontSize: '1.5rem', lineHeight: 1.5 };

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
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1,
    p: 2,
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


export const chunkImageBox = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 240,
    borderRadius: 2,
    overflow: 'hidden',
};

export const chunkImageLoadingOverlay = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    bgcolor: 'rgba(255,255,255,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
};

export const chunkLightboxModal = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 4,
};

export const chunkLightboxImgBox = {
    maxWidth: '90vw',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
};

export const chunkLightboxPromptBox = {
    mt: 2,
    p: 2,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1,
};


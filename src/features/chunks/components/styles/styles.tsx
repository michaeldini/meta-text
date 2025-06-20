
export const chunkTextBox = { p: 2, fontSize: '1.5rem', lineHeight: 1.5 };

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
            // transform: 'scale(1.02)'
        }
    }
};

export const chunkImageBtnBox = {
    mt: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
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


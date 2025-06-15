// Chunks feature-specific styles using Material UI's sx prop style objects

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
    gap: 2,
};

export const AiGenerationBtn = {
    fontWeight: 600,
    minWidth: 50,
    textTransform: 'none',
    margin: 2,
};

export const chunkImageBox = {
    cursor: 'pointer',
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
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

export const chunkImagePromptBox = {
    mt: 1,
    fontSize: 14,
    color: 'text.secondary',
    width: '100%',
    textAlign: 'left',
    px: 2,
};

export const chunkLightboxModal = {
    // Additional styles can be merged in the component
};

export const chunkLightboxImgBox = {
    bgcolor: 'background.paper',
    borderRadius: 2,
    p: 2,
    boxShadow: 6,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '80vw',
    maxHeight: '80vh',
};

export const chunkLightboxPromptBox = {
    mt: 2,
    fontSize: 16,
    color: 'text.secondary',
    width: '100%',
    textAlign: 'left',
    px: 2,
};

export const toolStyles = {
    ml: 1,
    p: 1,
    bgcolor: 'background.paper',
    borderRadius: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

export const chunkWordBox = (wordIdx, wordsLength) => ({
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
    mr: wordIdx < wordsLength - 1 ? 0.5 : 0,
    position: 'relative',
    color: 'text.chunk_text',
});

export const chunkUndoIconButton = {
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
};

export const wordsContainer = {
    textAlign: 'left',
};

// src/styles/pageStyles.js

export const uploadFormContainer = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    p: 4,
    mb: 8,
    bgcolor: 'background.paper',
};

export const uploadFormInner = {
    width: '75%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    gap: 2,
};

export const outerList = {
    margin: 4,
    bgcolor: 'background.paper',
    borderRadius: 2,
};

export const navBarAppBar = {
    bgcolor: 'background.paper',
    color: 'text.primary',
    zIndex: 1201,
};

export const navBarToolbar = {
    display: 'flex',
    justifyContent: 'right',
    minHeight: 64,
};

export const navBarButton = (active, ml = 0) => ({
    fontWeight: active ? 600 : 400,
    borderRadius: 2,
    textTransform: 'none',
    px: 2,
    boxShadow: active ? 2 : 0,
    bgcolor: active ? 'primary.main' : 'transparent',
    color: active ? 'background.paper' : 'text.primary',
    '&:hover': {
        bgcolor: active ? 'primary.dark' : 'action.hover',
    },
    ml,
});

export const navBarTitle = {
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: 2,
    color: 'primary.main',
    pl: 2,
};

export const sourceDocDetailContainer = {
    maxWidth: '90vw',
    mx: 'auto',
    mt: 4,
};

export const sourceDocDetailLoading = {
    display: 'flex',
    justifyContent: 'center',
    mt: 4,
};

export const sourceDocDetailPaper = {
    mt: 10,
    p: 3,
};

export const sourceDocDetailText = {
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
};

export const metaTextDetailContainer = {
    mt: 4,
    mb: 6,
};

export const metaTextDetailLoadingContainer = {
    maxWidth: 900,
    mx: 'auto',
    mt: 4,
};

export const metaTextDetailLoadingBox = {
    display: 'flex',
    justifyContent: 'center',
    mt: 4,
};

export const metaTextDetailAlert = {
    mb: 2,
};

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

export const appSuspenseFallback = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 64,
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

export const sourceDocInfoDetailsBox = {
    p: 2,
    gap: 2,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
};
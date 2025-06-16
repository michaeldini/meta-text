// src/styles/pageStyles.ts

import { CircularProgress, Box, Button } from '@mui/material';

export const pageContainer = {
    mt: 10,
    width: '90vw',
    display: 'flex',
    flexDirection: 'column' as const,
}

export const searchableList = {
    p: 8,
};
export const uploadFormContainer = {
    p: 8,
    mb: 4,
};

export const uploadFormInner = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'start' as const,
    gap: 2,
};

export const navBarAppBar = {
    // bgcolor: 'background.paper',
    // color: 'text.primary',
    // zIndex: 1201,
};

export const navBarToolbar = {
    display: 'flex',
    justifyContent: 'right' as const,
    minHeight: 64,
};

export const navBarButton = (active: boolean, ml = 0) => ({
    fontWeight: active ? 600 : 400,
    borderRadius: 2,
    textTransform: 'none' as const,
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
    textTransform: 'uppercase' as const,
    fontWeight: 700,
    letterSpacing: 2,
    color: 'primary.main',
    pl: 2,
};

export const sourceDocDetailContainer = {
    // maxWidth: '90vw',
    // mx: 'auto',
    // mt: 4,

    p: 4,
};

export const metaTextDetailPaper = {
    p: 4,
    m: 2,
    borderRadius: 3,
    boxShadow: 3,
    bgcolor: 'background.paper',
};

export const sourceDocDetailPaper = {
    p: 4,
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    fontSize: '1.05rem',
    lineHeight: 1.7,
    letterSpacing: '0.01em',
    // mb: 4,
    // borderRadius: 3,
    // boxShadow: 2,
};

export const sourceDocDetailText = {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    fontSize: '1.5rem',
    lineHeight: 2,
    letterSpacing: '0.02em',
    fontColor: 'text.primary',
};

export const sourceDocInfoDetailsBox = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: 5,
    mb: 4,
};

export const chunkImageBox = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 240,
    bgcolor: 'grey.100',
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

export const chunksContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    mt: 4,
};

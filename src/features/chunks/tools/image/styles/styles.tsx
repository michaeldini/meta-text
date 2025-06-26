import { Theme } from '@mui/material/styles';

export const getChunkImageStyles = (theme: Theme) => ({
    chunkImageBox: {
        p: 0,
        position: 'relative' as const,
    },
    chunkImageLoadingOverlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: theme.palette.background.paper + 'b3', // 70% opacity
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    chunkLightboxModal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
    },
    chunkLightboxImgBox: {
        maxWidth: '90vw',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chunkLightboxPromptBox: {
        mt: 2,
        p: 2,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 1,
    },
});

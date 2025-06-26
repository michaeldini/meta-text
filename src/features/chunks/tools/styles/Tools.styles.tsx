// all styles related to chunk tools

import { Theme } from '@mui/material/styles';

export const getToolsStyles = (theme: Theme) => ({

    // sticky container for tools
    toolDisplayContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'flex-start',
        gap: theme.spacing(1),
        padding: theme.spacing(1),
        position: 'sticky' as const,
        top: theme.spacing(5),
        alignSelf: 'flex-start',
        width: '100%',
        maxWidth: '400px',
        zIndex: theme.zIndex.appBar,
        boxShadow: 'none',
        opacity: 0.85,
        transition: theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.short,
        }),
        '&:hover': {
            opacity: 1,
        },
    },

    // styles for each tool section
    toolTabContainer: {
        p: 1,
        gap: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: 400
    },

    // Common tool panel styles
    toolPanel: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
    },

    // image tool styles
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

// Legacy export for backward compatibility
export const getChunkToolsStyles = getToolsStyles;


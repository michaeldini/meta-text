// all styles related to chunk tools

import { Theme } from '@mui/material/styles';
export const getToolsStyles = (theme: Theme) => ({
    // styles for each tool section
    toolTabContainer: {
        p: 1,
        gap: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        // minWidth: 400,
        borderLeft: `4px solid ${theme.palette.secondary.main}`,

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
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(0,0,0,0.7)',
        zIndex: 1300,
        outline: 'none',
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


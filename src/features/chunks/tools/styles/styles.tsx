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


    // Individual tool styles
    chunkTools: {
        // Chunk-specific tool styles can be added here
    },

    // Common tool button styles
    toolButton: {
        minWidth: 'auto',
        padding: theme.spacing(0.5, 1),
    },

    // Common tool panel styles
    toolPanel: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
    },
});

// Legacy export for backward compatibility
export const getChunkToolsStyles = getToolsStyles;


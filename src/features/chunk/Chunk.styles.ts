import { Theme } from '@mui/material/styles';
export const getChunkStyles = (theme: Theme) => ({
    chunkContainer: {
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'start',
        border: `1px solid ${theme.palette.secondary.light}`,
        borderRadius: theme.shape.borderRadius,
        minHeight: 0,
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
        padding: 0,
    },

});

export const getToolsStyles = (theme: Theme, isActiveTabs: boolean) => ({

    // sticky container for tools
    ChunkTabsContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'flex-start',
        gap: theme.spacing(1),
        paddingLeft: theme.spacing(10),
        padding: theme.spacing(2),
        position: 'sticky' as const,
        top: theme.spacing(5),
        alignSelf: 'flex-start',
        width: '100%',
        minWidth: isActiveTabs ? "30vw" : "0vw",
        zIndex: theme.zIndex.appBar,
        boxShadow: 'none',
        transition: theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.short,
        }),
        '&:hover': {
            opacity: 1,
        },
    },
});


export const getChunkToolsStyles = (theme: Theme) => ({

    toolsContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: 2,
        padding: 0,
        margin: 0
    },
    toolButtonsContainer: {
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        marginTop: 1,
    },
    tooltipProps: {
        arrow: true,
        enterDelay: 200,
        placement: 'left' as const,
    },
});


export const getWordsStyles = (theme: Theme) => ({
    wordsContainer: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        // gap: theme.spacing(.75),
        transition: 'all 0.3s ease',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        '&:hover': {
            transform: 'translateY(-2px)',
        },
        padding: theme.spacing(4),
        paddingRight: 0,
    },
    chunkWordBox: {
        display: 'inline-block',
        borderRadius: 0,
        position: 'relative' as const,
        cursor: 'pointer',
        transition: 'background 0.2s',
        paddingX: theme.spacing(1),
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.background.paper,
        },
    },
    chunkUndoIconButton: {
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'rotate(-45deg)',
        },
    },

    wordActionDialogContainer: {
        padding: theme.spacing(1),
        display: 'flex',
        gap: theme.spacing(1),
        flexDirection: 'row' as const,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolsContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: 2,
        padding: 0,
        margin: 0
    },
    toolButtonsContainer: {
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        marginTop: 1,
    },
    tooltipProps: {
        arrow: true,
        enterDelay: 200,
        placement: 'left' as const,
    },
});

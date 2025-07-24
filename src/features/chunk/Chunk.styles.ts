import { Theme } from '@mui/material/styles';
export const getChunkComponentsStyles = (theme: Theme, isActiveTabs?: boolean) => ({

    // container for paginated chunks
    chunksContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: theme.spacing(2),
        padding: 0,
        backgroundColor: theme.palette.background.default,
        height: '100%',
        width: '100%',
        borderRadius: theme.shape.borderRadius,
        outline: 'none',
        boxShadow: 'none',
        '&:focus': {
            outline: 'none',
            boxShadow: 'none',
        },
        flex: 1,
        minHeight: 0,
        overflow: 'visible',  // allow sticky children to escape
    },

    // container for each chunk (ChunkWords and ChunkTabs)
    chunkContainer: {
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'start',
        border: `1px solid ${theme.palette.secondary.light}`,
        borderRadius: theme.shape.borderRadiusSm,
        minHeight: 0,
        padding: 0,
        overflow: 'visible',  // changed to visible to allow sticky positioning
        boxSizing: 'border-box',
    },

    // sticky container for tools
    chunkTabsContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'flex-start',
        gap: theme.spacing(1),
        padding: isActiveTabs ? theme.spacing(2) : 0,
        marginLeft: isActiveTabs ? theme.spacing(2) : 0,
        position: 'sticky' as const,
        top: 0,  // added top offset to enable sticky positioning
        alignSelf: 'flex-start',
        width: '100%',
        maxWidth: '100%',
        zIndex: theme.zIndex.tooltip + 1,
        boxShadow: 'none',
        boxSizing: 'border-box',
        transition: theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.short,
        }),
        '&:hover': {
            opacity: 1,
        },
    },
    // container for floating visibility buttons
    chunkToolButtonsContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: 2,
        padding: 0,
        margin: 0
    },
    // container for floating extra buttons (e.g. copy)
    chunkToolButtonsContainerExtra: {
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        marginTop: 1,
    },
    // container for the words toolbar (e.g. split and define tools )
    wordsToolBarContainer: {
        padding: theme.spacing(1),
        display: 'flex',
        gap: theme.spacing(1),
        flexDirection: 'row' as const,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // container that wraps all words in a chunk
    wordsContainer: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        position: 'relative' as const,
        // gap: theme.spacing(.75),
        transition: 'all 0.3s ease',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        // '&:hover': {
        //     transform: 'translateY(-2px)',
        // },
        padding: theme.spacing(3),
        paddingRight: 0,
    },
    // wraps each word in a chunk
    chunkWord: {
        display: 'inline-block',
        borderRadius: 0,
        position: 'relative' as const,
        cursor: 'pointer',
        transition: 'background 0.2s',
        paddingX: theme.spacing(0.3),
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.background.paper,
        },
    },
    // tooltip styles for chunk tool buttons
    chunkToolButtonsToolTip: {
        arrow: true,
        enterDelay: 500,
        placement: 'top' as const,
    },

    // styles for the undo icon button in the chunk
    chunkUndoIconButton: {
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'rotate(-45deg)',
        },
    },

    // container for copy tool in chunk tabs
    alwaysVisibleToolContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        padding: theme.spacing(2, 2, 0, 0),
        alignSelf: 'flex-end',
    },
});

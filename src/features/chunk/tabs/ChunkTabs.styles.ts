// all styles related to chunk tools
import { Theme } from '@mui/material/styles';

export const getToolsStyles = (theme: Theme) => ({

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
        zIndex: theme.zIndex.appBar,
        boxShadow: 'none',
        transition: theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.short,
        }),
        '&:hover': {
            opacity: 1,
        },
        compressedWords: {
            flexWrap: 'wrap' as const,
        },
    },
});
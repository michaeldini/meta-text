import { Theme } from '@mui/material/styles';

export const getChunkToolsStyles = (theme: Theme) => ({
    // container: {
    //     display: 'flex',
    //     flexDirection: 'column' as const,
    //     flex: 1,
    //     minHeight: 0,
    //     height: '100%',
    //     width: '100%',
    //     position: 'relative' as const,
    // },
    box: {
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
});


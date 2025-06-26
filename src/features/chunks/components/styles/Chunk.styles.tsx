import { Theme } from '@mui/material/styles';

export const getChunkStyles = (theme: Theme) => ({
    chunkContainer: {
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'start',
        gap: theme.spacing(1.5), // Reduced gap between sections
        paddingRight: "32px", // Adjusted for floating toolbar
        border: `1px solid ${theme.palette.secondary.light}`,
        borderRadius: theme.shape.borderRadius,
        minHeight: 0,
        height: '100%',
        width: '100%',

    },
    chunkWordBox: {
        display: 'inline-block',
        borderRadius: 1,
        position: 'relative' as const,
        cursor: 'pointer',
        transition: 'background 0.2s',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.background.paper,
        },
    },
    wordsContainer: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: theme.spacing(1),
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
        },
        padding: theme.spacing(2),
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
});


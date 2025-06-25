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
    },
    chunkTextBox: {
        padding: theme.spacing(2),
        fontSize: '1.5rem',
        lineHeight: 1.5,
    },
    chunkTextField: {
        color: theme.palette.text.primary, // Use theme palette
        borderRadius: 2,
        transition: 'box-shadow 0.2s, transform 0.2s',
        boxShadow: 0,
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            transition: 'box-shadow 0.2s, transform 0.2s',
            boxShadow: 0,
            '&.Mui-focused': {
                boxShadow: 6,
                // transform: 'scale(1.02)'
            },
        },
    },
    chunkImageBtnBox: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'flex-end',
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


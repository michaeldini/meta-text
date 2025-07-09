import { Theme } from '@mui/material/styles';

// Theme-aware styles for WordFlashcard
export const createWordFlashcardStyles = (theme: Theme) => ({
    flashcardContainer: {
        perspective: 1000,
        width: 'fit-content',
        minWidth: theme.spacing(40),
        height: theme.spacing(40),
        display: 'flex',
        alignItems: 'start',
        padding: 0,
        borderRadius: theme.shape.borderRadiusSm,
    },
    flashcard: {
        width: '100%',
        height: '100%',
        position: 'relative',
        transition: 'transform 0.7s cubic-bezier(.68,-0.55,.27,1.55), -shadow 0.4s',
        transformStyle: 'preserve-3d',
        cursor: 'pointer',
    },
    flipped: {
        transform: 'rotateY(180deg) scale(1.04)',

    },
    front: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        backfaceVisibility: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.secondary.dark,
        borderRadius: theme.shape.borderRadiusSm,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        padding: theme.spacing(2),
        zIndex: 2,
        color: theme.palette.text.primary,
        '&:hover': {
            transform: 'scale(1.02)',
        },

    },
    back: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        backfaceVisibility: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        background: theme.palette.secondary.dark,
        borderRadius: theme.shape.borderRadiusSm,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        padding: theme.spacing(2),
        transform: 'rotateY(180deg)',
        zIndex: 3,
        paddingTop: theme.spacing(1),
    },
    tooltip: {
        maxWidth: 800,
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        textAlign: 'left',
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        color: theme.palette.text.primary,
        fontSize: theme.typography.body2.fontSize,
    },
    word: {
        fontWeight: 700,
        fontSize: theme.typography.h4.fontSize,
        marginBottom: theme.spacing(1),
        color: theme.palette.text.secondary,
    },

    cardActionArea: {
        height: '100%',
        borderRadius: theme.shape.borderRadiusSm,
        paddingX: theme.spacing(2),
        paddingTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        overflow: 'auto',

    },
    wordlistTitle: {
        marginBottom: theme.spacing(2),
    },
    wordlistWrap: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: theme.spacing(2),
        marginTop: theme.spacing(2),
    },

    buttonsContainer: {
        display: 'flex', gap: 1, alignItems: 'end', justifyContent: 'start'
    }

});

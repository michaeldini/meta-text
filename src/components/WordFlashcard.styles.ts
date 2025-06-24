import { Theme } from '@mui/material/styles';

// Theme-aware styles for WordFlashcard
export const createWordFlashcardStyles = (theme: Theme) => ({
    flashcardContainer: {
        perspective: 1000,
        width: theme.spacing(60), // 800px
        height: theme.spacing(50), // 192px
        // margin: theme.spacing(2),
        // padding: theme.spacing(3),
        display: 'inline-block',

    },
    flashcard: {
        width: '100%',
        height: '100%',
        position: 'relative',
        transition: 'transform 0.5s',
        transformStyle: 'preserve-3d',
        cursor: 'pointer',

    },
    flipped: {
        transform: 'rotateY(180deg)',
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
        background: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        padding: theme.spacing(2),
        zIndex: 2,
        color: theme.palette.text.primary,
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
        alignItems: 'start',
        justifyContent: 'start',
        background: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        padding: theme.spacing(2),
        transform: 'rotateY(180deg)',
        zIndex: 3,
        paddingTop: theme.spacing(4),
        // fontSize: theme.typography.body1.fontSize,
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
    iconButton: {
        color: theme.palette.text.secondary,
        '&:hover': {
            color: theme.palette.primary.main,
        },
        transition: 'color 0.3s',
    },
    infoIcon: {
        width: 24,
        height: 24,
        color: theme.palette.text.secondary,
        '&:hover': {
            color: theme.palette.primary.main,
        },
        transition: 'color 0.3s',
    },
    icons: {
        width: 24,
        height: 24,
        color: theme.palette.text.secondary,
        '&:hover': {
            color: theme.palette.primary.main,
        },
        transition: 'color 0.3s',
    },
    word: {
        fontWeight: 700,
        fontSize: theme.typography.h4.fontSize,
        marginBottom: theme.spacing(1),
        color: theme.palette.text.secondary,
    },
});

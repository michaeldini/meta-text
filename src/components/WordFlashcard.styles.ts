import { Theme } from '@mui/material/styles';

// Theme-aware styles for WordFlashcard
export const createWordFlashcardStyles = (theme: Theme) => ({
    flashcardContainer: {
        perspective: 1000,
        width: theme.spacing(50), // 800px
        height: theme.spacing(40), // 192px
        display: 'inline-block',

    },
    flashcard: {
        width: '100%',
        height: '100%',
        position: 'relative',
        transition: 'transform 0.7s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.4s',
        transformStyle: 'preserve-3d',
        cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)', // reduced shadow
    },
    flipped: {
        transform: 'rotateY(180deg) scale(1.04)',
        boxShadow: `0 4px 16px 0 ${theme.palette.primary.light}`, // reduced shadow
        background: theme.palette.secondary.light,
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
        borderRadius: theme.shape.borderRadiusSm,
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
        borderRadius: theme.shape.borderRadiusSm,
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
    word: {
        fontWeight: 700,
        fontSize: theme.typography.h4.fontSize,
        marginBottom: theme.spacing(1),
        color: theme.palette.text.secondary,
    },
});

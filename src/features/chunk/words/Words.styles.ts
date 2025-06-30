import { Theme } from '@mui/material/styles';
import { CHUNK_WORDS_MIN_WIDTH } from 'constants';

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
        minWidth: CHUNK_WORDS_MIN_WIDTH,
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

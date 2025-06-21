/**
 * Theme-aware styling utilities for ChunkWords component
 */

import { Theme } from '@mui/material/styles';

export const createChunkWordBoxStyles = (theme: Theme) => ({
    display: 'inline-block',
    borderRadius: theme.spacing(0.5),
    position: 'relative',
    cursor: 'pointer',
    padding: theme.spacing(0.25, 0.5),
    margin: theme.spacing(0.125),
    transition: theme.transitions.create(['background-color', 'color', 'transform'], {
        duration: theme.transitions.duration.shorter,
    }),
    color: theme.palette.text.primary,
    '&:hover': {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        transform: 'scale(1.05)',
    },
    '&:focus': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        outline: `2px solid ${theme.palette.primary.light}`,
        outlineOffset: 2,
    },
});

export const createWordsContainerStyles = (theme: Theme) => ({
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(0.5),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
});

export const createChunkUndoIconButtonStyles = (theme: Theme) => ({
    color: theme.palette.text.secondary,
    transition: theme.transitions.create(['transform', 'color'], {
        duration: theme.transitions.duration.short,
    }),
    '&:hover': {
        transform: 'rotate(-45deg)',
        color: theme.palette.primary.main,
    },
    '&:focus': {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: 2,
    },
});

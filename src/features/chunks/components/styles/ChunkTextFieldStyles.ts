/**
 * Theme-aware styling utilities for ChunkTextField component
 */

import { Theme } from '@mui/material/styles';

export const createChunkTextFieldStyles = (theme: Theme) => ({
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['box-shadow', 'transform'], {
        duration: theme.transitions.duration.short,
    }),
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        transition: theme.transitions.create(['box-shadow', 'transform'], {
            duration: theme.transitions.duration.short,
        }),
        '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
            },
        },
        '&.Mui-focused': {
            boxShadow: theme.shadows[6],
            transform: 'scale(1.01)',
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
            },
        },
    },
});

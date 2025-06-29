import { Theme } from '@mui/material/styles';
export const getChunkStyles = (theme: Theme) => ({
    chunkContainer: {
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'start',
        gap: theme.spacing(1.5), // Reduced gap between sections
        paddingRight: theme.spacing(4),
        border: `1px solid ${theme.palette.secondary.light}`,
        borderRadius: theme.shape.borderRadius,
        minHeight: 0,
        height: '100%',
        width: '100%',

    },

});


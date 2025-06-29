import { Theme } from '@mui/material/styles';

export const getChunksStyles = (theme: Theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: theme.spacing(2),
        padding: 0,
        backgroundColor: theme.palette.background.default,
        height: '100%',
        width: '100%',
        borderRadius: theme.shape.borderRadius,
        outline: 'none',
        boxShadow: 'none',
        '&:focus': {
            outline: 'none',
            boxShadow: 'none',
        },
        flex: 1,
        minHeight: 0,
    },
});

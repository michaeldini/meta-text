import { Theme } from '@mui/material/styles';

export const getMetaTextPageStyles = (theme: Theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    header: {
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'flex-start',
        gap: theme.spacing(0),
        marginBottom: theme.spacing(2),
    },
    title: {
        marginLeft: theme.spacing(1),
    },

    loadingBox: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(4),
    },
});


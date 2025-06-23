import { Theme } from '@mui/material/styles';

export const createFormStyles = (theme: Theme) => ({
    uploadFormInner: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'start' as const,
        gap: theme.spacing(2),
    },
    paperStyles: {
        minHeight: theme.spacing(20),
        height: '100%',
    },
    loadingBoxStyles: {
        display: 'flex',
        justifyContent: 'center',
        mt: theme.spacing(2),
    },
    spinnerStyles: {
        size: theme.spacing(4),
    },
    alertStyles: {
        width: '100%',
    },
});

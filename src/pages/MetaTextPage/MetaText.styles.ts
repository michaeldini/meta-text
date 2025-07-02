import { Theme } from '@mui/material/styles';

export const getMetaTextPageStyles = (theme: Theme) => ({
    container: {
        display: 'flex',
        height: '100%',
        flexDirection: 'column' as const,
        alignItems: 'start',
        gap: theme.spacing(1.5), // Reduced gap between sections
        paddingRight: theme.spacing(5), // Adjusted for floating toolbar
        paddingLeft: theme.spacing(0),
    },

    headerContainer: {
        width: '100%',
        padding: theme.spacing(2),
        gap: theme.spacing(6),
        marginBottom: theme.spacing(20)
    },

    headerPaper: {
        padding: theme.spacing(1.5), // Compact padding
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 'auto', // Remove default min-height
    },
});


export const getMetaTextReviewStyles = (theme: Theme) => ({
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


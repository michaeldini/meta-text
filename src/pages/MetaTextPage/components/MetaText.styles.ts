import { Theme } from '@mui/material/styles';

export const getMetaTextContentStyles = (theme: Theme) => ({
    container: {
        display: 'flex',
        height: '100%',
        flexDirection: 'column' as const,
        alignItems: 'start',
        gap: theme.spacing(1.5), // Reduced gap between sections
        paddingRight: theme.spacing(3), // Adjusted for floating toolbar
    },

    headerContainer: {
        width: '100%',
        padding: theme.spacing(2),
    },

    headerPaper: {
        padding: theme.spacing(1.5), // Compact padding
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start',
        justifyContent: 'space-between',
        minHeight: 'auto', // Remove default min-height
        width: '100%',
    },

    reviewButton: {
        minWidth: 'auto',
        padding: theme.spacing(0.5, 1),
        flex: 1,
    }
});

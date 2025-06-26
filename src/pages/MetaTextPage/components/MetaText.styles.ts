import { Theme } from '@mui/material/styles';

export const getMetaTextContentStyles = (theme: Theme) => ({
    container: {
        display: 'flex',
        height: '100%',
        flexDirection: 'column' as const,
        alignItems: 'start',
        gap: theme.spacing(1.5), // Reduced gap between sections
        // padding: theme.spacing(1), // Minimal padding
        paddingRight: "32px", // Adjusted for floating toolbar
        flex: 1,
        minHeight: 0,
    },

    headerContainer: {
        display: 'flex',
        flexDirection: 'row' as const,
        gap: theme.spacing(10),
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
    }
});

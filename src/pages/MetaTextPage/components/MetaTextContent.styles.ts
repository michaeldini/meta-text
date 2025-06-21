import { Theme } from '@mui/material/styles';

export const getMetaTextContentStyles = (theme: Theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'start',
        gap: theme.spacing(1.5), // Reduced gap between sections
        // padding: theme.spacing(1), // Minimal padding
        paddingRight: "32px", // Adjusted for floating toolbar
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

    title: {
        fontWeight: 600,
        margin: 0,
        lineHeight: 1.2 // Tighter line height
    },

    reviewButton: {
        minWidth: 'auto',
        padding: theme.spacing(0.5, 1),
    }
});

// Commented out the floating toolbar padding - remove this if you don't want the floating toolbar
export const getFloatingToolbarPadding = (theme: Theme) => ({
    paddingRight: "2000px", // Adjusted for floating toolbar
});

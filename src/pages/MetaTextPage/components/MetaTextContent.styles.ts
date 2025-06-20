import { Theme } from '@mui/material/styles';

export const getMetaTextContentStyles = (theme: Theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: theme.spacing(1.5), // Reduced gap between sections
        padding: theme.spacing(1), // Minimal padding
    },

    headerPaper: {
        padding: theme.spacing(1.5), // Compact padding
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 'auto' // Remove default min-height
    },

    title: {
        fontWeight: 600,
        margin: 0,
        lineHeight: 1.2 // Tighter line height
    },

    reviewButton: {
        minWidth: 'auto',
        padding: theme.spacing(0.5, 1),
        marginLeft: theme.spacing(2)
    }
});

export const getFloatingToolbarPadding = (theme: Theme) => ({
    paddingRight: {
        xs: theme.spacing(12), // Space for floating toolbar on mobile (96px)
        sm: theme.spacing(16), // Space for floating toolbar on desktop (128px)
    }
});

import { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

export const createNavbarStyles = (theme: Theme) => ({
    // App bar with theme-aware background and transitions - full width for smooth loading
    appBar: {
        // position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        width: '100%',
        boxSizing: 'border-box',
        padding: 0,
        marginBottom: theme.spacing(2), // Space below for content
    },

    // Responsive toolbar with consistent width
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: { xs: 56, sm: 64 },
        paddingX: { xs: 1, sm: 2 },
        gap: 1,
        width: '100%',
        maxWidth: 'none', // Prevent any max-width restrictions
    },

    // Brand button styling
    brandButton: {
        color: theme.palette.primary.contrastText,
        textTransform: 'none' as const,
        fontWeight: 700,
        fontSize: { xs: '1rem', sm: '1.25rem' },
        padding: theme.spacing(0.5, 1),
        border: 'none',
        transition: theme.transitions.create(['background-color']),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.1),
        },
    },

    // Menu trigger button
    menuButton: {

    },

    // Dropdown menu
    dropdownMenu: {
        '& .MuiPaper-root': {
            backgroundColor: 'black',
            border: `2px solid ${theme.palette.divider}`,
        },
    },

    // Menu items
    menuItem: {
        padding: theme.spacing(1, 2),
        margin: theme.spacing(0.25, 0),
        gap: theme.spacing(1),
        backgroundColor: 'black',
        '&.Mui-selected': {
            backgroundColor: theme.palette.secondary.main,
        },
    },

    // Simple section container
    section: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    headerContainer: {
        px: { xs: 1, sm: 2, md: 3 }
    },
    brandTypography: {
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.2rem',
        color: 'inherit',
        textDecoration: 'none',
    },
});


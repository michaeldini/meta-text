import { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

/**
 * Simplified navbar styles - theme-aware and maintainable
 * Focus on responsive feel without unnecessary complexity
 */

/**
 * Creates all navbar styles in one simple function
 */
export const createNavbarStyles = (theme: Theme) => ({
    // App bar with theme-aware background and transitions - full width for smooth loading
    appBar: {
        // position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        backgroundColor: theme.palette.primary.main,
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: theme.transitions.create(['background-color']),
        width: '100%',
        boxSizing: 'border-box',
        padding: 0,
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
        color: theme.palette.primary.contrastText,
        padding: theme.spacing(1),
        transition: theme.transitions.create(['background-color']),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.1),
        },
    },

    // Dropdown menu
    dropdownMenu: {
        '& .MuiPaper-root': {
            marginTop: theme.spacing(1),
            boxShadow: theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`,
        },
    },

    // Menu items
    menuItem: {
        padding: theme.spacing(1, 2),
        margin: theme.spacing(0.25, 0),
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
        },
    },

    // Simple section container
    section: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },

    // Icon styling for custom icons (Heroicons, etc.) that don't inherit from MuiSvgIcon
    icon: {
        width: 24,
        height: 24,
        color: 'inherit',
    },
});

/**
 * Performance-optimized styling patterns for MUI
 * These patterns help prevent unnecessary re-renders and improve performance
 */

import { useMemo } from 'react';
import { useTheme, Theme } from '@mui/material/styles';

// ============================================================================
// PATTERN 1: Memoized Style Objects
// ============================================================================

// Example of how to properly memoize styles in components
export const useMemoizedStyles = () => {
    const theme = useTheme();

    return useMemo(() => ({
        container: {
            padding: theme.spacing(2),
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
        },
        content: {
            color: theme.palette.text.primary,
        },
    }), [theme]); // Only recreate when theme changes
};

// ============================================================================
// PATTERN 2: Style Factory Functions (for dynamic styles)
// ============================================================================

// Factory function for styles that need props
export const createComponentStyles = (theme: Theme, props: { active?: boolean; size?: 'small' | 'medium' | 'large' }) => ({
    root: {
        padding: theme.spacing(props.size === 'small' ? 1 : props.size === 'large' ? 3 : 2),
        backgroundColor: props.active ? theme.palette.primary.main : theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        transition: theme.transitions.create(['background-color', 'transform'], {
            duration: theme.transitions.duration.short,
        }),
        '&:hover': {
            transform: 'translateY(-1px)',
        },
    },

    content: {
        color: props.active ? theme.palette.primary.contrastText : theme.palette.text.primary,
    },
});

// ============================================================================
// PATTERN 3: Static Style Objects (outside component)
// ============================================================================

// For styles that never change, define them outside the component
export const STATIC_STYLES = {
    loadingOverlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },

    visuallyHidden: {
        position: 'absolute' as const,
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden' as const,
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap' as const,
        border: 0,
    },
} as const;

// ============================================================================
// PATTERN 4: Theme-based conditional styles
// ============================================================================

export const createResponsiveStyles = (theme: Theme) => ({
    // Mobile-first responsive patterns
    mobileFirst: {
        fontSize: '1rem',
        padding: theme.spacing(1),
        [theme.breakpoints.up('sm')]: {
            fontSize: '1.125rem',
            padding: theme.spacing(2),
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '1.25rem',
            padding: theme.spacing(3),
        },
    },

    // Desktop-first responsive patterns (use sparingly)
    desktopFirst: {
        fontSize: '1.25rem',
        padding: theme.spacing(3),
        [theme.breakpoints.down('md')]: {
            fontSize: '1.125rem',
            padding: theme.spacing(2),
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '1rem',
            padding: theme.spacing(1),
        },
    },

    // Theme mode conditional styles
    modeAware: {
        backgroundColor: theme.palette.mode === 'dark'
            ? theme.palette.grey[900]
            : theme.palette.grey[50],
        color: theme.palette.mode === 'dark'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        border: `1px solid ${theme.palette.mode === 'dark'
                ? theme.palette.grey[700]
                : theme.palette.grey[300]
            }`,
    },
});

// ============================================================================
// PATTERN 5: Optimized sx prop patterns
// ============================================================================

// Static objects for reusable styles
export const CARD_STYLES = {
    p: 2,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1,
} as const;

export const BUTTON_STYLES = {
    primary: {
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        '&:hover': {
            bgcolor: 'primary.dark',
        },
    },
    secondary: {
        bgcolor: 'secondary.main',
        color: 'secondary.contrastText',
        '&:hover': {
            bgcolor: 'secondary.dark',
        },
    },
} as const;

// ============================================================================
// PATTERN 6: Performance tips for complex styles
// ============================================================================

export const PERFORMANCE_TIPS = {
    // Use will-change for animations
    animatedElement: {
        willChange: 'transform, opacity',
        transition: 'all 0.2s ease-in-out',
    },

    // Use transform instead of changing layout properties
    efficientHover: {
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
            transform: 'translateY(-2px) scale(1.02)',
        },
    },

    // Use contain for isolated components
    isolatedComponent: {
        contain: 'layout style paint',
    },
} as const;

export default {
    useMemoizedStyles,
    createComponentStyles,
    createResponsiveStyles,
    STATIC_STYLES,
    CARD_STYLES,
    BUTTON_STYLES,
    PERFORMANCE_TIPS,
};

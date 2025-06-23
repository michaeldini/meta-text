/**
 * Practical example: Refactoring your existing styles using best practices
 * This shows how to improve your current PageContainer and chunk styles
 */

import { Theme } from '@mui/material/styles';

// ============================================================================
// BEFORE: Your current approach (which is already quite good!)
// ============================================================================

export const currentStyles = {
    pageContainer: {
        mt: 2,
        width: '100vw',
        display: 'flex',
        flexDirection: 'column' as const,
    },

    chunkMainBox: {
        minWidth: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        p: 2,
        border: '1px solid transparent',
        borderRadius: 2,
        '&:hover': {
            borderColor: 'secondary.main',
            borderStyle: 'solid',
        }
    },
};

// ============================================================================
// AFTER: Enhanced with performance and UX improvements
// ============================================================================

export const improvedStyles = {
    // Better page container with responsive design and performance
    pageContainer: (theme: Theme) => ({
        mt: { xs: 2, md: 3 },
        width: '100%', // Avoid 100vw to prevent horizontal scroll
        maxWidth: '100vw',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: theme.spacing(2),
        px: { xs: 1, md: 2 },
        minHeight: 'calc(100vh - 64px)', // Account for navbar
        transition: theme.transitions.create(['padding'], {
            duration: theme.transitions.duration.short,
        }),
    }),

    // Enhanced chunk box with better interactions and performance
    chunkMainBox: {
        minWidth: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        p: 2,
        border: '1px solid',
        borderColor: 'transparent',
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        willChange: 'transform, box-shadow', // Performance hint
        '&:hover': {
            borderColor: 'secondary.main',
            transform: 'translateY(-1px)', // Subtle lift effect
            boxShadow: 2,
        },
        '&:focus-within': {
            borderColor: 'primary.main',
            outline: '2px solid',
            outlineColor: 'primary.light',
            outlineOffset: '2px',
        },
    },

    // Improved word interaction with better accessibility
    chunkWordBox: {
        display: 'inline-block',
        borderRadius: 1,
        cursor: 'pointer',
        px: 0.5, // Better click targets
        py: 0.25,
        transition: 'background-color 0.15s ease-in-out',
        '&:hover': {
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
        },
        '&:focus': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            outline: '2px solid',
            outlineColor: 'primary.light',
        },
        // Keyboard navigation
        '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
        },
    },
};

// ============================================================================
// ENHANCED THEME CONFIGURATION
// ============================================================================

// Add these to your theme.ts for even better defaults
export const enhancedThemeComponents = {
    // Better Paper defaults
    MuiPaper: {
        defaultProps: {
            elevation: 1,
        },
        styleOverrides: {
            root: {
                padding: 24,
                borderRadius: 12, // Slightly more rounded for modern look
                transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
                '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
            },
        },
        variants: [
            {
                props: { variant: 'interactive' as any },
                style: {
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    },
                },
            },
        ],
    },

    // Enhanced Container defaults
    MuiContainer: {
        defaultProps: {
            maxWidth: false,
        },
        styleOverrides: {
            root: {
                paddingTop: 16,
                paddingBottom: 16,
                transition: 'padding 0.2s ease-in-out',
            },
        },
    },

    // Better TextField defaults
    MuiTextField: {
        defaultProps: {
            variant: 'outlined' as const,
            fullWidth: true,
        },
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 8,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: 2,
                        },
                    },
                    '&.Mui-focused': {
                        transform: 'scale(1.01)',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: 2,
                        },
                    },
                },
            },
        },
    },
};

// ============================================================================
// STATIC STYLE OBJECTS FOR PERFORMANCE
// ============================================================================

// Define these outside components for better performance
export const LAYOUT_STYLES = {
    flexCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    flexBetween: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    flexColumn: {
        display: 'flex',
        flexDirection: 'column' as const,
    },

    absoluteCenter: {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },

    fullSize: {
        width: '100%',
        height: '100%',
    },
} as const;

export const INTERACTION_STYLES = {
    clickable: {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            transform: 'translateY(-1px)',
        },
        '&:active': {
            transform: 'translateY(0)',
        },
    },

    focusable: {
        '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
        },
        '&:focus:not(:focus-visible)': {
            outline: 'none',
        },
    },
} as const;

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// How to use in your components:

// 1. With static styles
// <Paper sx={LAYOUT_STYLES.flexCenter}>

// 2. With theme-aware styles
// const styles = improvedStyles.pageContainer(theme);
// <Container sx={styles}>

// 3. Combined patterns
// <Box sx={{
//     ...LAYOUT_STYLES.flexBetween,
//     ...INTERACTION_STYLES.clickable,
//     p: 2,
// }}>

export default {
    currentStyles,
    improvedStyles,
    enhancedThemeComponents,
    LAYOUT_STYLES,
    INTERACTION_STYLES,
};

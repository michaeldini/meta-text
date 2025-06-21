/**
 * Real-world examples of applying MUI styling best practices
 * Based on your existing codebase patterns
 */

import { Theme } from '@mui/material/styles';

// ============================================================================
// EXAMPLE 1: Improving your PageContainer component
// ============================================================================

// BEFORE: Using external styles file
export const oldPageContainer = {
    mt: 2,
    width: '100vw',
    display: 'flex',
    flexDirection: 'column' as const,
};

// AFTER: Enhanced with theme-aware responsive design
export const improvedPageContainer = (theme: Theme) => ({
    mt: { xs: 2, md: 3 }, // Responsive margins
    width: '100%', // Avoid 100vw for horizontal scroll issues
    maxWidth: '100vw', // Prevent overflow
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(2), // Use theme spacing
    px: { xs: theme.spacing(1), md: theme.spacing(2) }, // Responsive padding
    minHeight: 'calc(100vh - 64px)', // Account for navbar
});

// ============================================================================
// EXAMPLE 2: Better component style organization
// ============================================================================

// BEFORE: Your current chunk styles approach (which is good!)
export const currentChunkStyles = {
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

// AFTER: Enhanced with better interaction states and performance
export const enhancedChunkStyles = {
    chunkMainBox: {
        minWidth: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        p: 2,
        border: '1px solid',
        borderColor: 'transparent',
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out', // Smooth transitions
        willChange: 'transform, box-shadow', // Performance hint
        '&:hover': {
            borderColor: 'secondary.main',
            transform: 'translateY(-1px)', // Subtle lift
            boxShadow: 2, // Use theme shadows
        },
        '&:focus-within': {
            borderColor: 'primary.main',
            outline: '2px solid',
            outlineColor: 'primary.light',
            outlineOffset: '2px',
        },
    },

    // Optimized word interaction
    chunkWordBox: {
        display: 'inline-block',
        borderRadius: 1,
        position: 'relative',
        cursor: 'pointer',
        px: 0.5, // Add slight padding for better click targets
        transition: 'background-color 0.15s ease-in-out', // Faster transition
        '&:hover': {
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText', // Better contrast
        },
        '&:focus': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            outline: '2px solid',
            outlineColor: 'primary.light',
        },
    },
};

// ============================================================================
// EXAMPLE 3: Theme-based responsive patterns
// ============================================================================

export const responsivePatterns = {
    // Mobile-first responsive container
    responsiveContainer: {
        width: '100%',
        px: { xs: 2, sm: 3, md: 4, lg: 6 },
        py: { xs: 2, md: 3 },
        maxWidth: { xs: '100%', md: 'lg', xl: 'xl' },
        mx: 'auto',
    },

    // Flexible grid layouts
    adaptiveGrid: {
        display: 'grid',
        gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
        },
        gap: { xs: 2, md: 3 },
    },

    // Stack to row layout pattern
    stackToRow: {
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 3 },
        alignItems: { xs: 'stretch', md: 'flex-start' },
    },
};

// ============================================================================
// EXAMPLE 4: Component composition patterns
// ============================================================================

export const compositionPatterns = {
    // Card with consistent elevation states
    interactiveCard: {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            elevation: 4,
            transform: 'translateY(-2px)',
        },
        '&:active': {
            transform: 'translateY(0)',
        },
    },

    // Form field with consistent spacing
    formField: {
        mb: 2,
        '& .MuiFormHelperText-root': {
            mt: 0.5,
        },
    },

    // Loading state overlay
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.paper',
        opacity: 0.8,
        zIndex: 1,
    },
};

// ============================================================================
// EXAMPLE 5: Theme customization hooks
// ============================================================================

export const themeCustomizationExamples = {
    // Custom theme variants
    components: {
        MuiButton: {
            variants: [
                {
                    props: { variant: 'gradient' as any },
                    style: {
                        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                        border: 0,
                        borderRadius: 8,
                        color: 'white',
                        height: 48,
                        padding: '0 30px',
                        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                    },
                },
            ],
        },

        // Custom Paper variants for different content types
        MuiPaper: {
            variants: [
                {
                    props: { variant: 'tool-panel' as any },
                    style: {
                        p: 2,
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                            borderColor: 'primary.main',
                        },
                    },
                },
            ],
        },
    },
};

export default {
    improvedPageContainer,
    enhancedChunkStyles,
    responsivePatterns,
    compositionPatterns,
    themeCustomizationExamples,
};

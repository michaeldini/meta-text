/**
 * Theme-aware styling utilities
 * Helper functions for creating styles that adapt to light/dark themes
 */

import { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// ============================================================================
// Theme-Aware Style Creators
// ============================================================================

/**
 * Creates styles that adapt based on theme mode
 */
export const createThemeAwareStyles = (theme: Theme) => ({
    // Card with appropriate shadows for each theme
    adaptiveCard: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(3),
        boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0,0,0,0.4)'
            : '0 4px 20px rgba(0,0,0,0.1)',
        transition: theme.transitions.create([
            'box-shadow',
            'background-color',
            'border-color'
        ], {
            duration: theme.transitions.duration.short,
        }),
    },

    // Interactive element with hover states
    interactiveElement: {
        cursor: 'pointer',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2),
        transition: theme.transitions.create([
            'background-color',
            'border-color',
            'transform'
        ]),
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.primary.main, 0.1)
                : alpha(theme.palette.primary.main, 0.05),
            borderColor: theme.palette.primary.main,
            transform: 'translateY(-1px)',
        },
    },

    // Code block with theme-appropriate background
    codeBlock: {
        backgroundColor: theme.palette.mode === 'dark'
            ? theme.palette.grey[900]
            : theme.palette.grey[100],
        color: theme.palette.mode === 'dark'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2),
        fontFamily: 'Monaco, Consolas, "Roboto Mono", monospace',
        fontSize: '0.875rem',
    },

    // Subtle background for sections
    sectionBackground: {
        backgroundColor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.3)
            : alpha(theme.palette.grey[50], 0.8),
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(3),
    },
});

// ============================================================================
// Theme-Aware Color Utilities
// ============================================================================

/**
 * Get appropriate text color based on theme mode
 */
export const getTextColor = (theme: Theme, variant: 'primary' | 'secondary' | 'disabled' = 'primary') => {
    return theme.palette.text[variant];
};

/**
 * Get appropriate background color with optional alpha
 */
export const getBackgroundColor = (theme: Theme, surface: 'default' | 'paper' = 'default', alphaValue?: number) => {
    const color = theme.palette.background[surface];
    return alphaValue ? alpha(color, alphaValue) : color;
};

/**
 * Get border color based on theme
 */
export const getBorderColor = (theme: Theme, emphasis: 'subtle' | 'medium' | 'strong' = 'medium') => {
    const opacity = {
        subtle: 0.1,
        medium: 0.2,
        strong: 0.3,
    };

    return theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, opacity[emphasis])
        : alpha(theme.palette.common.black, opacity[emphasis]);
};

/**
 * Get shadow color appropriate for theme
 */
export const getShadowColor = (theme: Theme, intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    const shadowValues = {
        light: theme.palette.mode === 'dark'
            ? 'rgba(0,0,0,0.2)'
            : 'rgba(0,0,0,0.05)',
        medium: theme.palette.mode === 'dark'
            ? 'rgba(0,0,0,0.4)'
            : 'rgba(0,0,0,0.1)',
        heavy: theme.palette.mode === 'dark'
            ? 'rgba(0,0,0,0.6)'
            : 'rgba(0,0,0,0.15)',
    };

    return shadowValues[intensity];
};

// ============================================================================
// Common Theme-Aware Patterns
// ============================================================================

export const THEME_AWARE_PATTERNS = {
    // Consistent focus ring
    focusRing: (theme: Theme) => ({
        '&:focus': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
        },
        '&:focus:not(:focus-visible)': {
            outline: 'none',
        },
    }),

    // Hover lift effect
    hoverLift: (theme: Theme) => ({
        transition: theme.transitions.create(['transform', 'box-shadow']),
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${getShadowColor(theme, 'medium')}`,
        },
    }),

    // Responsive text scaling
    responsiveText: (theme: Theme) => ({
        fontSize: '1rem',
        [theme.breakpoints.up('sm')]: {
            fontSize: '1.125rem',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '1.25rem',
        },
    }),
};

// ============================================================================
// Usage Examples
// ============================================================================

/*
// In a component:
const MyComponent = () => {
  const theme = useTheme();
  const styles = createThemeAwareStyles(theme);
  
  return (
    <Paper sx={styles.adaptiveCard}>
      <Typography color={getTextColor(theme)}>
        Content that adapts to theme
      </Typography>
    </Paper>
  );
};

// For static patterns:
<Box sx={{
  ...THEME_AWARE_PATTERNS.focusRing(theme),
  ...THEME_AWARE_PATTERNS.hoverLift(theme),
  backgroundColor: getBackgroundColor(theme, 'paper'),
}}>
*/

export default {
    createThemeAwareStyles,
    getTextColor,
    getBackgroundColor,
    getBorderColor,
    getShadowColor,
    THEME_AWARE_PATTERNS,
};

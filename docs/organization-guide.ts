/**
 * Style Organization Best Practices
 * 
 * 1. Theme-level styles (theme.ts) - Global component defaults
 * 2. Feature-level styles (feature/styles/) - Feature-specific reusable styles
 * 3. Component-level styles - Local component styles using sx prop
 * 4. Layout-level styles - Page and layout-specific styles
 */

// ============================================================================
// PATTERN 1: Theme-Level Styles (Global Defaults)
// ============================================================================
// Location: src/styles/theme.ts
// Purpose: Set global defaults for all MUI components
// Best for: Common properties that should be consistent across the app

export const themeStyleExample = {
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: 24,
                    borderRadius: 8,
                    // All papers in the app will have these defaults
                },
            },
        },
    },
};

// ============================================================================
// PATTERN 2: Feature-Level Styles (Reusable within a feature)
// ============================================================================
// Location: src/features/[feature]/styles/styles.ts
// Purpose: Styles shared across components within a feature
// Best for: Feature-specific patterns and common layouts

export const featureStyles = {
    // Layout patterns
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 2,
        p: 3,
    },

    // Component patterns specific to this feature
    toolPanel: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        p: 2,
        minWidth: '400px',
        backgroundColor: 'background.paper',
        borderRadius: 2,
    },

    // Interactive patterns
    clickableCard: {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
        },
    },
};

// ============================================================================
// PATTERN 3: Component-Level Styles (Local to component)
// ============================================================================
// Location: Inside component file using sx prop or styled components
// Purpose: Styles specific to a single component instance
// Best for: One-off styling, component-specific behavior

// Example of component-level styles using sx prop
export const componentLevelStyleExample = {
    localCardStyles: {
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: 'primary.main',
        },
    },
};

// ============================================================================
// PATTERN 4: Layout-Level Styles (Page layouts)
// ============================================================================
// Location: src/styles/layouts/ or within page components
// Purpose: Page-specific layouts and structure
// Best for: Page containers, main layouts, responsive breakpoints

export const layoutStyles = {
    pageContainer: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 'lg',
        mx: 'auto',
        px: { xs: 2, md: 3 },
    },

    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
    },

    sidebar: {
        width: { xs: '100%', md: 280 },
        position: { md: 'sticky' },
        top: { md: 24 },
        height: { md: 'fit-content' },
    },
};

export default {
    themeStyleExample,
    featureStyles,
    componentLevelStyleExample,
    layoutStyles,
};

import { Theme } from '@mui/material/styles';

/**
 * Shared styles for chunk tools components
 * Contains common styling patterns used across different tool components
 */
export const getSharedToolStyles = (theme: Theme) => ({
    // Base container for all tool tabs
    toolTabContainer: {
        p: 1,
        gap: 2,
        display: 'flex',
        flexDirection: 'column' as const,
        width: '100%',
        borderLeft: `4px solid ${theme.palette.secondary.main}`,
    },

    // Extended version with minimum width for larger tools
    toolTabContainerWide: {
        p: 1,
        gap: 2,
        display: 'flex',
        flexDirection: 'column' as const,
        width: '100%',
        minWidth: '30vw',
        borderLeft: `4px solid ${theme.palette.secondary.main}`,
        flex: 1,
    },

    // Common scrollable content container
    scrollableContentContainer: {
        p: 2,
        boxShadow: theme.shadows[1],
        minHeight: 100,
        maxHeight: 300,
        overflowY: 'auto' as const,
        width: '100%',
    },

    // Extended scrollable container with minimum width
    scrollableContentContainerWide: {
        p: 2,
        boxShadow: theme.shadows[1],
        minWidth: 400,
        minHeight: 100,
        maxHeight: 400,
        overflowY: 'auto' as const,
        width: '100%',
    },

    // Form container with horizontal layout
    horizontalForm: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
        width: '100%',
        minWidth: 200,
        maxWidth: 400,
    },

    // Select field styling
    selectField: {
        '& .MuiInputBase-root': {
            height: 40,
            minHeight: 40,
            paddingRight: theme.spacing(2),
        },
        '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(1, 2, 1, 1),
        },
        '& .MuiInputLabel-root': {
            fontSize: theme.typography.body2.fontSize,
        },
    },

    // Flex wrap container for tags/chips
    flexWrapContainer: {
        flexWrap: 'wrap' as const,
        display: 'flex',
        p: theme.spacing(2),
        borderRadius: theme.shape.borderRadiusSm,
        boxShadow: theme.shadows[1],
        minHeight: 100,
        maxHeight: 300,
        overflowY: 'auto' as const,
        width: '100%',
    },

    // Modal overlay for lightbox/popup content
    modalOverlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(0,0,0,0.7)',
        zIndex: 1300,
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
    },

    // Loading overlay for async operations
    loadingOverlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: theme.palette.background.paper + 'b3', // 70% opacity
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },

    // Centered content container for modals
    centeredModalContent: {
        maxWidth: '90vw',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Info box for displaying additional content
    infoBox: {
        mt: 2,
        p: 2,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 1,
    },
});

/**
 * Utility function to merge shared styles with component-specific styles
 */
export const mergeToolStyles = (theme: Theme, componentStyles: any) => ({
    ...getSharedToolStyles(theme),
    ...componentStyles(theme),
});

// Usage example in a component
// import { getSharedToolStyles, mergeToolStyles } from '../shared.styles';

// // Option 1: Use shared styles directly
// const styles = getSharedToolStyles(theme);

// // Option 2: Merge with component-specific styles
// const getComponentStyles = (theme: Theme) => ({
//   // component-specific styles here
//   customStyle: { color: 'red' }
// });

// const styles = mergeToolStyles(theme, getComponentStyles);
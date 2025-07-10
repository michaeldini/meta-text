/**
 * @fileoverview MUI Theme Extension Declarations
 * 
 * This TypeScript declaration file extends Material-UI's default theme interface
 * to include custom properties for enhanced styling capabilities. It uses module
 * augmentation to add type safety for custom theme properties across the application.
 * 
 * @example
 * ```tsx
 * // Usage in components:
 * const MyComponent = () => {
 *   const theme = useTheme();
 *   return (
 *     <Box sx={{ 
 *       borderRadius: theme.shape.borderRadiusSm,
 *       '& .icon': theme.icons.default 
 *     }}>
 *       Content
 *     </Box>
 *   );
 * };
 * ```
 */

import '@mui/material/styles';

/**
 * Module augmentation for Material-UI's theme system.
 * Extends the default Theme and ThemeOptions interfaces with custom properties.
 */
declare module '@mui/material/styles' {
    /**
     * Extended Theme interface with custom properties.
     * This interface is used when consuming the theme via useTheme() hook.
     */
    interface Theme {
        /**
         * Enhanced shape properties for consistent border radius values.
         * Extends MUI's default shape object with additional radius options.
         */
        shape: {
            /** Standard border radius (MUI default) */
            borderRadius: number;
            /** Small border radius for subtle rounded corners */
            borderRadiusSm: number;
        };

        /**
         * Icon styling configuration for Heroicons integration.
         * Provides consistent default styles for icons across the application.
         */
        icons: {
            /** Default CSS properties applied to Heroicons */
            default: React.CSSProperties;
            /** CSS class name for icon styling (optional utility) */
            className: string;
        };
    }

    /**
     * Extended ThemeOptions interface for theme creation and customization.
     * This interface is used when creating or modifying themes with createTheme().
     */
    interface ThemeOptions {
        /**
         * Optional shape configuration for border radius values.
         */
        shape?: {
            /** Standard border radius value */
            borderRadius?: number;
            /** Small border radius value for subtle corners */
            borderRadiusSm?: number;
        };

        /**
         * Optional icon styling configuration.
         */
        icons?: {
            /** Default CSS properties for Heroicons */
            default?: React.CSSProperties;
            /** CSS class name for icon styling */
            className?: string;
        };
    }
}
/**
 * Top-level page container styles
 * Provides consistent layout foundation for all pages
 */
export const pageContainer = {

    // Layout structure
    display: 'flex',
    flexDirection: 'column' as const,

    // Spacing and dimensions
    width: '100%',
    height: '100%', // Ensure full viewport height
    flex: 1,
    minHeight: 0, // Allow children to shrink if needed

    // Responsive spacing - more space on larger screens
    pt: { xs: 2, sm: 3, md: 4 }, // top padding
    px: { xs: 2, sm: 3, md: 4 }, // horizontal padding

    // Max width for optimal reading experience on large screens
    maxWidth: '1400px',
    mx: 'auto', // center the container
}

/**
 * Global app container styles
 * Applied to the root container of the app
 */
export const appContainerStyles = {
    height: '100%', // Full viewport height
    width: '100%', // Full viewport width
    display: 'flex',
    flexDirection: 'column' as const, // Column layout for header, main content, and footer
    flex: 1,
    minHeight: 0,
    color: 'text.primary',
    margin: 0, // Remove any default margins
    padding: 0, // Remove any default padding
};

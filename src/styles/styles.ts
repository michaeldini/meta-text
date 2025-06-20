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
    minHeight: '100vh', // Ensure full viewport height

    // Responsive spacing - more space on larger screens
    // pt: { xs: 2, sm: 3, md: 4 }, // top padding
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
    minHeight: '100vh',
    backgroundColor: 'background.default',
    color: 'text.primary',
    transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
    width: '100%', // Ensure full width
    margin: 0, // Remove any default margins
    padding: 0, // Remove any default padding
};

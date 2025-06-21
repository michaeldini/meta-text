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
    pt: { xs: 2, sm: 3, md: 4 }, // top padding
    px: { xs: 2, sm: 3, md: 4 }, // horizontal padding

    // Max width for optimal reading experience on large screens
    maxWidth: '1400px',
    mx: 'auto', // center the container
}

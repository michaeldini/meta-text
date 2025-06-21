
// ChunkToolsDisplay styles
export const chunkToolsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,

};

export const chunkToolsBox = {
    padding: 1,
    position: 'sticky',
    // Sticky positioning: stays in view during scroll until parent container boundary
    top: 20, // Account for navbar height (64px) + some padding (16px)
    alignSelf: 'flex-start', // Ensure it doesn't stretch to full height
    width: '100%', // Take full width of parent
    zIndex: 1, // Ensure it stays above other content when sticky
    borderRadius: 1,
    border: '3px solid',
    borderColor: 'divider',
    boxShadow: 'none',
    opacity: 0.85,
    transition: 'all 0.2s ease',
    '&:hover': {
        opacity: 1,
        // borderColor: 'primary.light',    
    }
};


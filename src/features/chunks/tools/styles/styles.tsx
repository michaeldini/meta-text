import { Theme } from '@mui/material/styles';

export const getChunkToolsStyles = (theme: Theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row' as const,
        flex: 1,
    },
    box: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'flex-start',
        gap: theme.spacing(1),
        padding: theme.spacing(1),
        position: 'sticky' as const,
        // Sticky positioning: stays in view during scroll until parent is out of view
        top: theme.spacing(5), // Account for navbar height + padding
        alignSelf: 'flex-start', // Ensure it doesn't stretch to full height
        width: '100%', // Take full width of parent
        maxWidth: '400px', // Limit width for better readability
        zIndex: theme.zIndex.appBar, // Ensure it stays above other content when sticky
        boxShadow: 'none',
        opacity: 0.85,
        transition: theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.short,
        }),
        '&:hover': {
            opacity: 1,
        },
    },
});


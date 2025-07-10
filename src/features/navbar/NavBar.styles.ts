import { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

export const createNavbarStyles = (theme: Theme) => ({

    appBar: {
        marginBottom: theme.spacing(4), // Space below for content
    },

    // Brand button styling
    brandButton: {
        color: theme.palette.primary.contrastText,
        textTransform: 'none' as const,
        fontWeight: 700,
        fontSize: { xs: '1rem', sm: '1.25rem' },
        padding: theme.spacing(0, 1),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.1),
        },
    },
    brandTypography: {
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.2rem',
        color: 'inherit',
        textDecoration: 'none',
    },

    // Simple section container
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0),
    },
});


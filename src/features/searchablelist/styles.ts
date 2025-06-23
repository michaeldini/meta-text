import { Theme, keyframes } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Define fadeIn keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(24px);}
  to { opacity: 1; transform: translateY(0);}
`;

/**
 * styles - theme-aware and maintainable
 * Focus on responsive feel without unnecessary complexity
 */

/**
 * Creates all searchable list styles in one simple function
 * @param {Theme} theme - MUI theme object
 * @returns {object} - Styles object for SearchableList component
 */
export const createSearchableListStyles = (theme: Theme) => ({
    root: {
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        height: '100%',
        animation: `${fadeIn} 0.9s ease`, // Add animation here
    },
    searchInput: {
        marginBottom: theme.spacing(2),
    },
    noResults: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: theme.palette.text.secondary,
    },
    listItem: {
        padding: theme.spacing(1, 2),
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
        },
    },
});
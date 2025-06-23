import { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

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
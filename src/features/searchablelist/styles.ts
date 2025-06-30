import { Theme, keyframes } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Define flipIn keyframes for a turn-over effect
const flipIn = keyframes`
  from {
    opacity: 0;
    transform: perspective(600px) rotateY(90deg);
  }
  to {
    opacity: 1;
    transform: perspective(600px) rotateY(0deg);
  }
`;

/**
 * Creates all searchable list styles in one simple function
 * @param {Theme} theme - MUI theme object
 * @returns {object} - Styles object for SearchableList component
 */
export const createSearchableListStyles = (theme: Theme) => ({
  root: {
    animation: `${flipIn} 0.3s cubic-bezier(0.4,0.2,0.2,1)`, // Use flip animation
    transformStyle: 'preserve-3d',
  },
  searchInput: {
    paddingX: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  noResults: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: theme.palette.text.secondary,
  },
  listItem: {
    padding: theme.spacing(2),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  },
});
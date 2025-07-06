import { Theme, keyframes } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

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
export const getTopLevelStyles = (theme: Theme) => ({
    appContainerStyles: {
        height: '100%',
        width: '100%',
        padding: theme.spacing(0),
    },
});

export const getPageStyles = (theme: Theme) => ({
    // Layout structure
    display: 'flex',
    flexDirection: 'row' as const,
    width: '100%',
    height: '100%', // Ensure full viewport height
    flex: 1,
    minHeight: 0, // Allow children to shrink if needed
    minWidth: 0, // Allow children to shrink if needed
    maxWidth: 1400,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
});

export const getHomePageStyles = (theme: Theme) => ({
    homePageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing(5),
    },
    toggleContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    contentContainer: {
        width: '100%',
        minWidth: 'fit-content',
    },
});

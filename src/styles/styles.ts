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

        height: '100%', // Full viewport height
        width: '100%', // Full viewport width
        display: 'flex',
        flexDirection: 'column' as const, // Column layout for header, main content, and footer
        flex: 1,
        minHeight: 0,
        padding: theme.spacing(0),
    },
});

export const getPageStyles = (theme: Theme) => ({
    // Layout structure
    display: 'flex',
    flexDirection: 'column' as const,
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
        height: '100%',
        display: 'flex',
        flexDirection: 'row' as const,
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        alignItems: 'start' as const,
        gap: theme.spacing(20),
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column' as const,
            gap: theme.spacing(4),
            alignItems: 'stretch' as const,
        },
    },
    toggleContainer: {
        height: '100%',
        display: 'flex',
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        flexDirection: 'column' as const,
        alignItems: 'start' as const,
        gap: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            alignItems: 'stretch' as const,
            gap: theme.spacing(1),
        },
    },
    contentContainer: {
        height: '100vh',
        width: '100%',
        flex: 1,
        minWidth: '50%',
        minHeight: '100%',
        [theme.breakpoints.down('sm')]: {
            minWidth: 0,
            minHeight: 0,
            height: 'auto',
        },
    },
});

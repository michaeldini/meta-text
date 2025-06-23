import { Theme, keyframes } from '@mui/material/styles';


// Define fadeIn keyframes inside the styles file
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(24px);}
  to { opacity: 1; transform: translateY(0);}
`;

export const createFormStyles = (theme: Theme) => ({
    uploadFormInner: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'start' as const,
        gap: theme.spacing(2),
    },
    paperStyles: {
        minHeight: theme.spacing(20),
        height: '100%',
        animation: `${fadeIn} 0.9s ease`, // Add animation here
    },
    loadingBoxStyles: {
        display: 'flex',
        justifyContent: 'center',
        mt: theme.spacing(2),
    },
    spinnerStyles: {
        size: theme.spacing(4),
    },
    alertStyles: {
        width: '100%',
    },
});

import { Theme, keyframes } from '@mui/material/styles';


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

export const createFormStyles = (theme: Theme) => ({
    createFormContainer: {
        minHeight: theme.spacing(20),
        height: '100%',
        animation: `${flipIn} 0.3s cubic-bezier(0.4,0.2,0.2,1)`, // Use flip animation
        transformStyle: 'preserve-3d',
    },
    uploadFormInner: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'start' as const,
        gap: theme.spacing(2),

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

import { Theme } from '@mui/material/styles';

export const getTopLevelStyles = (theme: Theme) => ({
    // pageContainerStyles: {
    //     // Layout structure
    //     display: 'flex',
    //     flexDirection: 'column' as const,
    //     width: '100%',
    //     height: '100%', // Ensure full viewport height
    //     flex: 1,
    //     minHeight: 0, // Allow children to shrink if needed
    //     maxWidth: 1400,
    //     marginLeft: 'auto',
    //     marginRight: 'auto',
    //     paddingLeft: theme.spacing(0),
    //     paddingRight: theme.spacing(0),
    //     backgroundColor: theme.palette.background.default,
    // },

    appContainerStyles: {

        height: '100%', // Full viewport height
        width: '100%', // Full viewport width
        display: 'flex',
        flexDirection: 'column' as const, // Column layout for header, main content, and footer
        flex: 1,
        minHeight: 0,
        paddingLeft: theme.spacing(0),
    },
});

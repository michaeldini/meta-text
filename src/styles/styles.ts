import { Theme } from '@mui/material/styles';

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

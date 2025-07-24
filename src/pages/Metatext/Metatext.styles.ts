// Contains styles for Metatext details and review pages.
//  (NOT for the Metatext landing page, which uses DocumentManagementLayout)

import { Theme } from '@mui/material/styles';


export const getMetatextDetailStyles = (theme: Theme) => ({
    container: {
        display: 'flex',
        height: '100%',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: theme.spacing(1.5), // Reduced gap between sections
        paddingRight: theme.spacing(5), // Adjusted for floating toolbar
        paddingLeft: theme.spacing(0),

    },

    // headerContainer: {
    //     padding: theme.spacing(2),
    //     gap: theme.spacing(6),
    //     marginBottom: theme.spacing(20),
    //     display: 'flex',
    //     flexDirection: { xs: 'column', sm: 'row' },
    //     flexWrap: 'wrap', // Allow wrapping on small screens
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     width: '100%',
    //     boxSizing: 'border-box',
    //     flex: 1,
    // },

    headerPaper: {
        padding: theme.spacing(1.5), // Compact padding
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 'auto', // Remove default min-height
        flexWrap: 'wrap', // Allow wrapping on small screens
        width: '100%',
        gap: theme.spacing(2),
    },
    headerTitleBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing(1),
        minWidth: 'fit-content',
    },
});


export const getMetatextReviewStyles = (theme: Theme) => ({
    root: {
        padding: theme.spacing(0),
    },
    header: {
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'flex-start',
        gap: theme.spacing(0),
        marginBottom: theme.spacing(2),
    },
    title: {
        marginLeft: theme.spacing(1),
    },

    loadingBox: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(4),
    },
});


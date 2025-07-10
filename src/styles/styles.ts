import { Theme, keyframes } from '@mui/material/styles';

/**
 * Unified styles function that provides all application-level styles
 * @param theme - Material-UI theme object
 * @returns Object containing all style categories
 */
export const getAppStyles = (theme: Theme) => ({
    // Top-level app container styles
    appContainer: {
        height: '100%',
        width: '100%',
        padding: theme.spacing(0),
    },

    // Page layout styles
    pageLayout: {
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
    },

    // Home page specific styles
    homePage: {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: theme.spacing(5),
        },
        navigationButtons: {
            display: 'flex',
            justifyContent: 'center',
            my: 3,
            gap: 2,
            flexWrap: 'wrap',
        },
    },

    // Welcome text styles for the home page
    welcomeText: {
        container: {
            minWidth: '25%',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 800,
            textAlign: 'center' as const,
            margin: theme.spacing(2, 0),
        },
        title: {
            fontSize: 32,
            color: theme.palette.secondary.dark,
            fontWeight: 700,
            marginBottom: theme.spacing(2),
        },
        text: {
            mt: 2,
            fontSize: 20,
            color: theme.palette.text.primary,
        },
    },

    // Shared styles among the SourceDocs and MetaText landing pages. They exist in the DocumentManagementLayout component.
    // The styles are shared to avoid duplication and ensure consistency
    sharedStyles: {

        // Container styles for document management layouts
        container: {
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
        },
        containerBreakpoint: {
            mb: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 10,
        },

        // Typography styles for titles and subtitles
        title: {
            fontWeight: 'bold',
            mb: 1,
            color: 'text.primary',
        },
        subtitle: {
            mb: 2,
            color: 'text.secondary',
        },
    },
});

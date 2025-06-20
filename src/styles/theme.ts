import { createTheme } from '@mui/material/styles';
import { grey, blue, cyan } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        mode: 'dark',
        // spacing: 4,
        primary: {
            main: blue[900],
            light: blue[200],
            dark: blue[400],
        },
        secondary: {
            main: cyan[600],
            light: cyan[500],
            dark: cyan[700],
        },
        text: {
            primary: grey[200],
            secondary: grey[400],
            disabled: grey[700],
        },
        background: {
            default: grey[800],
            paper: grey[900],
        },
        divider: grey[700],
    },
    typography: {
        fontFamily: 'Arial, sans-serif, system-ui',
        fontSize: 16,
        h1: {
            fontSize: '2.125rem',
            fontWeight: 500,
            lineHeight: 1.235,
        },
        body2: {
            fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
            fontSize: '1.5rem',
            lineHeight: 2,
            letterSpacing: '0.02em',
            fontWeight: 400,
            color: grey[400],
        },
    },
    // shape: {
    //     borderRadius: 8,
    // },
    components: {
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    '& .MuiInputBase-input': {
                        color: grey[200],
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '32px', // default padding for all Paper components
                    borderRadius: 8,
                },
            },
        },
        MuiPopover: {
            styleOverrides: {
                paper: {
                    padding: 8,
                    margin: 8,

                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    marginTop: '16px', // mt: 2 (theme.spacing(2) = 16px by default)
                },
            },
        },

        MuiButton: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none', // Disable uppercase transformation
                    color: grey[200],
                    borderColor: grey[600],
                    '&:hover': {
                        backgroundColor: grey[700],
                        borderColor: grey[500],
                    },
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
            },
        },
    }
});
export default theme;

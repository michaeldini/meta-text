import { createTheme } from '@mui/material/styles';
import { grey, blue, cyan } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        mode: 'dark',
        // spacing: 4,
        primary: {
            main: blue[300],
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
    },
    shape: {
        borderRadius: 15,
    },
    components: {
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                inputProps: {
                    style: { color: grey[200] },
                },
            },
        },
    },
});

export default theme;

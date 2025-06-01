import { createTheme } from '@mui/material/styles';
import { grey, cyan, red, green, teal } from '@mui/material/colors';
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: cyan[900] },
        secondary: { main: cyan[700] },
        background: {
            default: grey[900],
            paper: grey[900],
        },
        error: { main: red[400] },
        success: { main: green[700] },
        text: {
            primary: grey[50],
            secondary: grey[100],
        },
    },
    shape: {
        borderRadius: 8,
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
    components: {
        MuiInputBase: {
            styleOverrides: {
                input: ({ theme }) => ({
                    color: theme.palette.text.primary,
                }),
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.text.secondary,
                    '&.Mui-focused': {
                        color: theme.palette.primary.main,
                    },
                }),
            },
        },
    },
});

export default theme;

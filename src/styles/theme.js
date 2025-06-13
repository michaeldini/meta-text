import { createTheme } from '@mui/material/styles';
import { grey, cyan, red, green } from '@mui/material/colors';
const theme = createTheme({

    palette: {
        mode: 'dark',
        primary: { main: cyan[900] },
        secondary: { main: cyan[800] },
        background: {
            default: grey[900],
            paper: grey[800],
        },
        error: { main: red[400] },
        success: { main: green[700] },
        text: {
            primary: grey[200], // lighter than grey[50]
            secondary: grey[600],
            chunk_text: grey[400],
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

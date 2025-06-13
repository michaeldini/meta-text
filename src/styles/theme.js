import { createTheme } from '@mui/material/styles';
import { grey, cyan, orange } from '@mui/material/colors';
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: cyan[300], // #40c4ff
            light: cyan[200], // #80deea
            dark: cyan[400], // #00bcd4
        },
        secondary: {
            main: orange[400], // #ff9100
            light: orange[300], // #ffab40
            dark: orange[500], // #ff6d00
        },
        text: {
            primary: grey[200], // #eeeeee
            secondary: grey[400], // #bdbdbd
            disabled: grey[700], // #616161
        },
        divider: grey[700], // #616161

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
        // MuiButtonBase: {
        //     defaultProps: {
        //         variant: 'text',
        //         borderRadius: 20,
        //     },
        // },
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

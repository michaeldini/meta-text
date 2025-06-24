import '@mui/material/styles';
declare module '@mui/material/styles' {
    interface Theme {
        shape: {
            borderRadius: number;
            borderRadiusSm: number;
        };
    }
    // allow configuration using `createTheme()`
    interface ThemeOptions {
        shape?: {
            borderRadius?: number;
            borderRadiusSm?: number;
        };
    }
}

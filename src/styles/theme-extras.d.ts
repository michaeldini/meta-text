import '@mui/material/styles';
declare module '@mui/material/styles' {
    interface Theme {
        shape: {
            borderRadius: number;
            borderRadiusSm: number;
        };
        icons: {
            default: React.CSSProperties;
            className: string;
        }
    };
    // allow configuration using `createTheme()`
    interface ThemeOptions {
        shape?: {
            borderRadius?: number;
            borderRadiusSm?: number;
        };
        icons?: {
            default?: React.CSSProperties;
            className?: string;
        };
    }
}
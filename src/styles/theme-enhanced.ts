import { createTheme } from '@mui/material/styles';
import { grey, blue } from '@mui/material/colors';

// Enhanced theme with better component defaults
const enhancedTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: grey[800],
            light: grey[200],
            dark: grey[400],
        },
        secondary: {
            main: blue[600],
            light: blue[500],
            dark: blue[700],
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

    // Define consistent spacing scale
    spacing: 8, // Base unit (8px)

    // Shape defaults
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
        body2: {
            fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
            fontSize: '1.5rem',
            lineHeight: 2,
            letterSpacing: '0.02em',
            fontWeight: 400,
            color: grey[400],
        },
    },

    components: {
        // Global Paper defaults - good approach!
        MuiPaper: {
            defaultProps: {
                elevation: 2, // Consistent elevation
            },
            styleOverrides: {
                root: {
                    padding: 24, // Use theme.spacing(3) equivalent
                    borderRadius: 8,
                    // Add subtle transitions for better UX
                    transition: 'box-shadow 0.2s ease-in-out',
                },
            },
        },

        // Better Button defaults
        MuiButton: {
            defaultProps: {
                variant: 'outlined',
                disableElevation: true, // Flat design
            },
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 500,
                    padding: '8px 16px',
                    transition: 'all 0.2s ease-in-out',
                },
                outlined: {
                    color: grey[200],
                    borderColor: grey[600],
                    '&:hover': {
                        backgroundColor: grey[700],
                        borderColor: grey[500],
                        transform: 'translateY(-1px)', // Subtle lift effect
                    },
                },
            },
        },

        // TextField with better focus states
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                fullWidth: true, // Common default
            },
            styleOverrides: {
                root: {
                    '& .MuiInputBase-input': {
                        color: grey[200],
                    },
                    '& .MuiOutlinedInput-root': {
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: grey[500],
                            },
                        },
                        '&.Mui-focused': {
                            transform: 'scale(1.01)', // Subtle scale on focus
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderWidth: 2,
                            },
                        },
                    },
                },
            },
        },

        // Container defaults for layout consistency
        MuiContainer: {
            defaultProps: {
                maxWidth: false, // No max width constraint
            },
            styleOverrides: {
                root: {
                    paddingTop: 16,
                    paddingBottom: 16,
                    display: 'flex',
                    flexDirection: 'column',
                },
            },
        },

        // Typography defaults
        MuiTypography: {
            styleOverrides: {
                h1: { marginBottom: 16 },
                h2: { marginBottom: 12 },
                h3: { marginBottom: 12 },
                h4: { marginBottom: 8 },
                h5: { marginBottom: 8 },
                h6: { marginBottom: 8 },
                body1: { marginBottom: 8 },
                body2: { marginBottom: 8 },
            },
        },
    },
});

export default enhancedTheme;

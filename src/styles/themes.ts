import { createTheme, ThemeOptions } from '@mui/material/styles';
import { grey, blue, cyan, indigo } from '@mui/material/colors';
// declare module augmentation for MUI theme defaults
// Shared theme configuration that applies to both light and dark modes
const baseTheme: ThemeOptions = {
    spacing: 8, // Base unit (8px)
    shape: {
        borderRadius: 8,
        borderRadiusSm: 4, // Smaller radius for specific components
    },
    icons: {
        default: {
            width: 24,
            height: 24,
        },
        className: 'size-6 text-blue-500', // this doesnt work, maybe can be later
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
        },
    },
    // Shared component configurations
    components: {
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
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
        MuiAlert: {
            styleOverrides: {
                root: {
                    marginTop: '16px', // mt: 2
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    margin: 0,
                    padding: 0,
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    padding: 0,
                    margin: 0,
                },
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: {
                    color: '#9c88ff', //  #9c88ff
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '32px',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(8px)',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: '1rem', // 16px
                    lineHeight: 1.5,
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: blue[900],
                    '& th': {
                        fontWeight: 600,
                        // color: grey[900],   // Darker text for better contrast

                    }
                }
            }
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    padding: 8,
                    margin: 8,
                    minHeight: 32,
                    width: '100%',
                    '&.Mui-expanded': {
                        minHeight: 32,
                    },
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    minHeight: 32,
                    paddingTop: 0,
                    paddingBottom: 0,
                    '&.Mui-expanded': {
                        minHeight: 32,
                    },
                },
                content: {
                    margin: 0,
                    padding: 0,
                },
            },
        },
        MuiAccordionDetails: {
            styleOverrides: {
                root: {
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8,
                },
            },
        },
    },

};

// Light theme configuration
export const lightTheme = createTheme({
    ...baseTheme,
    palette: {
        mode: 'light',
        primary: {
            main: blue[600],
            light: blue[400],
            dark: blue[800],
        },
        secondary: {
            main: grey[600],
            light: grey[400],
            dark: grey[800],
        },
        text: {
            primary: grey[900],
            secondary: grey[600],
            disabled: grey[400],
        },
        background: {
            default: grey[50],
            paper: '#ffffff',
        },
        divider: grey[200],
    },
    components: {
        ...baseTheme.components,
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '32px',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(8px)',
                },
            },
        },
        MuiPopover: {
            styleOverrides: {
                paper: {
                    padding: 8,
                    margin: 8,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    '& .MuiInputBase-input': {
                        color: grey[900],
                    },
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
                    textTransform: 'none',
                    color: grey[700],
                    borderColor: grey[300],
                    '&:hover': {
                        backgroundColor: grey[100],
                        borderColor: grey[400],
                    },
                },
            },
        },
    },
});

// Dark theme configuration (your current theme, enhanced)
export const darkTheme = createTheme({
    ...baseTheme,
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
            secondary: blue[500],
            disabled: grey[700],
        },
        background: {
            default: grey[800],
            paper: grey[900],
        },
        divider: grey[700],
    },
    components: {
        ...baseTheme.components,
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '32px',
                    borderRadius: 8,
                    backgroundColor: grey[900],
                    backdropFilter: 'blur(8px)',
                },
            },
        },
        MuiPopover: {
            styleOverrides: {
                paper: {
                    padding: 8,
                    margin: 8,
                    backgroundColor: grey[800],
                },
            },
        },
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
        MuiButton: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    color: grey[200],
                    borderColor: grey[600],
                    '&:hover': {
                        backgroundColor: grey[700],
                        borderColor: grey[500],
                    },
                },
            },
        },
    },
});

// Helper function to get theme based on mode
export const getTheme = (mode: 'light' | 'dark') => {
    return mode === 'light' ? lightTheme : darkTheme;
};

// Export your current theme as default (dark theme)
export default darkTheme;

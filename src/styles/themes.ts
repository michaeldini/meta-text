import { createTheme, ThemeOptions } from '@mui/material/styles';
import { grey, blue, blueGrey, deepPurple, cyan, indigo, yellow } from '@mui/material/colors';
// declare module augmentation for MUI theme defaults
// Shared theme configuration that applies to both light and dark modes
const baseTheme: ThemeOptions = {
    spacing: 8, // Base unit (8px)
    shape: {
        borderRadius: 8,
        borderRadiusSm: 4, // Smaller radius for specific components
    },
    breakpoints: {
        values: {
            xs: 0,    // mobile
            sm: 600,  // tablet
            md: 900,  // small laptop
            lg: 1200, // desktop
            xl: 1536, // large screens
        },
    },
    icons: {
        default: {
            width: 24,
            height: 24,
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif, system-ui',
        fontSize: 16,
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
            styleOverrides: {
                root: {}, // color override in theme
            },
        },
        MuiButton: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    width: '100%',
                    flex: 1,
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
                root: {},
            },
        },
        MuiCircularProgress: {
            defaultProps: {
                size: 32,
            },
            styleOverrides: {
                root: {
                    color: "secondary.main", // Use secondary color for progress    
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
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
                    }
                }
            }
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    // padding: 8,
                    // margin: 8,
                    width: '100%',
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    paddingTop: 0,
                    paddingBottom: 0,
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
        // Add shared Popover config, but leave color/boxShadow for theme
        MuiPopover: {
            styleOverrides: {
                paper: {
                    padding: 8,
                    margin: 8,
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
        MuiPaper: {
            styleOverrides: {
                root: {
                    // padding: '32px',
                    backgroundColor: '#fff',
                },
            },
        },
        MuiPopover: {
            styleOverrides: {
                paper: {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-input': {
                        color: grey[900],
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
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

// Dark theme configuration
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
            main: blue[500],
            light: blue[100],
            dark: blue[700],
        },
        text: {
            primary: grey[200],
            secondary: blue[100],
            disabled: grey[700],
        },
        background: {
            default: '#000', // changed from grey[900] to black
            paper: grey[900],
        },
        divider: grey[700],
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: grey[900],
                },
            },
        },
        MuiPopover: {
            styleOverrides: {
                paper: {
                    backgroundColor: grey[800],
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-input': {
                        color: grey[200],
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderColor: blue[500],
                    color: blue[100],
                    '&:hover': {
                        backgroundColor: blue[700],
                        transform: 'scale(1.05)',
                    },
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    borderColor: blue[500],
                    color: blue[50],
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                    '&.Mui-selected': {
                        backgroundColor: blue[700],
                        transform: 'scale(1.05)',
                    },
                },
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: {
                    color: blue[300], // Use a lighter blue for progress in dark mode
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

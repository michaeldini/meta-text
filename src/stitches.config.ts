
import { createStitches } from '@stitches/react';

export const {
    styled,
    css,
    globalCss,
    keyframes,
    getCssText,
    theme,
    createTheme,
    config,
} = createStitches({
    theme: {
        colors: {
            background: '#424244ff',
            text: '#b7b7b8ff',
            primary: '#6ea7f7ff',
            heading: '$primary',
            border: 'gainsboro',
            subtle: '#888',
            dangerBg: '#e53e3e',
            dangerText: '#f6b0b0ff',
            tooltipBg: '#111',
            tooltipText: 'white',
            buttonText: 'white',
            buttonHoverBg: 'rgba(255,255,255,0.1)',
        },
        fonts: {
            body: 'Funnel Display, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            heading: 'Funnel Display',
        },
    },
    media: {
        bp1: '(min-width: 480px)',
    },
});

export const globalStyles = globalCss({
    // applied to the <body> element of index.html
    '*': {
        margin: 0,
        padding: 0,
        backgroundColor: '$colors$background',
    },
});

// --------------------------------------------------------------
// Layout primitives 
// ------------------------------------------------------------
export const Box = styled('div', {
    boxSizing: 'border-box',
    color: '$colors$text',
    fontFamily: '$fonts$body',
    padding: '16px',
    variants: {
        padding: {
            none: { padding: 0 },
            sm: { padding: '8px' },
            md: { padding: '16px' },
            lg: { padding: '24px' },
        },
        variant: {
            danger: {
                alignItems: 'flex-start',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid $colors$dangerBg',
                background: 'rgba(229,62,62,0.08)',
                color: '$colors$dangerText',
                marginTop: 12,
                marginBottom: 12,
                flex: 1,
                minWidth: 0
            },
        },
    }

});

export const Flex = styled('div', {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    variants: {
        variant: {
            danger: {
                alignItems: 'flex-start',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid $colors$dangerBg',
                color: '$colors$dangerText',
                marginTop: 12,
                marginBottom: 12,
                flex: 1,
                minWidth: 0
            },
            noWrap: { flexWrap: 'nowrap' },
        },
    },
});

export const Stack = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
});

// --------------------------------------------------------------
// Typography
// --------------------------------------------------------------
export const Heading = styled('h3', {
    margin: 0,
    marginBottom: '12px',
    fontWeight: 600,
    fontFamily: '$fonts$heading',
    variants: {
        tone: {
            default: {
                fontSize: '1.5rem',
                color: '$colors$heading',
            },
            danger: {
                color: '$colors$dangerText',
            },
        },
    },
    defaultVariants: {
        tone: 'default',
    },
});

export const Text = styled('div', {
    fontFamily: '$body',
    variants: {
        tone: {
            default: {
                fontSize: '1rem',
                color: '$colors$text',
            },
            subtle: {
                color: '$colors$subtle',
            },
            danger: {
                color: '$colors$dangerText',
            },
        },
    },
    defaultVariants: {
        tone: 'default',
    },
});

// --------------------------------------------------------------
// Button, Input, Textarea, Link
// --------------------------------------------------------------
export const Button = styled('button', {
    display: 'inline-flex',
    alignItems: 'center',
    border: 'none',
    background: 'inherit',
    padding: '6px 8px',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '$colors$buttonText',
    fontFamily: '$fonts$body',
    '&:hover': { background: '$buttonHoverBg' },
    variants: {
        tone: {
            default: {},
            primary: { color: '$colors$primary' },
            danger: { background: '$colors$dangerBg' },
            disabled: { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'not-allowed' },
        },
    },
    defaultVariants: {
        tone: 'default',
    },
});

export const Input = styled('input', {
    flex: 1,
    padding: '8px 6px',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    background: 'transparent',
    color: 'inherit',
    '::placeholder': { color: '$colors$subtle' },
});

export const Textarea = styled('textarea', {
    width: '100%',
    minHeight: 'fit-content',
    height: '5rem',
    border: 'none',
    outline: 'none',
    fontSize: '0.95rem',
    background: 'transparent',
    color: 'inherit',
    resize: 'none',
    fontFamily: '$fonts$body',
    '::placeholder': { color: '$colors$subtle' },
    variants: {
        emphasized: {
            true: {
                padding: '8px',
                // allow vertical resizing and provide a visible border
                resize: 'vertical',
                border: '1px solid $colors$border',
                borderRadius: 6,
                background: 'white',
                minHeight: 80,
                maxHeight: 180,
                minWidth: '100%',
                marginBottom: 4,
                '&:disabled': { background: '$colors$subtle' },
            },
        },
    },
});

export const Link = styled('a', {
    color: 'BlueViolet',
    fontWeight: 'bold',
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
});

// --------------------------------------------------------------
// Simple wrap container for tag lists and chips
// --------------------------------------------------------------
export const Wrap = styled('div', {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
});

export const WrapItem = styled('div', {
    display: 'inline-flex',
});

// Tag / Badge primitive with a few color variants
export const TagRoot = styled('span', {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: '0.9rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    variants: {
        colorPalette: {
            gray: { background: 'gainsboro', color: 'black' },
            yellow: { background: 'gold', color: 'black' },
            green: { background: 'lightgreen', color: 'black' },
            red: { background: '$colors$dangerBg', color: '$colors$dangerText' },
        },
        size: {
            md: { padding: '6px 10px', fontSize: '0.9rem' },
        },
    },
    defaultVariants: { size: 'md', colorPalette: 'gray' },
});

export const TagLabel = styled('span', {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    maxWidth: '200px',
});



// ---------------------------------------------------------------
// Loading spinner
// ---------------------------------------------------------------
export const Spinner = styled('div', {
    display: 'inline-block',
    width: 32,
    height: 32,
    border: '4px solid $gray6',
    borderTop: '4px solid $blue9',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
});

// --------------------------------------------------------------
// Table primitives (moved from SearchableTable.tsx)
// --------------------------------------------------------------
export const TableContainer = styled(Box, {
    padding: '16px',
    minWidth: '20rem',
    boxSizing: 'border-box',
});

export const Empty = styled('div', {
    padding: '16px',
    textAlign: 'center',
    color: '$colors$subtle',
});

export const TableScrollArea = styled('div', {
    maxHeight: '32rem',
    overflow: 'auto',
});

export const TableRoot = styled('table', {
    width: '100%',
    borderCollapse: 'collapse',
});

export const THead = styled('thead', {
    position: 'sticky',
    top: 0,
    background: 'transparent',
});

export const TRow = styled('tr', {
    background: 'transparent',
});

export const Th = styled('th', {
    textAlign: 'left',
    padding: '8px',
    fontWeight: 600,
    borderBottom: '1px solid $colors$border',
});

export const TBody = styled('tbody', {
    background: 'transparent',
});

// --------------------------------------------------------------
// Dropzone for file uploads
// --------------------------------------------------------------
export const Dropzone = styled(Box, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '18px',
    borderRadius: 8,
    border: '1px dashed $colors$border',
    background: 'transparent',
    cursor: 'pointer',
    outline: 'none',
    transition: 'box-shadow 120ms ease, border-color 120ms ease',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
    '&:focus-visible': {
        boxShadow: '0 0 0 3px hsla(200,100%,50%,0.08)',
    },
    variants: {
        $disabled: {
            true: { opacity: 0.6, cursor: 'not-allowed' },
            false: {},
        },
    },
});


// --------------------------------------------------------------
// Sticky container for chunk tools container
// --------------------------------------------------------------
export const StickyContainer = styled('div', {
    position: 'sticky',
    top: 24,
    maxWidth: '40%',
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
    background: 'transparent',
});

// --------------------------------------------------------------
// Select element
// --------------------------------------------------------------

export const SelectEl = styled('select', {
    color: '$colors$text',
    maxWidth: '320px',
    padding: '8px 36px 8px 10px',
    borderRadius: 6,
    border: '1px solid $colors$border',
    fontSize: '1rem',
    fontFamily: '$fonts$body',
});


// --------------------------------------------------------------
// Button group container
// --------------------------------------------------------------

export const PanelContainer = styled('div', {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    background: 'black',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
    minHeight: '48px',
    color: 'white',
});

export const ButtonGroup = styled('div', {
    display: 'flex',
    justifyContent: 'stretch',
    alignItems: 'center',
    gap: 0,
    width: '100%',
    padding: '$2',
});



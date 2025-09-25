/**
 * 
 * Stitches configuration and styled components for the application.
 * 
 * This file sets up the design system using Stitches, defining themes,
 * global styles, and reusable styled components.
 * 
 * It includes:
 * - Theme configuration with colors, fonts, and media queries.
 * - Global styles applied across the application.
 * - Reusable styled components for layout, typography, buttons, inputs, tables, etc.
 * 
 */

import { createStitches } from '@stitches/react';


/**
 * 
 * Stitches configuration with theme, media queries, and utility functions.
 * 
 * This configuration defines the design tokens and responsive breakpoints
 * used throughout the application.
 * 
 * Exposed APIs include:
 * - styled: for creating styled components.
 * - css: for creating CSS classes.
 * - globalCss: for defining global styles.
 * - keyframes: for defining CSS animations.
 * - theme: the default theme object.
 * - createTheme: for creating additional themes.
 * - config: the Stitches configuration object.
 * 
 */
export const {
    styled,
    css,
    globalCss,
    keyframes,
    theme,
    createTheme,
    config,
} = createStitches({
    theme: {
        colors: {
            background: '#424244ff',
            altBackground: 'black',
            text: '#b7b7b8ff',
            altText: 'white',
            primary: '#6ea7f7ff',
            heading: '$primary',
            border: 'gainsboro',
            subtle: '#888',
            dangerBg: '#f6b0b0ff',
            dangerBorder: '#e53e3e',
            successBg: '#22c55eff',
            successBorder: '#16a34aff',
            infoBg: '#3b82f6ff',
            infoBorder: '#2563ebff',
            warningBg: '#f59e42ff',
            warningBorder: '#d97706ff',
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
    utils: {
        marginX: (value: string) => ({ marginLeft: value, marginRight: value }),
        marginY: (value: string) => ({ marginTop: value, marginBottom: value }),
        paddingX: (value: string) => ({ paddingLeft: value, paddingRight: value }),
        paddingY: (value: string) => ({ paddingTop: value, paddingBottom: value }),
        bg: (value: string) => ({ backgroundColor: value }),

    },
});

// Accordion keyframes for animating collapsible content size.
// These follow Radix UI's recommendation to animate using
// a CSS variable `--radix-collapsible-content-height` that Radix
// sets on the content element when measuring.
export const accordionDown = keyframes({
    from: { height: '0' },
    to: { height: 'var(--radix-collapsible-content-height)' },
});

export const accordionUp = keyframes({
    from: { height: 'var(--radix-collapsible-content-height)' },
    to: { height: '0' },
});


/**
 * 
 * Global styles applied to the entire application.
 * 
 * This includes:
 * - Resetting margin and padding for all elements.
 * - Setting a consistent background color for the body.
 * 
 * Note: This should be called once at the root of the application.
 * 
 */
export const globalStyles = globalCss({
    '*': {
        margin: 0,
        padding: 0,
    },
    'body': {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '$colors$background',
        color: '$colors$text',
        fontFamily: '$fonts$body',
        lineHeight: 1.5,
        overflowY: 'scroll', // prevent layout shift when navigating between pages with/without scrollbars
    },
    'svg': {
        background: 'transparent !important',
    },
    'nav': {
        justifyContent: 'start',
        alignItems: 'center',
    },
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
});

// --------------------------------------------------------------
// Layout primitives 
// ------------------------------------------------------------
export const BaseBox = styled('div', {
    boxSizing: 'border-box',
    variants: {
        noPad: { true: { padding: 0 } },
        fullWidth: { true: { width: '100%' } },
        center: { true: { marginLeft: 'auto', marginRight: 'auto' } },
        justifyCenter: { true: { justifyContent: 'center' } },
        noWrap: { true: { flexWrap: 'nowrap' } },
        p: {
            0: { padding: 0 },
            1: { padding: '8px' },
            2: { padding: '16px' },
            3: { padding: '24px' },
        },
        m: {
            0: { margin: 0 },
            1: { margin: '8px' },
            2: { margin: '16px' },
            3: { margin: '24px' },
        },
        gap: {
            0: { gap: 0 },
            1: { gap: '8px' },
            2: { gap: '16px' },
            3: { gap: '24px' },
        },
        alignCenter: { true: { alignItems: 'center' } },
        cursorPointer: { true: { cursor: 'pointer' } },
        variant: {
            homepageSection: {
                minWidth: '20rem',
            },
        },
    },

});
export const Box = styled(BaseBox, {
    defaultVariants: {
        noPad: true,
    },
});

export const Row = styled(BaseBox, {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    defaultVariants: {
        gap: '1',
    },
});

export const Column = styled(BaseBox, {
    display: 'flex',
    flexDirection: 'column',
    defaultVariants: {
        gap: '1'
    }
},
);

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
                color: 'black',
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
                color: 'black',
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
    border: 'transparent',
    borderRadius: 6,
    background: 'none',
    padding: '6px 8px',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '$colors$altText',
    fontFamily: '$fonts$body',
    '&:hover': { background: '$buttonHoverBg' },
    '&:disabled': {
        background: 'rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.5)',
        cursor: 'not-allowed',
        '&:hover': { background: 'rgba(255,255,255,0.1)' },
    },
    // smooth background transition
    transition: 'background 120ms ease',
    // tone variants
    variants: {
        tone: {
            default: {},
            primary: { color: '$colors$primary' },
            danger: { background: '$colors$dangerBorder' },
            disabled: { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'not-allowed' },
        },
    },
    defaultVariants: {
        tone: 'default',
    },
});

export const Input = styled('input', {
    flex: 1,
    padding: '10px 6px',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    background: 'transparent',
    color: 'inherit',
    '&::placeholder': { color: '$colors$alText' },
});

export const NumberInput = styled(Input, {
    // Hide spin buttons in Webkit browsers
    '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
        display: 'none',
        WebkitAppearance: 'none',
        margin: 0,
    },
    // Hide spin buttons in Firefox
    '&': {
        MozAppearance: 'textfield',
    },
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
            red: { background: '$colors$dangerBorder', color: '$colors$dangerBg' },
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
    color: '$colors$primary',
    border: '4px solid $colors$altBackground',
    borderTop: '4px solid $colors$primary',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
});

// --------------------------------------------------------------
// Table primitives (moved from SearchableTable.tsx)
// --------------------------------------------------------------

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

export const TData = styled('td', {
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
    top: 80,
    maxWidth: '40%',
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
    background: 'transparent',
    zIndex: 5, // Lower than MetatextHeader but above content
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
    background: 'transparent',
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


// --------------------------------------------------------------
// Icon wrapper (for icon buttons)
// --------------------------------------------------------------
export const IconWrapper = styled('span', {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5em',
    background: 'transparent',
    variants: {
        closeButton: {
            true: { alignSelf: 'flex-end', justifyContent: 'end', cursor: 'pointer', flex: '1 1 auto' },
        },
    },
});

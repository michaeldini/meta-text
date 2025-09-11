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
            text: '#888889ff',
            heading: '#e0e0e0ff',
            gray400: 'gainsboro',
            gray500: 'lightgray',
            tooltipBg: '#111',
            tooltipText: 'white',
            // button colors
            buttonText: 'inherit',
            buttonPrimaryBg: '#0ea5a4',
            buttonPrimaryText: 'white',
            buttonDangerBg: '#e53e3e',
            buttonDangerText: 'white',
        },
    },
    media: {
        bp1: '(min-width: 480px)',
    },
});

// Shared tooltip keyframe and style objects so components can import centralized styles
export const tooltipFade = keyframes({
    '0%': { opacity: 0, transform: 'translateY(4px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
});

export const tooltipContentStyles = {
    background: '$colors$tooltipBg',
    color: '$colors$tooltipText',
    padding: '8px 10px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
    animation: `${tooltipFade} 160ms ease`,
};

export const tooltipArrowStyles = {
    fill: '$colors$tooltipBg',
};

// shared button styles (exported so components can import variants & base styles)
// Button primitive: all base styles and size variants are defined here for DRYness
export const Button = styled('button', {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    border: 'none',
    background: 'transparent',
    padding: '6px 8px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: '$colors$buttonPrimaryText',
    variants: {
        size: {
            sm: { padding: '4px 6px', fontSize: '0.8rem' },
            md: { padding: '6px 8px', fontSize: '0.95rem' },
            lg: { padding: '8px 10px', fontSize: '1rem' },
        },
        tone: {
            default: {},
            primary: { background: '$colors$buttonPrimaryBg', color: '$colors$buttonPrimaryText' },
            danger: { background: '$colors$buttonDangerBg', color: '$colors$buttonDangerText' },
        },
    },
    defaultVariants: {
        size: 'md',
        tone: 'default',
    },
});

// Common reusable primitives for app-wide consistency
export const Box = styled('div', {
    boxSizing: 'border-box',
    color: '$colors$text',
});

export const Flex = styled('div', {
    display: 'flex',
});

export const Stack = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
});

export const Heading = styled('h3', {
    margin: 0,
    marginBottom: '12px',
    fontSize: '1rem',
    fontWeight: 600,
    color: '$colors$heading',
});

export const Text = styled('div', {
    variants: {
        tone: {
            default: {
                fontSize: '1rem',
                color: 'inherit',
            },
            heading: {
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '$colors$heading',
                marginBottom: '12px',
            },
        },
    },
    defaultVariants: {
        tone: 'default',
    },
});

export const Panel = styled('div', {
    padding: '16px',
    minWidth: '20rem',
    boxSizing: 'border-box',
});

export const Input = styled('input', {
    flex: 1,
    padding: '8px 6px',
    border: 'none',
    borderBottom: '1px solid $colors$gray400',
    outline: 'none',
    fontSize: '0.95rem',
    background: 'transparent',
    color: 'inherit',
    '::placeholder': { color: '$colors$gray500' },
});

export const ClearButton = styled('button', {
    border: 'none',
    background: 'transparent',
    padding: '4px',
    cursor: 'pointer',
    color: 'inherit',
});

export const Link = styled('a', {
    color: 'BlueViolet',
    fontWeight: 'bold',
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
});

// Alert primitives
export const AlertRoot = styled('div', {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: 8,
    background: '$colors$buttonDangerBg',
    color: '$colors$buttonDangerText',
    boxSizing: 'border-box',
});

export const AlertIndicator = styled('div', {
    width: 10,
    height: 10,
    borderRadius: 9999,
    background: 'rgba(255,255,255,0.9)',
    marginTop: 6,
    flex: '0 0 auto',
});

export const AlertContent = styled('div', {
    flex: 1,
    minWidth: 0,
});

export const AlertTitle = styled('div', {
    fontWeight: 700,
    marginBottom: 4,
});

export const AlertDescription = styled('div', {
    fontSize: '0.95rem',
});

export const AlertDismissButton = styled('button', {
    background: 'transparent',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    padding: 6,
    borderRadius: 6,
    fontSize: '1.1rem',
    lineHeight: 1,
    flex: '0 0 auto',
    '&:hover': { background: 'rgba(255,255,255,0.06)' },
});

// Simple wrap container for tag lists and chips
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
            gray: { background: '$colors$gray400', color: 'black' },
            yellow: { background: 'gold', color: 'black' },
            green: { background: 'lightgreen', color: 'black' },
            red: { background: '$colors$buttonDangerBg', color: '$colors$buttonDangerText' },
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

// (tooltip color tokens are defined above in the createStitches theme)
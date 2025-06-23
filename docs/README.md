# MUI Styling Best Practices Guide

## 📚 Quick Reference

### Essential Theme Tokens

- `theme.spacing(n)` - Consistent spacing scale
- `theme.palette.*` - Color system
- `theme.breakpoints.*` - Responsive breakpoints
- `theme.transitions.*` - Consistent animations
- `theme.shape.borderRadius` - Consistent border radius

### Performance Props

- `willChange: 'transform, opacity'` - For animations
- `contain: 'layout style paint'` - For isolated components
- Use `transform` instead of changing `top/left/width/height`

### Accessibility Considerations

- Always provide proper color contrast
- Use theme color tokens for consistent contrast ratios
- Include focus states in interactive elements
- Test with dark/light mode switching

This approach will give you a scalable, maintainable, and performant styling system that leverages MUI's full potential while keeping your code clean and organized.

## Overview

This guide teaches you how to create maintainable, performant, and consistent styling in your React + Material UI application.

## 🎯 Key Principles

### 1. **Leverage MUI Theming First**

- Set global defaults in `theme.ts` for consistency
- Use theme tokens (spacing, colors, breakpoints) instead of hardcoded values
- Define component variants for reusable patterns

### 2. **Keep Styling Minimal**

- Rely on MUI component defaults when possible
- Override only what you need to change
- Use the `sx` prop for component-specific styling
- Avoid inline styles that recreate objects on every render

### 3. **Separate Styling Concerns**

- **Theme level**: Global component defaults and design tokens
- **Feature level**: Styles shared within a feature
- **Component level**: Local component-specific styles
- **Layout level**: Page and structural layouts

## 📁 File Organization

```
src/styles/
├── theme.ts              # Global theme and component defaults
├── layouts/              # Page layout styles
│   ├── page-layouts.ts
│   └── responsive-layouts.ts
└── utils/                # Style utilities and helpers

src/features/[feature]/
├── styles/
│   └── styles.ts         # Feature-specific reusable styles
└── components/
    └── Component.tsx     # Local sx prop usage
```

## 🏗️ Implementation Patterns

### Theme-Level Defaults (Best for global consistency)

```typescript
// theme.ts
components: {
  MuiPaper: {
    defaultProps: {
      elevation: 2,
    },
    styleOverrides: {
      root: {
        padding: 24,
        borderRadius: 8,
        transition: 'box-shadow 0.2s ease-in-out',
      },
    },
  },
  MuiButton: {
    defaultProps: {
      variant: 'outlined',
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
  },
}
```

### Feature-Level Styles (Best for reusable patterns)

```typescript
// features/chunks/styles/styles.ts
export const chunkStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    p: 3,
  },
  
  interactiveCard: {
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: 4,
    },
  },
};
```

### Component-Level Styles (Best for local customization)

```typescript
// Component.tsx
const localStyles = useMemo(() => ({
  specialButton: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 8,
  },
}), []);

// Usage
<Button sx={localStyles.specialButton}>
```

## ⚡ Performance Best Practices

### 1. **Memoize Dynamic Styles**

```typescript
const styles = useMemo(() => 
  createStyles(theme, { active, size }), 
  [theme, active, size]
);
```

### 2. **Use Static Objects**

```typescript
const CARD_STYLES = {
  p: 2,
  bgcolor: 'background.paper',
  borderRadius: 2,
} as const;
```

### 3. **Optimize Animations**

```typescript
const animatedStyles = {
  willChange: 'transform, opacity',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)', // Use transform, not layout properties
  },
};
```

## 📱 Responsive Design Patterns

### Mobile-First Approach

```typescript
const responsiveStyles = {
  fontSize: '1rem',                    // Base mobile size
  padding: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {      // Tablet and up
    fontSize: '1.125rem',
    padding: theme.spacing(2),
  },
  [theme.breakpoints.up('md')]: {      // Desktop and up
    fontSize: '1.25rem',
    padding: theme.spacing(3),
  },
};
```

## 🎨 Theme Customization Examples

### Custom Component Variants

```typescript
// In theme.ts
MuiButton: {
  variants: [
    {
      props: { variant: 'gradient' },
      style: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 8,
        color: 'white',
      },
    },
  ],
},
```

### Consistent Spacing Scale

```typescript
const theme = createTheme({
  spacing: 8, // Base unit (8px)
  // Now use theme.spacing(1) = 8px, theme.spacing(2) = 16px, etc.
});
```

## 🌙 Light and Dark Theme Implementation

### Basic Theme Setup

```typescript
// theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { grey, blue } from '@mui/material/colors';

// Shared theme configuration
const baseTheme: ThemeOptions = {
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'Arial, sans-serif, system-ui',
    fontSize: 16,
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
    background: {
      default: grey[50],
      paper: '#ffffff',
    },
    text: {
      primary: grey[900],
      secondary: grey[600],
    },
  },
});

// Dark theme configuration
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: blue[400],
      light: blue[200],
      dark: blue[600],
    },
    secondary: {
      main: grey[400],
      light: grey[200],
      dark: grey[600],
    },
    background: {
      default: grey[900],
      paper: grey[800],
    },
    text: {
      primary: grey[100],
      secondary: grey[400],
    },
  },
});
```

### Theme Provider Setup

```typescript
// App.tsx or main.tsx
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './styles/theme';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline /> {/* Provides CSS reset and background color */}
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### Advanced Theme with System Preference Detection

```typescript
// hooks/useTheme.ts
import { useState, useEffect } from 'react';

export const useThemeMode = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setMode(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { mode, toggleMode };
};
```

### Theme-Aware Component Styles

```typescript
// styles/theme-aware-styles.ts
import { Theme } from '@mui/material/styles';

export const createThemeAwareStyles = (theme: Theme) => ({
  card: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 4px 20px rgba(0,0,0,0.3)'
      : '0 4px 20px rgba(0,0,0,0.1)',
  },
  
  interactive: {
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[100],
    },
  },
});
```

### Theme Toggle Component

```typescript
// components/ThemeToggle.tsx
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface ThemeToggleProps {
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ onToggle }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <IconButton onClick={onToggle} color="inherit">
        {isDark ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};
```

### Persistent Theme Storage

```typescript
// utils/themeStorage.ts
const THEME_STORAGE_KEY = 'app-theme-mode';

export const saveThemeMode = (mode: 'light' | 'dark') => {
  localStorage.setItem(THEME_STORAGE_KEY, mode);
};

export const loadThemeMode = (): 'light' | 'dark' | null => {
  return localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark' | null;
};

// Enhanced hook with persistence
export const usePersistedTheme = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    // Load from localStorage or system preference
    const saved = loadThemeMode();
    if (saved) return saved;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  });

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    saveThemeMode(newMode);
  };

  return { mode, toggleMode };
};
```

## 🔍 When to Use Each Pattern

| Pattern | Use When | Example |
|---------|----------|---------|
| Theme defaults | Global consistency needed | All buttons should look the same |
| Feature styles | Shared within feature | Chunk components share layout patterns |
| Component sx | Local customization | One-off special styling |
| Static objects | Never changes | Loading overlays, utility classes |
| Memoized styles | Dynamic based on props | Active/inactive states |

## ❌ Common Mistakes to Avoid

1. **Creating objects in render**

   ```typescript
   // BAD
   <Box sx={{ p: 2, bgcolor: 'red' }} /> // New object every render
   
   // GOOD
   const styles = { p: 2, bgcolor: 'red' };
   <Box sx={styles} />
   ```

2. **Hardcoding values instead of theme tokens**

   ```typescript
   // BAD
   padding: '16px'
   
   // GOOD
   padding: theme.spacing(2)
   ```

3. **Overriding everything instead of using defaults**

   ```typescript
   // BAD - Override every button individually
   <Button sx={{ borderRadius: 8, textTransform: 'none' }} />
   
   // GOOD - Set in theme.ts once
   MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none' } } }
   ```

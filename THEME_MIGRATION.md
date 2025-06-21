# Light/Dark Theme Implementation Guide

## 🚀 Quick Start

To implement light and dark themes in your app, follow these steps:

### 1. Replace your main App component

Replace your current `App.tsx` with the enhanced version:

```bash
# Backup your current App.tsx
cp src/App.tsx src/App.backup.tsx

# Use the new theme-aware version
cp src/AppWithThemes.tsx src/App.tsx
```

### 2. Update your main.tsx

```typescript
// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App'; // Now uses the enhanced version
import ErrorBoundary from './components/ErrorBoundary';

if (typeof document !== 'undefined' && document.getElementById('root')) {
    createRoot(document.getElementById('root')!).render(<AppRoot />);
}

export function AppRoot() {
    return (
        <StrictMode>
            <ErrorBoundary>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ErrorBoundary>
        </StrictMode>
    );
}
```

### 3. Add theme toggle to your navbar

Update your NavBar component to include the theme toggle:

```typescript
// In your NavBar component
import ThemeToggle from '../../components/ThemeToggle';
import { useThemeMode } from '../../hooks/useThemeMode';

const NavBar = () => {
  const { toggleMode } = useThemeMode();
  
  return (
    <AppBar>
      <Toolbar>
        {/* Your existing navbar content */}
        
        {/* Add theme toggle */}
        <ThemeToggle onToggle={toggleMode} />
      </Toolbar>
    </AppBar>
  );
};
```

## 📁 New Files Created

- `src/styles/themes.ts` - Light and dark theme definitions
- `src/hooks/useThemeMode.ts` - Theme management hook
- `src/components/ThemeToggle.tsx` - Theme toggle button
- `src/styles/theme-aware-utils.ts` - Utilities for theme-aware styling
- `src/AppWithThemes.tsx` - Enhanced App component

## 🎨 Using Theme-Aware Styles

### In Components

```typescript
import { useTheme } from '@mui/material/styles';
import { createThemeAwareStyles } from '../styles/theme-aware-utils';

const MyComponent = () => {
  const theme = useTheme();
  const styles = createThemeAwareStyles(theme);
  
  return (
    <Paper sx={styles.adaptiveCard}>
      Content that adapts to theme
    </Paper>
  );
};
```

### With Existing Styles

Update your existing style objects to be theme-aware:

```typescript
// Before
const cardStyles = {
  backgroundColor: grey[900], // Hard-coded
  color: grey[200],
};

// After
const cardStyles = (theme: Theme) => ({
  backgroundColor: theme.palette.background.paper, // Theme-aware
  color: theme.palette.text.primary,
});
```

## 🔧 Features

- ✅ Automatic system preference detection
- ✅ User preference persistence in localStorage
- ✅ Smooth transitions between themes
- ✅ Backward compatibility with existing code
- ✅ Accessibility-friendly focus states
- ✅ Performance optimized theme switching

## 🎯 Benefits

1. **Better UX**: Users can choose their preferred theme
2. **Accessibility**: Supports users who prefer dark mode for eye strain
3. **Modern**: Meets current user expectations
4. **Consistent**: All components automatically adapt
5. **Maintainable**: Centralized theme management

## 🚨 Breaking Changes

None! Your existing components will continue to work. The new theme system is additive and backward-compatible.

## 🔄 Migration Path

1. **Phase 1**: Add theme toggle (no changes to existing components)
2. **Phase 2**: Gradually update components to use theme-aware utilities
3. **Phase 3**: Remove hard-coded theme values from components

Your app will work immediately with both themes, and you can gradually enhance components to be more theme-aware over time.

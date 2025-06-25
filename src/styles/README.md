# Style Guide for `src/styles`

This guide helps you maintain consistency and leverage Material UI theming across your app.

---

## 1. How to Use the Theme in Components

- **With the `useTheme` hook:**
  ```tsx
  import { useTheme } from '@mui/material/styles';
  const theme = useTheme();
  // Use theme.palette, theme.spacing, etc.
  ```
- **With the `styled` utility:**
  ```tsx
  import { styled } from '@mui/material/styles';
  const MyDiv = styled('div')(({ theme }) => ({
    background: theme.palette.background.paper,
  }));
  ```
- **With custom style creators:**
  ```tsx
  import { createNavbarStyles } from '../features/navbar/styles/styles';
  const styles = createNavbarStyles(theme);
  ```

---

## 2. How to Add New Theme Values

- Edit `src/styles/theme.ts` (or `themes.ts` if not yet renamed).
- Add new values under `palette`, `typography`, `spacing`, etc.
- Example:
  ```ts
  // In theme.ts
  const baseTheme = {
    ...,
    palette: {
      ...,
      customColor: {
        main: '#123456',
        contrastText: '#fff',
      },
    },
  };
  ```
- Access in components: `theme.palette.customColor.main`

---

## 3. How to Write Theme-Aware Styles

- **Never hardcode colors, spacing, or typography.**
- Always use theme values:
  - `theme.palette.primary.main`
  - `theme.spacing(2)`
  - `theme.typography.h1`
- Example:
  ```ts
  const styles = (theme) => ({
    root: {
      color: theme.palette.text.primary,
      padding: theme.spacing(2),
    },
  });
  ```
- For overrides, use the `components` key in the theme.

---

## 4. File Organization

- Central theme: `src/styles/theme.ts`
- Component styles: Colocate as `ComponentName.styles.ts` and import theme as above.
- Re-export from `src/styles/index.ts` for easy imports.

---

## 5. Resources
- [Material UI Theming Docs](https://mui.com/material-ui/customization/theming/)
- [Best Practices](https://mui.com/material-ui/guides/typescript/)

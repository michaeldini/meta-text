# Keyboard Shortcuts System

This document describes the general keyboard shortcuts system that provides a centralized, extensible way to handle keyboard shortcuts across the application.

## Overview

The system consists of three main parts:

1. **Central Configuration** (`src/utils/keyboardShortcuts.ts`) - Source of truth for all shortcuts
2. **General Hook** (`src/hooks/useKeyboardShortcuts.ts`) - Reusable hook for any component
3. **Feature-Specific Hooks** - Built on top of the general hook for specific features

## Key Benefits

- **Centralized Configuration**: All shortcuts defined in one place
- **Type Safety**: Full TypeScript support with proper interfaces
- **Extensible**: Easy to add new shortcuts without code duplication
- **Consistent**: All shortcuts follow the same patterns
- **Documentation Ready**: Built-in formatting and categorization
- **Platform Aware**: Handles Mac vs PC differences automatically

## Basic Usage

### 1. Using the General Hook

```typescript
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const MyComponent = () => {
    const shortcuts = [
        {
            key: 'Enter',
            description: 'Submit form',
            category: 'Form',
            handler: () => console.log('Enter pressed'),
        },
        {
            key: 's',
            metaKey: true,
            description: 'Save document',
            category: 'File',
            handler: () => console.log('Cmd+S pressed'),
        },
    ];

    useKeyboardShortcuts(shortcuts, {
        enabled: true,
        preventDefault: true,
    });

    return <div>My Component</div>;
};
```

### 2. Using Pre-defined Shortcuts

```typescript
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { GLOBAL_SHORTCUTS } from '../utils/keyboardShortcuts';

const SearchComponent = () => {
    const shortcuts = [
        {
            ...GLOBAL_SHORTCUTS.FOCUS_SEARCH,
            handler: () => focusSearchInput(),
        },
    ];

    useKeyboardShortcuts(shortcuts);
    
    return <input placeholder="Search..." />;
};
```

## Adding New Shortcuts

### 1. Global Shortcuts (work everywhere)

Add to `GLOBAL_SHORTCUTS` in `src/utils/keyboardShortcuts.ts`:

```typescript
export const GLOBAL_SHORTCUTS = {
    // ... existing shortcuts
    TOGGLE_SIDEBAR: {
        key: 'b',
        metaKey: true,
        description: 'Toggle sidebar',
        category: 'Navigation',
    },
};
```

### 2. Feature-Specific Shortcuts

Add to the appropriate feature constant:

```typescript
export const DOCUMENT_SHORTCUTS = {
    SAVE_DOCUMENT: {
        key: 's',
        metaKey: true,
        description: 'Save current document',
        category: 'Documents',
    },
    EXPORT_PDF: {
        key: 'e',
        metaKey: true,
        shiftKey: true,
        description: 'Export as PDF',
        category: 'Documents',
    },
};
```

## Creating Feature-Specific Hooks

Follow this pattern for new feature hooks:

```typescript
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { DOCUMENT_SHORTCUTS, type ShortcutAction } from '../../utils/keyboardShortcuts';

interface UseDocumentKeyboardOptions {
    enabled?: boolean;
    onSave?: () => void;
    onExport?: () => void;
}

export const useDocumentKeyboard = ({ 
    enabled = true,
    onSave,
    onExport
}: UseDocumentKeyboardOptions = {}) => {
    
    const shortcuts: ShortcutAction[] = [
        {
            ...DOCUMENT_SHORTCUTS.SAVE_DOCUMENT,
            handler: () => onSave?.(),
            enabled: enabled && !!onSave,
        },
        {
            ...DOCUMENT_SHORTCUTS.EXPORT_PDF,
            handler: () => onExport?.(),
            enabled: enabled && !!onExport,
        },
    ];

    const { triggerShortcut } = useKeyboardShortcuts(shortcuts, {
        enabled,
        preventDefault: true,
    });

    return {
        triggerSave: () => onSave?.(),
        triggerExport: () => onExport?.(),
        triggerShortcut,
    };
};
```

## Displaying Shortcuts to Users

Use the `KeyboardShortcutsDisplay` component:

```typescript
import { KeyboardShortcutsDisplay } from '../components/KeyboardShortcutsDisplay';

const HelpDialog = () => (
    <Dialog>
        <DialogContent>
            <DialogHeader>Keyboard Shortcuts</DialogHeader>
            <KeyboardShortcutsDisplay />
        </DialogContent>
    </Dialog>
);

// Or show only specific categories
const NavigationHelp = () => (
    <KeyboardShortcutsDisplay categories={['Navigation', 'Search']} />
);
```

## Advanced Options

### Hook Options

```typescript
const options = {
    enabled: true,              // Enable/disable all shortcuts
    preventDefault: true,       // Prevent default browser behavior
    stopPropagation: false,     // Stop event bubbling
    element: document.body,     // Target element (default: window)
};

useKeyboardShortcuts(shortcuts, options);
```

### Conditional Shortcuts

```typescript
const shortcuts = [
    {
        key: 'Enter',
        description: 'Submit form',
        category: 'Form',
        handler: () => submitForm(),
        enabled: isFormValid, // Only enabled when form is valid
    },
];
```

### Manual Trigger

```typescript
const { triggerShortcut } = useKeyboardShortcuts(shortcuts);

// Programmatically trigger a shortcut
const handleButtonClick = () => {
    triggerShortcut('Enter');
};
```

## Migration Guide

To migrate from the old search keyboard hook:

1. **Gradual Migration**: Use the migration flag approach shown in `useSearchKeyboardMigration.ts`
2. **Update Components**: Replace old hook imports with new ones
3. **Add New Shortcuts**: Use the central configuration system
4. **Remove Old Code**: Once migration is complete, remove old implementations

## Best Practices

1. **Use Descriptive Names**: Make shortcut purposes clear
2. **Group by Category**: Organize shortcuts logically
3. **Check Platform**: Use `metaKey` for cross-platform Cmd/Ctrl
4. **Document Everything**: Include clear descriptions
5. **Test Thoroughly**: Ensure shortcuts don't conflict
6. **Provide Visual Cues**: Show shortcuts in UI tooltips/menus

## Current Shortcuts

| Shortcut | Description | Category | Used In |
|----------|-------------|----------|---------|
| ⌘+K | Focus search input | Navigation | MetatextDetailPage |
| Escape | Clear search or escape | Navigation | MetatextDetailPage |
| ⌘+D | Toggle theme | Interface | (Available globally) |
| ⌘+→ | Next page | Navigation | MetatextDetailPage |
| ⌘+← | Previous page | Navigation | MetatextDetailPage |
| ⌘+R | Go to review mode | Navigation | MetatextDetailPage |
| ↑ | Navigate to previous chunk | Chunks | (Available for implementation) |
| ↓ | Navigate to next chunk | Chunks | (Available for implementation) |
| ⌘+B | Bookmark current chunk | Chunks | (Available for implementation) |

## File Structure

```
src/
├── utils/
│   └── keyboardShortcuts.ts      # Central configuration
├── hooks/
│   └── useKeyboardShortcuts.ts   # General hook
├── components/
│   └── KeyboardShortcutsDisplay.tsx  # Display component
└── features/
    └── [feature]/
        └── hooks/
            └── use[Feature]Keyboard.ts  # Feature-specific hooks
```

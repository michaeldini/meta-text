/** 
 * Central keyboard shortcuts configuration and utilities.
 * This serves as the source of truth for all keyboard shortcuts in the application.
 * Add new shortcuts to the appropriate category.
 */

export interface KeyboardShortcut {
    key: string;
    metaKey?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    description: string;
    category: string;
}

export interface ShortcutAction extends KeyboardShortcut {
    handler: (event: KeyboardEvent) => void;
    enabled?: boolean;
}

// Global shortcuts that work across the entire app
export const GLOBAL_SHORTCUTS: Record<string, KeyboardShortcut> = {
    FOCUS_SEARCH: {
        key: 'k',
        metaKey: true,
        description: 'Focus search input',
        category: 'Navigation',
    },
    CLEAR_SEARCH: {
        key: 'Escape',
        description: 'Clear search or escape current focus',
        category: 'Navigation',
    },
    TOGGLE_THEME: {
        key: 'u',
        metaKey: true,
        description: 'Toggle dark/light theme',
        category: 'Interface',
    },
} as const;

// Feature-specific shortcuts
// TODO: NOT ACTIVATED YET
export const CHUNK_SHORTCUTS: Record<string, KeyboardShortcut> = {
    NEXT_CHUNK: {
        key: 'ArrowDown',
        description: 'Navigate to next chunk',
        category: 'Chunks',
    },
    PREV_CHUNK: {
        key: 'ArrowUp',
        description: 'Navigate to previous chunk',
        category: 'Chunks',
    },
    BOOKMARK_CHUNK: {
        key: 'b',
        metaKey: true,
        description: 'Bookmark current chunk',
        category: 'Chunks',
    },
} as const;

export const NAVIGATION_SHORTCUTS: Record<string, KeyboardShortcut> = {
    NEXT_PAGE: {
        key: 'ArrowRight',
        metaKey: true,
        description: 'Next page',
        category: 'Navigation',
    },
    PREV_PAGE: {
        key: 'ArrowLeft',
        metaKey: true,
        description: 'Previous page',
        category: 'Navigation',
    },
    GOTO_REVIEW: {
        key: 'i',
        metaKey: true,
        description: 'Go to review mode',
        category: 'Navigation',
    },
} as const;

// Utility to check if a keyboard event matches a shortcut
export const matchesShortcut = (event: KeyboardEvent, shortcut: KeyboardShortcut): boolean => {
    const keyMatches = event.key === shortcut.key;
    const metaMatches = (shortcut.metaKey ?? false) === (event.metaKey || event.ctrlKey);
    const ctrlMatches = (shortcut.ctrlKey ?? false) === event.ctrlKey;
    const shiftMatches = (shortcut.shiftKey ?? false) === event.shiftKey;
    const altMatches = (shortcut.altKey ?? false) === event.altKey;

    return keyMatches && metaMatches && ctrlMatches && shiftMatches && altMatches;
};

// Format shortcut for display
export const formatShortcut = (shortcut: KeyboardShortcut): string => {
    const parts: string[] = [];

    if (shortcut.metaKey) {
        parts.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
    }
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.shiftKey) parts.push('⇧');
    if (shortcut.altKey) parts.push(navigator.platform.includes('Mac') ? '⌥' : 'Alt');

    parts.push(shortcut.key.toUpperCase());

    return parts.join('+');
};

// Get all shortcuts grouped by category
export const getShortcutsByCategory = (): Record<string, KeyboardShortcut[]> => {
    const allShortcuts = { ...GLOBAL_SHORTCUTS, ...CHUNK_SHORTCUTS, ...NAVIGATION_SHORTCUTS };

    return Object.values(allShortcuts).reduce((acc, shortcut) => {
        if (!acc[shortcut.category]) {
            acc[shortcut.category] = [];
        }
        acc[shortcut.category].push(shortcut);
        return acc;
    }, {} as Record<string, KeyboardShortcut[]>);
};

/**
 * michaeldini: create a list of what keys are safe in most browsers to assign for metakey + key keyboard shortcuts?

GitHub Copilot: I’ll compile a concise, practical list of Meta/Cmd + key combos that are generally safe across major browsers, plus ones to avoid or use with caution.

Checklist
- List keys that are broadly safe for Meta/Cmd + key
- Call out keys to avoid (reserved)
- Note “caution” keys and implementation tips

Generally safe (Meta/Cmd + key)
- K
- .
- /
- ;
- '
- \
- = (only if you also preventDefault and don’t rely on zoom; see caution note)
- Backslash-adjacent symbols that aren’t locale-shifted (verify on your target keyboard layouts)

Use with caution (may conflict in some browsers/contexts)
- B (bold in editable fields)
- I (italic in editable fields; Safari/Firefox also have find/email variants)
- U (underline in editable fields; some browsers use for View Source with extra modifiers)
- D (bookmark page in Chrome/Edge)
- E (use selection for find in Safari/Firefox)
- G (find next)
- J (downloads in Chrome)
- Y (history/redo in some browsers)
- , (preferences on macOS apps; often Cmd+,)
- Arrow keys (Cmd+Left/Right = word/line nav on macOS)

Avoid (reserved almost everywhere)
- A, C, V, X, Z, S, P, W, Q, T, N, O, L, R
- 0, +, - (zoom)
- 1–9 (tab switching/selection)
- [, ] (back/forward)
- ` (window cycling on macOS)
- H (hide app), M (minimize)
- Space (Spotlight on macOS with Cmd+Space)

Implementation tips
- Prefer “mod” semantics (Cmd on macOS, Ctrl elsewhere); avoid using the Windows key.
- Always call preventDefault() and stopPropagation() for your handled keys.
- Don’t trigger shortcuts when focus is in input/textarea/contentEditable.
- Offer alternate combos (e.g., Meta+Shift+Key) if you need more headroom.
 */
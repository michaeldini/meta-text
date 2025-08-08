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

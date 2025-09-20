export interface KeyboardShortcut {
    key: string; // Hotkey format: 'cmd+k', 'alt+1', 'escape', etc.
    description: string;
}

export interface ShortcutAction extends KeyboardShortcut {
    handler: (event: KeyboardEvent) => void;
    enabled?: boolean;
}

// Consolidated shortcuts registry (single source of truth)
export const SHORTCUTS = {
    // Global
    FOCUS_SEARCH: { key: 'cmd+k', description: 'Focus search input' },
    CLEAR_SEARCH: { key: 'escape', description: 'Clear search or escape current focus' },
    TOGGLE_HELP: { key: 'alt+h', description: 'Toggle help panel' },

    // Navigation
    NEXT_PAGE: { key: 'alt+right', description: 'Next page' },
    PREV_PAGE: { key: 'alt+left', description: 'Previous page' },
    GOTO_REVIEW: { key: 'alt+i', description: 'Go to review mode' },

    // Chunk tool toggles
    NOTE_SUMMARY: { key: 'alt+1', description: 'Toggle Notes & Summary tool' },
    EVALUATION: { key: 'alt+2', description: 'Toggle Evaluation tool' },
    IMAGE: { key: 'alt+3', description: 'Toggle Image tool' },
    REWRITE: { key: 'alt+4', description: 'Toggle Rewrite tool' },
    EXPLANATION: { key: 'alt+5', description: 'Toggle Explanation tool' },
} as const;

// Backwards-compatible named exports for commonly-used groups (map to SHORTCUTS)
export const GLOBAL_SHORTCUTS = {
    FOCUS_SEARCH: SHORTCUTS.FOCUS_SEARCH,
    CLEAR_SEARCH: SHORTCUTS.CLEAR_SEARCH,
    TOGGLE_HELP: SHORTCUTS.TOGGLE_HELP,
} as const;

export const NAVIGATION_SHORTCUTS = {
    NEXT_PAGE: SHORTCUTS.NEXT_PAGE,
    PREV_PAGE: SHORTCUTS.PREV_PAGE,
    GOTO_REVIEW: SHORTCUTS.GOTO_REVIEW,
} as const;


export const CHUNK_TOOL_SHORTCUTS = {
    NOTE_SUMMARY: SHORTCUTS.NOTE_SUMMARY,
    EVALUATION: SHORTCUTS.EVALUATION,
    IMAGE: SHORTCUTS.IMAGE,
    REWRITE: SHORTCUTS.REWRITE,
    EXPLANATION: SHORTCUTS.EXPLANATION,
} as const;

/**
 * Parse a hotkey string into its component parts
 * @param hotkeyString - String like 'cmd+k', 'alt+1', 'shift+escape'
 * @returns Object with modifier flags and the main key
 */
function parseHotkey(hotkeyString: string) {
    const parts = hotkeyString.toLowerCase().split('+');
    const key = parts[parts.length - 1]; // Last part is always the main key
    const modifiers = parts.slice(0, -1); // All parts except the last

    return {
        key,
        metaKey: modifiers.includes('cmd') || modifiers.includes('meta'),
        ctrlKey: modifiers.includes('ctrl'),
        shiftKey: modifiers.includes('shift'),
        altKey: modifiers.includes('alt'),
    };
}

/**
 * Utility to check if a keyboard event matches a shortcut
 *
 * @example
 * matchesShortcut(event, GLOBAL_SHORTCUTS.FOCUS_SEARCH);
 * 
 * @param event - The keyboard event to check
 * @param shortcut - The shortcut to match against
 * @returns True if the event matches the shortcut, false otherwise
 */
export const matchesShortcut = (event: KeyboardEvent, shortcut: KeyboardShortcut): boolean => {
    const parsed = parseHotkey(shortcut.key);

    const keyMatches = event.key.toLowerCase() === parsed.key;
    const metaMatches = parsed.metaKey === (event.metaKey || event.ctrlKey);
    const ctrlMatches = parsed.ctrlKey === event.ctrlKey;
    const shiftMatches = parsed.shiftKey === event.shiftKey;
    const altMatches = parsed.altKey === event.altKey;

    return keyMatches && metaMatches && ctrlMatches && shiftMatches && altMatches;
};

/**
 * Formats a keyboard shortcut for display
 * Parses the hotkey format and converts to display-friendly symbols
 *
 * @example
 * formatShortcut({ key: 'cmd+k' });
 * // Returns "⌘+K" on macOS, "Ctrl+K" on Windows/Linux
 *
 * @param shortcut - The keyboard shortcut to format
 * @returns A string representation of the shortcut for display
 */
export const formatShortcut = (shortcut: KeyboardShortcut): string => {
    const parsed = parseHotkey(shortcut.key);
    const parts: string[] = [];

    if (parsed.metaKey) {
        parts.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
    }
    if (parsed.ctrlKey) parts.push('Ctrl');
    if (parsed.shiftKey) parts.push('⇧');
    if (parsed.altKey) parts.push(navigator.platform.includes('Mac') ? '⌥' : 'Alt');

    // Capitalize and format the key for display
    let displayKey = parsed.key;
    if (displayKey === 'escape') displayKey = 'Esc';
    else if (displayKey === 'left') displayKey = '←';
    else if (displayKey === 'right') displayKey = '→';
    else if (displayKey === 'up') displayKey = '↑';
    else if (displayKey === 'down') displayKey = '↓';
    else displayKey = displayKey.toUpperCase();

    parts.push(displayKey);

    return parts.join('+');
};

// Get all shortcuts grouped by a single category (backwards-compatible for UI)
export function getShortcutsByCategory(): Record<string, KeyboardShortcut[]> {
    // For simplicity we place all shortcuts under one 'General' category.
    const allShortcuts: KeyboardShortcut[] = Object.values(SHORTCUTS) as KeyboardShortcut[];
    return {
        General: allShortcuts,
    };
}
;
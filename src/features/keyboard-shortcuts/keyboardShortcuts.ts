/**
 * Centralized keyboard shortcuts definitions and types.
 * This file serves as the single source of truth for all keyboard shortcuts used in the app.
 * Each shortcut includes its key combination and a brief description.
 * 
 * USAGE:
 * - Import the SHORTCUTS constant and useHotkeys hook to bind shortcuts in components. Only need the .key value for useHotkeys.
 * - Use the description for displaying in help menus or tooltips.
 * 
 * EXAMPLE:
 * import { SHORTCUTS } from '@utils/keyboardShortcuts';
 * useHotkeys(SHORTCUTS.NEXT_PAGE.key, goToNextPage);
 * 
 * This ensures consistency across the app and makes it easy to update shortcuts in one place.
 * 
 */


/**
 * Represents a keyboard shortcut.
 * - key: The key combination (e.g., 'ctrl+k', 'alt+1').
 * - description: A brief description of what the shortcut does.
 * 
 * The key should be a valid Hotkey format as per the useHotkeys library.
 * The description is helpful for displaying in help menus or tooltips.
 */
export interface KeyboardShortcut {
    key: string; // Hotkey format: 'cmd+k', 'alt+1', 'escape', etc.
    description: string;
}

/**
 * Defines all keyboard shortcuts used in the application.
 * Each shortcut includes a key combination and a description.
 * 
 * This object serves as the single source of truth for keyboard shortcuts,
 * ensuring consistency across the app and simplifying updates.
 * Example usage:
 * - useHotkeys(SHORTCUTS.NEXT_PAGE.key, goToNextPage);
 * - Display SHORTCUTS.NEXT_PAGE.description in a help menu.
 */
export const SHORTCUTS = {
    FOCUS_SEARCH: { key: 'ctrl+k', description: 'Focus search input' },
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
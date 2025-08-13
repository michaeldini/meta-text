/**
 * Keyboard Shortcuts Registry & Utilities
 * =======================================
 * Source of truth for ALL keyboard shortcuts used across the application.
 * keyboardShortcuts.ts is a registry (definitions + helpers), 
 * while files like useMetatextDetailKeyboard.ts,
 * perform the actual “listening” (binding handlers to events).
 * Each shortcut is a lightweight descriptor object consumed by UI components
 * (e.g., `KeyboardShortcutsDisplay`) and by any runtime keybinding logic.
 *
 * Why centralize?
 *  - Ensures consistent display formatting & categorization
 *  - Enables automatic grouping in help drawers / docs
 *  - Provides a single review surface for conflicts & reserved keys
 *
 * Data Model
 * ----------
 * interface KeyboardShortcut {
 *   key: string;              // Actual KeyboardEvent.key (case-sensitive for non-letters)
 *   metaKey?: boolean;        // Cmd (macOS) / also matches Ctrl for convenience in formatter
 *   ctrlKey?: boolean;        // Explicit Ctrl requirement (rare if metaKey already set)
 *   shiftKey?: boolean;
 *   altKey?: boolean;
 *   description: string;      // Human-readable action label
 *   category: string;         // Group label (used for display sections)
 * }
 *
 * ADDING A NEW SHORTCUT
 * ---------------------
 * 1. Identify the logical group (category). If none fits, create a new category
 *    name (Capitalized, singular/plural as appropriate). Keep names concise.
 * 2. Choose a safe key combination (see "Key Selection Guidance" below).
 * 3. Add an entry to one of the exported records (GLOBAL_SHORTCUTS, CHUNK_SHORTCUTS,
 *    NAVIGATION_SHORTCUTS, or create a new record if the feature domain is distinct).
 * 4. If the shortcut triggers behavior immediately, bind it where appropriate
 *    (e.g., in a React effect or a top-level listener) using `matchesShortcut`.
 * 5. The UI (help drawer) will automatically pick it up—no component changes needed.
 * 6. Update any user-facing documentation if required.
 *
 * Example:
 *   // Add inside GLOBAL_SHORTCUTS
 *   OPEN_SETTINGS: {
 *     key: ',',
 *     metaKey: true,
 *     description: 'Open settings panel',
 *     category: 'Interface'
 *   }
 *
 * KEY SELECTION GUIDANCE
 * ----------------------
 * Prefer using `Meta/Cmd` (macOS) or `Ctrl` (Windows/Linux) in combinations to avoid
 * accidental text input disruption. The `formatShortcut` helper normalizes display.
 *
 * Generally SAFE (Meta/Ctrl + ...): K, /, ., ;, ', \\, ArrowUp/Down (domain-specific),
 *                                  U (if not already used), G (contextual), E (contextual)
 * Use WITH CAUTION: B, I, U (formatting in editable fields), D (bookmark), J (downloads),
 *                   Y (redo/history), , (preferences expectation on macOS)
 * AVOID / RESERVED (broad browser or OS semantics):
 *   A, C, V, X, Z, S, P, W, Q, T, N, O, L, R
 *   0,+,- (zoom), 1–9 (tab switching), [, ] (nav), ` (window cycle), H (hide), M (minimize),
 *   Space (Cmd+Space / Spotlight macOS)
 *
 * DESIGN PRINCIPLES
 * -----------------
 *  - Make shortcuts additive: don’t shadow essential browser behaviors.
 *  - Avoid using only a plain letter without modifiers unless action is benign & local.
 *  - Keep descriptions task-focused (imperative: "Focus search input", not "Search focus").
 *
 * RUNTIME MATCHING
 * ----------------
 * Use `matchesShortcut(event, shortcut)` to test KeyboardEvents against a shortcut object.
 * Wrap logic with guards to skip when focus is inside editable elements (inputs / textareas / contentEditable).
 *
 * DISPLAY / HELP INTEGRATION
 * --------------------------
 * The `getShortcutsByCategory()` helper aggregates all records and groups them—UI layers simply
 * iterate over the grouped result. Categories with no entries are skipped automatically.
 *
 * TESTING TIPS
 * ------------
 *  - Snapshot test `getShortcutsByCategory()` grouping for stability.
 *  - Simulate KeyboardEvents and assert `matchesShortcut` returns true/false as expected.
 *  - If adding a new category, confirm it appears in the drawer UI.
 *
 * EXTENDING
 * ---------
 *  - Add a new feature domain: create a NEW_<FEATURE>_SHORTCUTS constant and spread it into
 *    the aggregator inside `getShortcutsByCategory`.
 *  - Add dynamic enabling/disabling: extend `ShortcutAction` + supply runtime `enabled` flags.
 *
 * NOTE ON PLATFORM META LOGIC
 * ---------------------------
 * Currently `formatShortcut` treats `metaKey` as Cmd (Mac) vs Ctrl (others). For advanced cases
 * (e.g., explicit separate bindings), introduce parallel descriptors or a platform abstraction layer.
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
        metaKey: false,
        description: 'Toggle dark/light theme',
        category: 'Interface',
    },
    TOGGLE_HELP: {
        key: 'h',
        metaKey: false,
        shiftKey: false,
        description: 'Toggle help panel',
        category: 'Interface',
    }
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

// Chunk tool panel toggle shortcuts (registered centrally – page hooks attach handlers)
// These intentionally use Ctrl+Shift (and Meta for mac) with number/symbol pairs to avoid
// collisions with global browser actions. Symbols are emitted on some layouts when Shift is held.
export const CHUNK_TOOL_SHORTCUTS: Record<string, KeyboardShortcut[]> = {
    NOTE_SUMMARY: [
        { key: '!', metaKey: true, ctrlKey: true, shiftKey: true, description: 'Toggle Notes & Summary tool', category: 'Chunk Tools' },
        { key: '1', metaKey: true, ctrlKey: true, shiftKey: true, description: 'Toggle Notes & Summary tool', category: 'Chunk Tools' },
    ],
    EVALUATION: [
        { key: '@', metaKey: true, ctrlKey: true, shiftKey: true, description: 'Toggle Evaluation tool', category: 'Chunk Tools' },
        { key: '2', metaKey: true, ctrlKey: true, shiftKey: true, description: 'Toggle Evaluation tool', category: 'Chunk Tools' },
    ],
    IMAGE: [
        { key: '#', metaKey: true, ctrlKey: true, shiftKey: true, description: 'Toggle Image tool', category: 'Chunk Tools' },
        { key: '3', metaKey: true, ctrlKey: true, shiftKey: true, description: 'Toggle Image tool', category: 'Chunk Tools' },
    ],
    REWRITE: [
        { key: '$', metaKey: true, ctrlKey: true, shiftKey: true, description: 'Toggle Rewrite tool', category: 'Chunk Tools' },
        { key: '4', metaKey: true, ctrlKey: true, shiftKey: true, description: 'Toggle Rewrite tool', category: 'Chunk Tools' },
    ],
    EXPLANATION: [
        { key: '%', metaKey: true, ctrlKey: true, shiftKey: true, description: 'Toggle Explanation tool', category: 'Chunk Tools' },
        { key: '5', metaKey: true, ctrlKey: true, shiftKey: true, description: 'Toggle Explanation tool', category: 'Chunk Tools' },
    ],
} as const;

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
export function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    const keyMatches = event.key === shortcut.key;
    const metaMatches = (shortcut.metaKey ?? false) === (event.metaKey || event.ctrlKey);
    const ctrlMatches = (shortcut.ctrlKey ?? false) === event.ctrlKey;
    const shiftMatches = (shortcut.shiftKey ?? false) === event.shiftKey;
    const altMatches = (shortcut.altKey ?? false) === event.altKey;

    return keyMatches && metaMatches && ctrlMatches && shiftMatches && altMatches;
};

/**
 * Formats a keyboard shortcut for display
 *
 * @example
 * formatShortcut({ key: 'k', metaKey: true });
 * // Returns "⌘+K" on macOS, "Ctrl+K" on Windows/Linux
 *
 * @param shortcut - The keyboard shortcut to format
 * @returns A string representation of the shortcut
 */
export default function formatShortcut(shortcut: KeyboardShortcut): string {
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
export function getShortcutsByCategory(): Record<string, KeyboardShortcut[]> {
    const flatChunkToolShortcuts = Object.values(CHUNK_TOOL_SHORTCUTS).flat();
    const allShortcuts: KeyboardShortcut[] = [
        ...Object.values(GLOBAL_SHORTCUTS),
        ...Object.values(CHUNK_SHORTCUTS),
        ...Object.values(NAVIGATION_SHORTCUTS),
        ...flatChunkToolShortcuts,
    ];
    return allShortcuts.reduce((acc, shortcut) => {
        (acc[shortcut.category] ||= []).push(shortcut);
        return acc;
    }, {} as Record<string, KeyboardShortcut[]>);
};
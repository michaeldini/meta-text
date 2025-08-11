
import { useEffect, useCallback, useRef } from 'react';
import { matchesShortcut, type ShortcutAction } from '@utils/keyboardShortcuts';

export interface UseKeyboardShortcutsOptions {
    enabled?: boolean;
    preventDefault?: boolean;
    stopPropagation?: boolean;
    element?: HTMLElement | Window;
}

/**
 * Hook for registering and handling keyboard shortcuts
 * @param shortcuts Array of shortcut actions to register
 * @param options Configuration options
 */
export const useKeyboardShortcuts = (
    shortcuts: ShortcutAction[],
    options: UseKeyboardShortcutsOptions = {}
) => {
    const {
        enabled = true,
        preventDefault = true,
        stopPropagation = false,
        element = window
    } = options;

    // Use ref to avoid recreating the handler on every render
    const shortcutsRef = useRef(shortcuts);
    shortcutsRef.current = shortcuts;

    const handleKeyDown = useCallback((event: Event) => {
        if (!enabled) return;

        const keyboardEvent = event as KeyboardEvent;
        const activeShortcuts = shortcutsRef.current.filter(shortcut =>
            shortcut.enabled !== false
        );

        for (const shortcut of activeShortcuts) {
            if (matchesShortcut(keyboardEvent, shortcut)) {
                if (preventDefault) {
                    keyboardEvent.preventDefault();
                }
                if (stopPropagation) {
                    keyboardEvent.stopPropagation();
                }

                shortcut.handler(keyboardEvent);
                break; // Only handle the first matching shortcut
            }
        }
    }, [enabled, preventDefault, stopPropagation]);

    useEffect(() => {
        if (!enabled || !element) return;

        const target = element as EventTarget;
        target.addEventListener('keydown', handleKeyDown);

        return () => {
            target.removeEventListener('keydown', handleKeyDown);
        };
    }, [enabled, element, handleKeyDown]);

    return {
        // Utility to manually trigger a shortcut by key
        triggerShortcut: (key: string) => {
            const shortcut = shortcutsRef.current.find(s => s.key === key);
            if (shortcut && shortcut.enabled !== false) {
                const mockEvent = new KeyboardEvent('keydown', {
                    key: shortcut.key,
                    metaKey: shortcut.metaKey,
                    ctrlKey: shortcut.ctrlKey,
                    shiftKey: shortcut.shiftKey,
                    altKey: shortcut.altKey,
                });
                shortcut.handler(mockEvent);
            }
        }
    };
};

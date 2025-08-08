/** TODO: NOT HOOKED UP TO ANYTHING
 * Example of how to extend the keyboard shortcuts system for chunk navigation.
 * This demonstrates the pattern for feature-specific keyboard shortcuts.
 */
import { useCallback } from 'react';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import { CHUNK_SHORTCUTS, type ShortcutAction } from '../../../utils/keyboardShortcuts';

interface UseChunkKeyboardOptions {
    enabled?: boolean;
    onNextChunk?: () => void;
    onPrevChunk?: () => void;
    onBookmarkChunk?: () => void;
}

/**
 * Hook that provides chunk navigation keyboard shortcuts
 * Example usage:
 * 
 * const { triggerNext, triggerPrev } = useChunkKeyboard({
 *   onNextChunk: () => setCurrentIndex(i => i + 1),
 *   onPrevChunk: () => setCurrentIndex(i => Math.max(0, i - 1)),
 *   onBookmarkChunk: () => toggleBookmark(currentChunk.id),
 * });
 */
export const useChunkKeyboard = ({
    enabled = true,
    onNextChunk,
    onPrevChunk,
    onBookmarkChunk
}: UseChunkKeyboardOptions = {}) => {

    const handleNext = useCallback(() => {
        onNextChunk?.();
    }, [onNextChunk]);

    const handlePrev = useCallback(() => {
        onPrevChunk?.();
    }, [onPrevChunk]);

    const handleBookmark = useCallback(() => {
        onBookmarkChunk?.();
    }, [onBookmarkChunk]);

    // Define the chunk-specific shortcuts
    const shortcuts: ShortcutAction[] = [
        {
            ...CHUNK_SHORTCUTS.NEXT_CHUNK,
            handler: handleNext,
            enabled: enabled && !!onNextChunk,
        },
        {
            ...CHUNK_SHORTCUTS.PREV_CHUNK,
            handler: handlePrev,
            enabled: enabled && !!onPrevChunk,
        },
        {
            ...CHUNK_SHORTCUTS.BOOKMARK_CHUNK,
            handler: handleBookmark,
            enabled: enabled && !!onBookmarkChunk,
        },
    ];

    // Use the general keyboard shortcuts hook
    const { triggerShortcut } = useKeyboardShortcuts(shortcuts, {
        enabled,
        preventDefault: true,
    });

    return {
        // Expose manual trigger functions
        triggerNext: handleNext,
        triggerPrev: handlePrev,
        triggerBookmark: handleBookmark,
        triggerShortcut,
    };
};

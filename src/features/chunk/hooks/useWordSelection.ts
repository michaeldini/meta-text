// Mostly Ai-generated code
// Main feature of the app is to allow users to select words in a chunk and perform actions on them

import { useState, useCallback } from 'react';

/**
 * useWordSelection - Custom hook for managing word selection and dialog anchor logic in a chunk
 * Handles mouse/touch selection, highlighted indices, and dialog anchor state
 */
export function useWordSelection(chunkIdx: number) {
    const [selectionStartIdx, setSelectionStartIdx] = useState<number | null>(null);
    const [selectionEndIdx, setSelectionEndIdx] = useState<number | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);

    // Helper: get min/max for range
    const getRange = useCallback(() => {
        if (selectionStartIdx === null || selectionEndIdx === null) return [];
        const [start, end] = [selectionStartIdx, selectionEndIdx].sort((a, b) => a - b);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [selectionStartIdx, selectionEndIdx]);

    const highlightedIndices = getRange();

    const handleWordDown = useCallback((idx: number, _event?: React.PointerEvent<HTMLElement>) => {
        void _event;
        setSelectionStartIdx(idx);
        setSelectionEndIdx(idx);
        setIsSelecting(true);
        // Do NOT set dialog anchor here
    }, []);

    const handleWordEnter = useCallback((idx: number, _event?: React.PointerEvent<HTMLElement>) => {
        void _event;

        if (isSelecting) {
            setSelectionEndIdx(idx);
            // Do NOT set dialog anchor here
        }
    }, [isSelecting]);

    const handleWordUp = useCallback(() => {
        setIsSelecting(false);
        if (selectionStartIdx !== null && selectionEndIdx !== null) {
            // Range selection completed. Parent can derive the last index from
            // selectionStartIdx/selectionEndIdx or from `highlightedIndices`.
        }
        // else: range is highlighted, show toolbar (handled in render)
    }, [selectionStartIdx, selectionEndIdx]);

    // Clear selection. Parent handles dialogs/toolbars.
    const clearSelection = useCallback(() => {
        setIsSelecting(false);
        setSelectionStartIdx(null);
        setSelectionEndIdx(null);
    }, []);

    // Note: DOM pointer-to-index resolution lives in the parent. The hook
    // exposes index-based handlers only.

    return {
        selectionStartIdx,
        selectionEndIdx,
        isSelecting,
        highlightedIndices,
        handleWordDown,
        handleWordEnter,
        handleWordUp,
        clearSelection,
    };
}

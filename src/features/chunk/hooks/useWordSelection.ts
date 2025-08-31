import { useState, useCallback, useMemo } from 'react';

/**
 * useWordSelection - Custom hook for managing word selection
 * Handles mouse/touch selection and highlighted indices
 */
export function useWordSelection() {
    // Single selection object reduces state management and re-renders.
    // When `selection` is null => no selection. While selecting, `end` is
    // updated and `isSelecting` is true. After pointer-up, `isSelecting`
    // becomes false but `selection` is preserved until cleared by parent.
    const [selection, setSelection] = useState<{
        start: number;
        end: number | null;
        isSelecting: boolean;
    } | null>(null);

    // Memoize highlighted indices to avoid creating a new array every render.
    const highlightedIndices = useMemo(() => {
        if (!selection || selection.end === null) return [] as number[];
        const [start, end] = [selection.start, selection.end].sort((a, b) => a - b);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [selection]);

    const handleWordDown = useCallback((idx: number) => {
        setSelection({ start: idx, end: idx, isSelecting: true });
    }, []);

    const handleWordEnter = useCallback((idx: number) => {
        setSelection(prev => {
            if (!prev || !prev.isSelecting) return prev;
            // Update end while preserving start/isSelecting
            return { ...prev, end: idx };
        });
    }, []);

    const handleWordUp = useCallback(() => {
        setSelection(prev => (prev ? { ...prev, isSelecting: false } : prev));
    }, []);

    const clearSelection = useCallback(() => {
        setSelection(null);
    }, []);

    // Keep the same outward-facing fields for compatibility.
    return {
        selectionStartIdx: selection?.start ?? null,
        selectionEndIdx: selection?.end ?? null,
        isSelecting: selection?.isSelecting ?? false,
        highlightedIndices,
        handleWordDown,
        handleWordEnter,
        handleWordUp,
        clearSelection,
    };
}

import { useState, useCallback, useMemo } from 'react';
import { ChunkType } from '@mtypes/documents';
/**
 * useWordSelection - Custom hook for managing word selection
 * Handles mouse/touch selection and highlighted indices
 */
// Accept an optional chunk object with a `text` field so the hook can
// compute and expose the words array. Default to undefined so existing
// callers without a chunk won't break.
export function useWordSelection(chunk: ChunkType) {
    // Single selection object reduces state management and re-renders.
    // When `selection` is null => no selection. While selecting, `end` is
    // updated and `isSelecting` is true. After pointer-up, `isSelecting`
    // becomes false but `selection` is preserved until cleared by parent.
    const [selection, setSelection] = useState<{
        start: number;
        end: number | null;
        isSelecting: boolean;
    } | null>(null);

    // Memoize the words from the chunk so callers can consume them and so
    // the selection logic can reference a stable words array.
    const words = useMemo(() => {
        return chunk && chunk.text ? chunk.text.split(/\s+/) : [] as string[];
    }, [chunk?.text]);

    // Memoize highlighted indices to avoid creating a new array every render.
    // Depend only on start/end so toggling `isSelecting` doesn't force recompute.
    const selectedWordIndices = useMemo(() => {
        const start = selection?.start;
        const end = selection?.end;
        if (start == null || end == null) return [] as number[];
        const from = Math.min(start, end);
        const to = Math.max(start, end);
        return Array.from({ length: to - from + 1 }, (_, i) => from + i);
    }, [selection?.start, selection?.end]);

    // Map selected indices to actual word strings, filtering out out-of-bounds values.
    const selectedWords = useMemo(() => {
        if (!words.length || !selectedWordIndices.length) return '' as string;
        return selectedWordIndices
            .map(i => words[i])
            .filter((w): w is string => typeof w === 'string')
            .join(' ');
    }, [selectedWordIndices, words]);

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

    return {
        selectionStartIdx: selection?.start ?? null,
        selectionEndIdx: selection?.end ?? null,
        isSelecting: selection?.isSelecting ?? false,
        selectedWordIndices,
        words,
        selectedWords,
        handleWordDown,
        handleWordEnter,
        handleWordUp,
        clearSelection,
    };
}

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { ChunkType } from '@mtypes/documents';
import { trimPunctuation } from '@utils/trimPunctuation';

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
    }, [chunk]);

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

    // Final selected words string. We compute and store this once on pointer-up
    // so callers can treat a non-empty string as "selection complete".
    const [finalSelectedWords, setFinalSelectedWords] = useState<string>('');

    // Clear any finalized selection when the words (chunk text) change.
    useEffect(() => {
        setFinalSelectedWords('');
    }, [words]);

    const handleWordDown = useCallback((idx: number) => {
        // Starting a new selection clears any previously finalized selection
        setFinalSelectedWords('');
        setSelection({ start: idx, end: idx, isSelecting: true });
    }, []);

    // Raw enter handler that updates selection end.
    const rawHandleWordEnter = useCallback((idx: number) => {
        setSelection(prev => {
            if (!prev || !prev.isSelecting) return prev;
            // Update end while preserving start/isSelecting
            return { ...prev, end: idx };
        });
    }, []);

    // Throttle pointer-enter selection events to reduce overhead on dense word lists.
    // We keep this logic inside the hook because it's selection-related behavior
    // (pointer sampling) and belongs with the selection state management.
    const lastEnterTsRef = useRef(0);
    const THROTTLE_MS = 16; // ~60fps cap
    const handleWordEnter = useCallback((wordIdx: number) => {
        const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        if (now - lastEnterTsRef.current < THROTTLE_MS) return;
        lastEnterTsRef.current = now;
        rawHandleWordEnter(wordIdx);
    }, [rawHandleWordEnter]);

    const handleWordUp = useCallback(() => {
        // Finalize selected words when pointer is lifted. Use the functional
        // updater to read the most recent selection, and compute the final
        // string from the current `words` array.
        setSelection(prev => {
            if (!prev) return prev;
            const start = prev.start;
            const end = prev.end ?? prev.start;
            const from = Math.min(start, end);
            const to = Math.max(start, end);
            const joined = words.length ? words.slice(from, to + 1).join(' ') : '';
            setFinalSelectedWords(trimPunctuation(joined));
            return { ...prev, isSelecting: false };
        });
    }, [words]);

    const clearSelection = useCallback(() => {
        setSelection(null);
        setFinalSelectedWords('');
    }, []);

    return {
        words,
        selectedWordIndices,
        selectedWords: finalSelectedWords,
        handleWordDown,
        handleWordEnter,
        handleWordUp,
        clearSelection,
    };
}

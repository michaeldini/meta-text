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
    const [dialogAnchor, setDialogAnchor] = useState<HTMLElement | null>(null);
    const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Helper: get min/max for range
    const getRange = useCallback(() => {
        if (selectionStartIdx === null || selectionEndIdx === null) return [];
        const [start, end] = [selectionStartIdx, selectionEndIdx].sort((a, b) => a - b);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [selectionStartIdx, selectionEndIdx]);

    const highlightedIndices = getRange();

    const handleWordDown = useCallback((idx: number, _event?: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        void _event;
        setSelectionStartIdx(idx);
        setSelectionEndIdx(idx);
        setIsSelecting(true);
        // Do NOT set dialog anchor here
    }, []);

    const handleWordEnter = useCallback((idx: number, _event?: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        void _event;

        if (isSelecting) {
            setSelectionEndIdx(idx);
            // Do NOT set dialog anchor here
        }
    }, [isSelecting]);

    const handleWordUp = useCallback(() => {
        setIsSelecting(false);
        if (
            selectionStartIdx !== null &&
            selectionEndIdx !== null
        ) {
            // Find the last word in the selection
            const lastIdx = [selectionStartIdx, selectionEndIdx].sort((a, b) => a - b)[1];
            // Try to get the element for the last word in this chunk
            const el = document.querySelector(`[data-word-idx='${chunkIdx}-${lastIdx}']`);
            if (el) {
                setDialogAnchor(el as HTMLElement);
                // If single word, open dialog
                if (selectionStartIdx === selectionEndIdx) {
                    setSelectedWordIdx(selectionStartIdx);
                    setAnchorEl(el as HTMLElement);
                }
            }
        }
        // else: range is highlighted, show toolbar (handled in render)
    }, [selectionStartIdx, selectionEndIdx, chunkIdx]);

    const handleToolbarClose = useCallback(() => {
        setAnchorEl(null);
        setSelectedWordIdx(null);
        setSelectionStartIdx(null);
        setSelectionEndIdx(null);
        setDialogAnchor(null);
    }, []);

    // Handle touch move for mobile word selection
    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLElement>) => {
        const touch = e.touches[0];
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (el && (el as HTMLElement).dataset && (el as HTMLElement).dataset.wordIdx) {
            const idx = parseInt((el as HTMLElement).dataset.wordIdx!.split('-')[1], 10);
            if (!isNaN(idx)) handleWordEnter(idx, e);
        }
    }, [handleWordEnter]);

    return {
        selectionStartIdx,
        selectionEndIdx,
        isSelecting,
        dialogAnchor,
        selectedWordIdx,
        anchorEl,
        highlightedIndices,
        setAnchorEl,
        setSelectedWordIdx,
        handleWordDown,
        handleWordEnter,
        handleWordUp,
        handleToolbarClose,
        handleTouchMove,
    };
}

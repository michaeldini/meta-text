// useChunkWords.ts
// Custom hook for managing chunk word selection, highlighting, and drawer state for a chunk
// Used by ChunkWords component to encapsulate business logic
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useWordSelection } from '../hooks/useWordSelection';

export interface UseChunkWordsProps {
    chunkIdx: number;
    words: string[];
    handleToolbarClose: () => void;
}

export function useChunkWords({ chunkIdx, words, handleToolbarClose }: UseChunkWordsProps) {
    // Word selection logic
    const {
        selectedWordIdx,
        highlightedIndices,
        handleWordDown,
        handleWordEnter,
        handleWordUp,
        handleToolbarClose: handleToolbarCloseSelection,
        handleTouchMove,
    } = useWordSelection(chunkIdx);

    // Drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerSelection, setDrawerSelection] = useState<{ word: string; wordIdx: number }[] | null>(null);

    // Only open drawer on mouseup/touchend (selection finalized)
    const selectionFinalizedRef = useRef(false);
    useEffect(() => {
        if (selectionFinalizedRef.current && highlightedIndices.length > 0) {
            setDrawerSelection(highlightedIndices.map(i => ({ word: words[i], wordIdx: i })));
            setDrawerOpen(true);
            selectionFinalizedRef.current = false;
        }
    }, [highlightedIndices, words]);

    // Patch handleWordUp to set selectionFinalizedRef
    const handleWordUpPatched = useCallback(() => {
        selectionFinalizedRef.current = true;
        handleWordUp();
    }, [handleWordUp]);

    // Close drawer and clear selection
    const closeDrawer = useCallback(() => {
        setDrawerOpen(false);
        setDrawerSelection(null);
        handleToolbarClose();
    }, [handleToolbarClose]);

    // Hover highlight state
    const [hoveredWordIdx, setHoveredWordIdx] = useState<number | null>(null);

    // Clear highlight if clicking outside the container
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (highlightedIndices.length === 0) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(event.target as Node)) {
                handleToolbarClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [highlightedIndices.length, handleToolbarClose]);

    return {
        selectedWordIdx,
        highlightedIndices,
        handleWordDown,
        handleWordEnter,
        handleWordUp: handleWordUpPatched,
        handleToolbarClose: handleToolbarCloseSelection,
        handleTouchMove,
        drawerOpen,
        setDrawerOpen,
        drawerSelection,
        setDrawerSelection,
        closeDrawer,
        hoveredWordIdx,
        setHoveredWordIdx,
        containerRef,
    };
}

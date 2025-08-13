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
        highlightedIndices,
        handleWordDown,
        handleWordEnter,
        handleWordUp,
        handleToolbarClose: handleToolbarCloseSelection,
        handleTouchMove,
        // expose selection indices so we can compute selection synchronously on pointer up
        selectionStartIdx,
        selectionEndIdx,
    } = useWordSelection(chunkIdx);

    // Drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerSelection, setDrawerSelection] = useState<{ word: string; wordIdx: number }[] | null>(null);

    // Patch handleWordUp to compute and open drawer synchronously (removes one render-cycle delay)
    const handleWordUpPatched = useCallback(() => {
        // Current highlightedIndices already reflect final drag state prior to mouse up (since pointer enter updated end)
        const indices = highlightedIndices;
        if (indices.length > 0) {
            setDrawerSelection(indices.map(i => ({ word: words[i], wordIdx: i })));
            setDrawerOpen(true);
        }
        handleWordUp();
    }, [handleWordUp, highlightedIndices, words]);

    // Close drawer and clear selection
    const closeDrawer = useCallback(() => {
        setDrawerOpen(false);
        setDrawerSelection(null);
        handleToolbarClose();
    }, [handleToolbarClose]);

    // Hover highlight state removed from public API (CSS hover used instead)

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
        containerRef,
    };
}

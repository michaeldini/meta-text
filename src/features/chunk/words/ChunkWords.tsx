import React, { memo, useState, useMemo, useRef } from 'react';
import { Box, IconButton, Paper, useTheme } from '@mui/material';
import { MergeChunksTool } from '../../chunk/tools';
import WordActionDialog from './WordActionDialog';
import { getWordsStyles } from './Words.styles';
import { useUIPreferencesStore } from 'store';

export interface ChunkWordsProps {
    words: string[];
    chunkIdx: number;
    chunk?: { meta_text_id?: string | number;[key: string]: any };
}

/**
 * ChunkWords - Layout component for displaying words within a chunk
 * Uses the new tool system for word actions and chunk merging
 */
const ChunkWords = memo(function ChunkWords({
    words,
    chunkIdx,
    chunk
}: ChunkWordsProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null);
    const [selectionStartIdx, setSelectionStartIdx] = useState<number | null>(null);
    const [selectionEndIdx, setSelectionEndIdx] = useState<number | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const styles = useMemo(() => getWordsStyles(theme), [theme]);
    const textSizePx = useUIPreferencesStore(state => state.textSizePx);
    const fontFamily = useUIPreferencesStore(state => state.fontFamily);
    const lineHeight = useUIPreferencesStore(state => state.lineHeight);

    // Ref to the last selected word element
    const lastSelectedWordElRef = useRef<HTMLElement | null>(null);
    // Store the bounding rect for toolbar positioning
    const [toolbarPos, setToolbarPos] = useState<{ left: number; top: number } | null>(null);

    // Helper: get min/max for range
    const getRange = () => {
        if (selectionStartIdx === null || selectionEndIdx === null) return [];
        const [start, end] = [selectionStartIdx, selectionEndIdx].sort((a, b) => a - b);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };
    const highlightedIndices = getRange();

    const handleWordDialogOpen = (idx: number, event: React.MouseEvent<HTMLElement>) => {
        console.log('handleWordDialogOpen', { words, idx, word: words[idx] });
        setSelectedWordIdx(idx);
        setAnchorEl(event.currentTarget);
    };

    const handleDialogClose = () => {
        setAnchorEl(null);
        setSelectedWordIdx(null);
    };

    const handleMergeComplete = (success: boolean, result?: any) => {
        if (success) {
            console.log('Merge completed successfully:', result);
        }
    };

    // Update lastSelectedWordElRef and toolbar position on selection
    const handleWordDown = (idx: number, event?: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        setSelectionStartIdx(idx);
        setSelectionEndIdx(idx);
        setIsSelecting(true);
        if (event && event.target && (event.target as HTMLElement).tagName) {
            lastSelectedWordElRef.current = event.target as HTMLElement;
        }
    };
    const handleWordEnter = (idx: number, event?: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        if (isSelecting) {
            setSelectionEndIdx(idx);
            if (event && event.target && (event.target as HTMLElement).tagName) {
                lastSelectedWordElRef.current = event.target as HTMLElement;
            }
        }
    };
    const handleWordUp = () => {
        setIsSelecting(false);
        if (
            selectionStartIdx !== null &&
            selectionEndIdx !== null
        ) {
            // Find the last word in the selection
            const lastIdx = [selectionStartIdx, selectionEndIdx].sort((a, b) => a - b)[1];
            // Try to get the element for the last word
            const el = document.querySelector(`[data-word-idx='${lastIdx}']`);
            if (el) {
                lastSelectedWordElRef.current = el as HTMLElement;
                const rect = el.getBoundingClientRect();
                // Position relative to viewport, adjust for scroll
                setToolbarPos({
                    left: rect.left + window.scrollX,
                    top: rect.bottom + window.scrollY
                });
            }
        }
        if (
            selectionStartIdx !== null &&
            selectionEndIdx !== null &&
            selectionStartIdx === selectionEndIdx
        ) {
            // Single word: open dialog
            setSelectedWordIdx(selectionStartIdx);
            setAnchorEl(lastSelectedWordElRef.current);
        }
        // else: range is highlighted, show toolbar (handled in render)
    };
    const clearSelection = () => {
        setSelectionStartIdx(null);
        setSelectionEndIdx(null);
        setToolbarPos(null);
    };

    return (
        <Box>
            <Box ref={containerRef} sx={styles.wordsContainer}
                onMouseLeave={() => setIsSelecting(false)}
            >
                {words.map((word, wordIdx) => {
                    const isHighlighted = highlightedIndices.includes(wordIdx);
                    return (
                        <Box
                            key={wordIdx}
                            component="span"
                            sx={[
                                theme.typography.body2,
                                styles.chunkWordBox,
                                isHighlighted && {
                                    backgroundColor: theme.palette.secondary.main,
                                    color: theme.palette.primary.contrastText,
                                },
                                { fontSize: `${textSizePx}px`, fontFamily, lineHeight }
                            ]}
                            onMouseDown={e => handleWordDown(wordIdx, e)}
                            onMouseEnter={e => handleWordEnter(wordIdx, e)}
                            onMouseUp={handleWordUp}
                            onTouchStart={e => handleWordDown(wordIdx, e)}
                            onTouchMove={e => {
                                // Find word under touch
                                const touch = e.touches[0];
                                const el = document.elementFromPoint(touch.clientX, touch.clientY);
                                if (el && (el as HTMLElement).dataset && (el as HTMLElement).dataset.wordIdx) {
                                    const idx = parseInt((el as HTMLElement).dataset.wordIdx!, 10);
                                    if (!isNaN(idx)) handleWordEnter(idx, e);
                                }
                            }}
                            onTouchEnd={handleWordUp}
                            data-word-idx={wordIdx}
                        >
                            {word}
                        </Box>
                    );
                })}
                {/* Show merge tool after all words, inline with the text */}
                <Box component="span" sx={styles.chunkUndoIconButton}>
                    <MergeChunksTool
                        chunkIndices={[chunkIdx, chunkIdx + 1]}
                        chunks={chunk ? [chunk] : undefined}
                        onComplete={handleMergeComplete}
                    />
                </Box>
            </Box>

            {/* Floating toolbar for range actions */}
            {highlightedIndices.length > 1 && toolbarPos && (
                <Box sx={{
                    position: 'absolute',
                    left: toolbarPos.left,
                    top: toolbarPos.top,
                    zIndex: 10
                }}>
                    <WordActionDialog
                        anchorEl={lastSelectedWordElRef.current}
                        onClose={clearSelection}
                        word={highlightedIndices.map(i => words[i]).join(' ')}
                        wordIdx={highlightedIndices[0]}
                        chunkIdx={chunkIdx}
                        context={words.join(' ')}
                        metaTextId={chunk?.meta_text_id}
                        disableSplit
                    />
                </Box>
            )}

            <WordActionDialog
                anchorEl={anchorEl}
                onClose={handleDialogClose}
                word={selectedWordIdx !== null ? words[selectedWordIdx] : ''}
                wordIdx={selectedWordIdx || 0}
                chunkIdx={chunkIdx}
                context={words.join(' ')}
                metaTextId={chunk?.meta_text_id}
            />
        </Box>
    );
});

export default ChunkWords;

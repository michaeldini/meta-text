import React, { memo, useState, useMemo, useRef } from 'react';
import { Box, IconButton, Paper, useTheme } from '@mui/material';
import { MergeChunksTool } from '../../chunk/tools';
import WordsToolbar from './WordsToolbar';
import { getWordsStyles } from './Words.styles';
import { useUIPreferencesStore } from 'store';

export interface ChunkWordsProps {
    chunk: { text?: string; meta_text_id?: string | number;[key: string]: any };
    chunkIdx: number;
}

/**
 * ChunkWords - Layout component for displaying words within a chunk
 * Uses the new tool system for word actions and chunk merging
 */
const ChunkWords = memo(function ChunkWords({
    chunk,
    chunkIdx
}: ChunkWordsProps) {
    const words = chunk.text ? chunk.text.split(/\s+/) : [];
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
    // Unified dialog anchor state: element and position
    const [dialogAnchor, setDialogAnchor] = useState<HTMLElement | null>(null);

    // Helper: get min/max for range
    const getRange = () => {
        if (selectionStartIdx === null || selectionEndIdx === null) return [];
        const [start, end] = [selectionStartIdx, selectionEndIdx].sort((a, b) => a - b);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };
    const highlightedIndices = getRange();

    const handleToolbarClose = () => {
        setAnchorEl(null);
        setSelectedWordIdx(null);
        setSelectionStartIdx(null);
        setSelectionEndIdx(null);
        setDialogAnchor(null);
    };

    const handleMergeComplete = (success: boolean, result?: any) => {
        if (success) {
            // Merge completed successfully
        }
    };

    // Update lastSelectedWordElRef and toolbar position on selection
    const handleWordDown = (idx: number, event?: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        setSelectionStartIdx(idx);
        setSelectionEndIdx(idx);
        setIsSelecting(true);
        // Do NOT set dialog anchor here
    };
    const handleWordEnter = (idx: number, event?: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        if (isSelecting) {
            setSelectionEndIdx(idx);
            // Do NOT set dialog anchor here
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
    };


    return (
        <Box sx={{ minWidth: '50%' }}>
            < Box ref={containerRef} sx={styles.wordsContainer}
                onMouseLeave={() => setIsSelecting(false)}
            >
                {
                    words.map((word, wordIdx) => {
                        const isHighlighted = highlightedIndices.includes(wordIdx);
                        return (
                            <Box
                                key={wordIdx}
                                component="span"
                                sx={[
                                    // theme.typography.body2,
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
                                        const idx = parseInt((el as HTMLElement).dataset.wordIdx!.split('-')[1], 10);
                                        if (!isNaN(idx)) handleWordEnter(idx, e);
                                    }
                                }}
                                onTouchEnd={handleWordUp}
                                data-word-idx={`${chunkIdx}-${wordIdx}`}
                            >
                                {word}
                            </Box>
                        );
                    })
                }
                {/* Show merge tool after all words, inline with the text */}
                <Box component="span" sx={styles.chunkUndoIconButton}>
                    <MergeChunksTool
                        chunkIndices={[chunkIdx, chunkIdx + 1]}
                        chunks={chunk ? [chunk] : undefined}
                        onComplete={handleMergeComplete}
                    />
                </Box>
            </Box >

            {/* Only one WordActionDialog, handles both single and multi-word selection */}
            < WordsToolbar
                anchorEl={dialogAnchor}
                onClose={handleToolbarClose}
                word={highlightedIndices.length > 1 ? highlightedIndices.map(i => words[i]).join(' ') : (selectedWordIdx !== null ? words[selectedWordIdx] : '')}
                wordIdx={highlightedIndices.length > 1 ? highlightedIndices[0] : (selectedWordIdx || 0)}
                chunkIdx={chunkIdx}
                chunk={chunk}
            />
        </Box >
    );
});

export default ChunkWords;

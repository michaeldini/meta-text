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

    // Handlers for drag/touch selection
    const handleWordDown = (idx: number) => {
        setSelectionStartIdx(idx);
        setSelectionEndIdx(idx);
        setIsSelecting(true);
    };
    const handleWordEnter = (idx: number) => {
        if (isSelecting) setSelectionEndIdx(idx);
    };
    const handleWordUp = () => {
        setIsSelecting(false);
        if (
            selectionStartIdx !== null &&
            selectionEndIdx !== null &&
            selectionStartIdx === selectionEndIdx
        ) {
            // Single word: open dialog
            setSelectedWordIdx(selectionStartIdx);
            setAnchorEl(containerRef.current);
        }
        // else: range is highlighted, show toolbar (handled in render)
    };
    const clearSelection = () => {
        setSelectionStartIdx(null);
        setSelectionEndIdx(null);
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
                                { fontSize: `${textSizePx}px`, fontFamily }
                            ]}
                            onMouseDown={() => handleWordDown(wordIdx)}
                            onMouseEnter={() => handleWordEnter(wordIdx)}
                            onMouseUp={handleWordUp}
                            onTouchStart={() => handleWordDown(wordIdx)}
                            onTouchMove={e => {
                                // Find word under touch
                                const touch = e.touches[0];
                                const el = document.elementFromPoint(touch.clientX, touch.clientY);
                                if (el && (el as HTMLElement).dataset && (el as HTMLElement).dataset.wordIdx) {
                                    const idx = parseInt((el as HTMLElement).dataset.wordIdx!, 10);
                                    if (!isNaN(idx)) handleWordEnter(idx);
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
            {highlightedIndices.length > 1 && (
                <Box sx={{ position: 'absolute', mt: 1, zIndex: 10 }}>
                    {/* TODO: Replace with actual actions */}
                    <Paper elevation={3} sx={{ p: 1, display: 'flex', gap: 1 }}>
                        <span>{highlightedIndices.length} words selected</span>
                        <IconButton size="small" onClick={clearSelection}>✕</IconButton>
                    </Paper>
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

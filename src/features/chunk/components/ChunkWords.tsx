import React, { memo, useRef } from 'react';
import { Box, Paper, useTheme } from '@mui/material';
import { MergeChunksTool } from '../tools';
import WordsToolbar from '../components/WordsToolbar';
import { getChunkComponentsStyles } from '../Chunk.styles'; import { useUIPreferencesStore } from 'store';
import { useWordSelection } from '../hooks/useWordSelection';
import type { ChunkType } from 'types';
export interface ChunkWordsProps {
    chunk: ChunkType;
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
    const containerRef = useRef<HTMLDivElement>(null);
    const textSizePx = useUIPreferencesStore(state => state.textSizePx);
    const fontFamily = useUIPreferencesStore(state => state.fontFamily);
    const lineHeight = useUIPreferencesStore(state => state.lineHeight);
    const theme = useTheme();
    const styles = getChunkComponentsStyles(theme);

    // Use custom hook for word selection logic
    const {
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
    } = useWordSelection(chunkIdx);

    // Extracted touch move handler for readability
    const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
        const touch = e.touches[0];
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (el && (el as HTMLElement).dataset && (el as HTMLElement).dataset.wordIdx) {
            const idx = parseInt((el as HTMLElement).dataset.wordIdx!.split('-')[1], 10);
            if (!isNaN(idx)) handleWordEnter(idx, e);
        }
    };

    // Extracted word rendering for readability
    const wordsElements = words.map((word, wordIdx) => {
        const isHighlighted = highlightedIndices.includes(wordIdx);
        return (
            <Box
                key={wordIdx}
                component="span"
                sx={[
                    styles.chunkWord,
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
                onTouchMove={handleTouchMove}
                onTouchEnd={handleWordUp}
                data-word-idx={`${chunkIdx}-${wordIdx}`}
            >
                {word}
            </Box>
        );
    });

    return (
        <Box ref={containerRef} sx={styles.wordsContainer}
            onMouseLeave={() => handleWordUp()}
        >
            {wordsElements}
            <Box component="span" sx={styles.chunkUndoIconButton}>
                <MergeChunksTool
                    chunkIndices={[chunkIdx, chunkIdx + 1]}
                    chunks={chunk ? [chunk] : undefined}
                />

            </Box>

            {/* Only one WordActionDialog, handles both single and multi-word selection */}
            <WordsToolbar
                anchorEl={dialogAnchor}
                onClose={handleToolbarClose}
                word={highlightedIndices.length > 1 ? highlightedIndices.map(i => words[i]).join(' ') : (selectedWordIdx !== null ? words[selectedWordIdx] : '')}
                wordIdx={highlightedIndices.length > 1 ? highlightedIndices[0] : (selectedWordIdx || 0)}
                chunkIdx={chunkIdx}
                chunk={chunk}
            />
        </Box>
    );
});

export default ChunkWords;

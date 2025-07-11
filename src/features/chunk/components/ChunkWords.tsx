// Contains the words for a chunk, allowing for word selection and actions
// Each word in the chunk can be selected, and actions can be performed on the selected words
// At the end of the chunk, there is a button to merge the current chunk with the next one

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
        selectionStartIdx, // Todo
        selectionEndIdx, // Todo
        isSelecting, // Todo
        dialogAnchor,
        selectedWordIdx,
        anchorEl, // Todo
        highlightedIndices,
        setAnchorEl, // Todo
        setSelectedWordIdx, // Todo
        handleWordDown,
        handleWordEnter,
        handleWordUp,
        handleToolbarClose,
    } = useWordSelection(chunkIdx);

    // Allows user to click and drag to select words
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
                />

            </Box>

            {/* Displays on word click or select */}
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

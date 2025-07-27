// Contains the words for a chunk, allowing for word selection and actions
// Each word in the chunk can be selected, and actions can be performed on the selected words
// At the end of the chunk, there is a button to merge the current chunk with the next one

import React, { memo, useRef } from 'react';
import { Box, Wrap } from '@chakra-ui/react';
import { MergeChunksTool } from 'features/chunk-merge';
import WordsToolbar from '../components/WordsToolbar';
import { useUserConfig } from 'services/userConfigService';
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
    const { data: userConfig } = useUserConfig();
    const uiPrefs = userConfig?.uiPreferences || {};
    const textSizePx = uiPrefs.textSizePx ?? 28;
    const fontFamily = uiPrefs.fontFamily ?? 'Inter, sans-serif';
    const lineHeight = uiPrefs.lineHeight ?? 1.5;
    const paddingX = uiPrefs.paddingX ?? 0.3;


    // Use custom hook for word selection logic
    const {
        dialogAnchor,
        selectedWordIdx,
        highlightedIndices,
        handleWordDown,
        handleWordEnter,
        handleWordUp,
        handleToolbarClose,
        handleTouchMove,
    } = useWordSelection(chunkIdx);

    // Extracted word rendering for readability
    const wordsElements = words.map((word, wordIdx) => {
        const isHighlighted = highlightedIndices.includes(wordIdx);
        return (
            <Box
                key={wordIdx}
                paddingX={`${paddingX}rem`}
                onMouseDown={e => handleWordDown(wordIdx, e)}
                onMouseEnter={e => handleWordEnter(wordIdx, e)}
                onMouseUp={handleWordUp}
                onTouchStart={e => handleWordDown(wordIdx, e)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleWordUp}
                data-word-idx={`${chunkIdx}-${wordIdx}`}
                _hover={{ bg: "primary", cursor: "pointer" }}
            >
                {word}
            </Box>
        );
    });

    return (
        <Box ref={containerRef} onMouseLeave={() => handleWordUp()}>
            <Wrap>
                {wordsElements}
                <MergeChunksTool
                    chunkIndices={[chunkIdx, chunkIdx + 1]} />
            </Wrap>

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

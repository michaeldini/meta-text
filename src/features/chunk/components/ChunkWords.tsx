// Contains the words for a chunk, allowing for word selection and actions
// Each word in the chunk can be selected, and actions can be performed on the selected words
// At the end of the chunk, there is a button to merge the current chunk with the next one

import React, { memo, useCallback, useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import BaseDrawer from '@components/drawer/BaseDrawer';

import InteractiveText from './InteractiveText';
import WordsToolbar from './WordsToolbar';

import { MergeChunksTool } from '@features/chunk-merge/MergeChunksTool';
import { useWordSelection } from '../hooks/useWordSelection';
import type { ChunkType } from '@mtypes/documents';
import { uiPreferences } from '@mtypes/user';

export interface ChunkWordsProps {
    chunk: ChunkType;
    chunkIdx: number;
    uiPreferences: uiPreferences;
}
/**
 * A container for the interactive text in a chunk
 */
const ChunkWords = memo(function ChunkWords({
    chunk,
    chunkIdx,
    uiPreferences
}: ChunkWordsProps) {

    const textSizePx = uiPreferences.textSizePx ?? 28;
    const fontFamily = uiPreferences.fontFamily ?? 'Inter, sans-serif';
    const lineHeight = uiPreferences.lineHeight ?? 1.5;
    const paddingX = uiPreferences.paddingX ?? 0.3;
    const color = 'gray.400';

    // Selection state and handlers from shared hook. The hook now accepts
    // the chunk so it can compute and expose `words` directly.
    const {
        words, // The array of words in the chunk
        selectedWordIndices, // The indices of the selected words
        selectedWords, // The selected words as a string
        handleWordDown,
        handleWordEnter,
        handleWordUp,
        clearSelection,
    } = useWordSelection(chunk);

    const [drawerOpen, setDrawerOpen] = useState(false);

    // Close drawer and clear selection
    const closeDrawer = useCallback(() => {
        setDrawerOpen(false);
        clearSelection();
    }, [clearSelection]);

    // React to finalized selection from the hook instead of opening the
    // drawer inside the pointer handler. This keeps selection logic in the
    // hook and UI reactions here.
    useEffect(() => {
        if (selectedWords && selectedWords.length > 0 && selectedWordIndices.length > 0) {
            setDrawerOpen(true);
        }
    }, [selectedWords, selectedWordIndices]);

    return (
        <Box as="div" padding={4} width="100%" data-chunk-id={`chunk-${chunkIdx}`}
        >
            <Flex as="div" flexWrap="wrap" gap={0} color={color}>
                <InteractiveText
                    words={words}
                    chunkIdx={chunkIdx}
                    selectedWordIndices={selectedWordIndices}
                    textSizePx={textSizePx}
                    lineHeight={lineHeight}
                    fontFamily={fontFamily}
                    paddingX={paddingX}
                    onWordDown={handleWordDown}
                    onWordEnter={handleWordEnter}
                    onWordUp={handleWordUp}
                />
                <Box as="span" display="inline-block">
                    <MergeChunksTool chunk={chunk} />
                </Box>
            </Flex>

            <BaseDrawer
                open={drawerOpen}
                onClose={closeDrawer}
                title="Word Tools"
                placement="end"
                showCloseButton
            >
                {selectedWords && selectedWords.length > 0 && (
                    <WordsToolbar
                        onClose={closeDrawer}
                        word={selectedWords}
                        wordIdx={selectedWordIndices.length === 1 ? selectedWordIndices[0] : null}
                        chunk={chunk}
                    />
                )}
            </BaseDrawer>
        </Box>
    );
});

export default ChunkWords;

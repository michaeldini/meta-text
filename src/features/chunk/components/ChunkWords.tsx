// Contains the words for a chunk, allowing for word selection and actions
// Each word in the chunk can be selected, and actions can be performed on the selected words
// At the end of the chunk, there is a button to merge the current chunk with the next one

import React, { memo } from 'react';
import { Box } from '@chakra-ui/react/box';
import { Flex } from '@chakra-ui/react/flex';
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

    const words = React.useMemo(() => (
        chunk.text ? chunk.text.split(/\s+/) : []
    ), [chunk.text]);
    const textSizePx = uiPreferences.textSizePx ?? 28;
    const fontFamily = uiPreferences.fontFamily ?? 'Inter, sans-serif';
    const lineHeight = uiPreferences.lineHeight ?? 1.5;
    const paddingX = uiPreferences.paddingX ?? 0.3;
    const color = 'gray.400';

    // Selection state and handlers from shared hook
    const {
        highlightedIndices,
        handleWordDown,
        handleWordEnter,
        handleWordUp,
        clearSelection,
    } = useWordSelection(chunkIdx);

    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [selectedWords, setSelectedWords] = React.useState<{ word: string; wordIdx: number }[] | null>(null);

    // Open drawer synchronously on mouse up using current highlight
    const handleWordUpPatched = React.useCallback(() => {
        const indices = highlightedIndices;
        if (indices.length > 0) {
            setSelectedWords(indices.map(i => ({ word: words[i], wordIdx: i })));
            setDrawerOpen(true);
        }
        handleWordUp();
    }, [handleWordUp, highlightedIndices, words]);

    // Close drawer and clear selection
    const closeDrawer = React.useCallback(() => {
        setDrawerOpen(false);
        setSelectedWords(null);
        clearSelection();
    }, [clearSelection]);

    // Throttle pointer-enter selection events to reduce overhead on dense word lists
    const lastEnterTsRef = React.useRef(0);
    const THROTTLE_MS = 16; // ~60fps cap
    const throttledPointerEnter = React.useCallback((wordIdx: number, e: React.PointerEvent<HTMLElement>) => {
        const now = performance.now();
        if (now - lastEnterTsRef.current < THROTTLE_MS) return;
        lastEnterTsRef.current = now;
        // Pass PointerEvent directly to the handler
        handleWordEnter(wordIdx, e);
    }, [handleWordEnter]);

    return (
        <Box as="div" padding={4} width="100%" data-chunk-id={`chunk-${chunkIdx}`}
        >
            <Flex as="div" flexWrap="wrap" gap={0} color={color}>
                <InteractiveText
                    words={words}
                    chunkIdx={chunkIdx}
                    highlightedIndices={highlightedIndices}
                    textSizePx={textSizePx}
                    lineHeight={lineHeight}
                    fontFamily={fontFamily}
                    paddingX={paddingX}
                    onWordDown={handleWordDown}
                    onWordEnter={throttledPointerEnter}
                    onWordUp={handleWordUpPatched}
                // pointer-move handling is implemented at component level when needed
                />
                <Box as="span" display="inline-block">
                    <MergeChunksTool chunk={chunk} />
                </Box>
            </Flex>

            <BaseDrawer
                open={drawerOpen}
                onClose={closeDrawer}
                title="Word Tools"
                placement="bottom"
                maxW="100%"
                contentProps={{ style: { minHeight: '220px', marginBottom: '64px' } }}
                bodyProps={{ style: { paddingBottom: 48 } }}
                showCloseButton
            >
                {selectedWords && selectedWords.length > 0 && (
                    <WordsToolbar
                        onClose={closeDrawer}
                        word={selectedWords.length > 1 ? selectedWords.map(w => w.word).join(' ') : selectedWords[0].word}
                        wordIdx={selectedWords[0].wordIdx}
                        chunk={chunk}
                    />
                )}
            </BaseDrawer>
        </Box>
    );
});

export default ChunkWords;

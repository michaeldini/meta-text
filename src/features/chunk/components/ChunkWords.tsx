// Contains the words for a chunk, allowing for word selection and actions
// Each word in the chunk can be selected, and actions can be performed on the selected words
// At the end of the chunk, there is a button to merge the current chunk with the next one

import React, { memo, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react/box';
import { Flex } from '@chakra-ui/react/flex';
import { Drawer } from '@chakra-ui/react/drawer';
import { MergeChunksTool } from 'features/chunk-merge';
import WordsToolbar from './WordsToolbar';
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



    // Word selection logic
    const {
        selectedWordIdx,
        highlightedIndices,
        handleWordDown,
        handleWordEnter,
        handleWordUp,
        handleToolbarClose,
        handleTouchMove,
    } = useWordSelection(chunkIdx);

    // Drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerSelection, setDrawerSelection] = useState<{ word: string; wordIdx: number }[] | null>(null);

    // Clear highlight if clicking outside the container
    React.useEffect(() => {
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

    // Only open drawer on mouseup/touchend (selection finalized)
    const selectionFinalizedRef = useRef(false);
    React.useEffect(() => {
        if (selectionFinalizedRef.current && highlightedIndices.length > 0) {
            setDrawerSelection(highlightedIndices.map(i => ({ word: words[i], wordIdx: i })));
            setDrawerOpen(true);
            selectionFinalizedRef.current = false;
        }
    }, [highlightedIndices, words]);

    // Patch handleWordUp to set selectionFinalizedRef
    const handleWordUpPatched = () => {
        selectionFinalizedRef.current = true;
        handleWordUp();
    };

    // Close drawer and clear selection
    const closeDrawer = () => {
        setDrawerOpen(false);
        setDrawerSelection(null);
        handleToolbarClose();
    };

    // Hover highlight state
    const [hoveredWordIdx, setHoveredWordIdx] = useState<number | null>(null);

    // Render words, highlight selected or hovered
    const wordsElements = words.map((word, wordIdx) => {
        const isHighlighted = highlightedIndices.includes(wordIdx) || hoveredWordIdx === wordIdx;
        return (
            <Box
                as="span"
                key={wordIdx}
                fontSize={`${textSizePx}px`}
                lineHeight={lineHeight}
                fontFamily={fontFamily}
                paddingX={paddingX}
                background={isHighlighted ? '#3182ce' : 'transparent'}
                color={isHighlighted ? 'white' : 'inherit'}
                // borderRadius={isHighlighted ? '4px' : undefined}
                cursor="pointer"
                userSelect="none"
                // transition="background 0.1s"
                display="inline-block"
                onMouseDown={e => handleWordDown(wordIdx, e)}
                onMouseEnter={e => { handleWordEnter(wordIdx, e); setHoveredWordIdx(wordIdx); }}
                onMouseLeave={() => setHoveredWordIdx(null)}
                onMouseUp={handleWordUpPatched}
                onTouchStart={e => handleWordDown(wordIdx, e)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleWordUpPatched}
                data-word-idx={`${chunkIdx}-${wordIdx}`}
            >
                {word}
            </Box>
        );
    });

    return (
        <Box as="div" ref={containerRef} padding={4} w="100%">
            <Flex as="div" flexWrap="wrap" gap={0}>
                {wordsElements}
                <Box as="span" display="inline-block">
                    <MergeChunksTool chunkIndices={[chunkIdx, chunkIdx + 1]} />
                </Box>
            </Flex>

            <Drawer.Root open={drawerOpen} onOpenChange={e => { if (!e.open) closeDrawer(); }} placement="bottom" size="md">
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content style={{ minHeight: '220px', marginBottom: '64px' }}>
                        <Drawer.Header>
                            <Drawer.Title>Word Tools</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body style={{ paddingBottom: 48 }}>
                            {drawerSelection && drawerSelection.length > 0 && (
                                <WordsToolbar
                                    onClose={closeDrawer}
                                    word={drawerSelection.length > 1 ? drawerSelection.map(w => w.word).join(' ') : drawerSelection[0].word}
                                    wordIdx={drawerSelection[0].wordIdx}
                                    chunkIdx={chunkIdx}
                                    chunk={chunk}
                                />
                            )}
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>
        </Box>
    );
});

export default ChunkWords;

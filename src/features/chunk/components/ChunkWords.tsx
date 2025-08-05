// Contains the words for a chunk, allowing for word selection and actions
// Each word in the chunk can be selected, and actions can be performed on the selected words
// At the end of the chunk, there is a button to merge the current chunk with the next one

import React, { memo } from 'react';
import { Box } from '@chakra-ui/react/box';
import { Flex } from '@chakra-ui/react/flex';
import { Drawer } from '@chakra-ui/react/drawer';
import { MergeChunksTool } from '@features/chunk-merge/MergeChunksTool';
import { useUserConfig } from '@services/userConfigService';
import type { ChunkType } from '@mtypes/documents';
import WordsToolbar from './WordsToolbar';
import { useChunkWords } from '../hooks/useChunkWords';
export interface ChunkWordsProps {
    chunk: ChunkType;
    chunkIdx: number;
}

const ChunkWords = memo(function ChunkWords({
    chunk,
    chunkIdx
}: ChunkWordsProps) {
    // Split words and get user config for UI
    const words = chunk.text ? chunk.text.split(/\s+/) : [];
    const { data: userConfig } = useUserConfig();
    const uiPrefs = userConfig?.uiPreferences || {};
    const textSizePx = uiPrefs.textSizePx ?? 28;
    const fontFamily = uiPrefs.fontFamily ?? 'Inter, sans-serif';
    const lineHeight = uiPrefs.lineHeight ?? 1.5;
    const paddingX = uiPrefs.paddingX ?? 0.3;


    // Define a stable handleToolbarClose function to pass to the hook
    // This is a no-op by default, but will be replaced by the hook's return value
    // to avoid use-before-declaration
    const [handleToolbarCloseState, setHandleToolbarCloseState] = React.useState<() => void>(() => () => { });
    const hookResult = useChunkWords({
        chunkIdx,
        words,
        handleToolbarClose: handleToolbarCloseState,
    });
    // Destructure after hook call
    const {
        selectedWordIdx,
        highlightedIndices,
        handleWordDown,
        handleWordEnter,
        handleWordUp,
        handleToolbarClose,
        handleTouchMove,
        drawerOpen,
        setDrawerOpen,
        drawerSelection,
        setDrawerSelection,
        closeDrawer,
        hoveredWordIdx,
        setHoveredWordIdx,
        containerRef,
    } = hookResult;
    // Update the stateful handleToolbarClose to always point to the latest from the hook
    React.useEffect(() => {
        setHandleToolbarCloseState(() => handleToolbarClose);
    }, [handleToolbarClose]);

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
        <Box as="div" ref={containerRef} padding={4} width="100%" data-chunk-id={`chunk-${chunkIdx}`}
        >
            <Flex as="div" flexWrap="wrap" gap={0}>
                {wordsElements}
                <Box as="span" display="inline-block">
                    <MergeChunksTool chunk={chunk} />
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

// Contains the words for a chunk, allowing for word selection and actions
// Each word in the chunk can be selected, and actions can be performed on the selected words
// At the end of the chunk, there is a button to merge the current chunk with the next one

import React, { memo } from 'react';
import { Box } from '@chakra-ui/react/box';
import { Flex } from '@chakra-ui/react/flex';
// Drawer logic replaced by shared BaseDrawer component
import BaseDrawer from '@components/drawer/BaseDrawer';
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
    // Split words only when chunk.text changes (avoid rebuilding on unrelated renders)
    const words = React.useMemo(() => (
        chunk.text ? chunk.text.split(/\s+/) : []
    ), [chunk.text]);
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
        // hoveredWordIdx,
        // setHoveredWordIdx,
        containerRef,
    } = hookResult;
    // Update the stateful handleToolbarClose to always point to the latest from the hook
    React.useEffect(() => {
        setHandleToolbarCloseState(() => handleToolbarClose);
    }, [handleToolbarClose]);

    // Precompute a Set for faster membership checks when many words
    const highlightedSet = React.useMemo(() => new Set(highlightedIndices), [highlightedIndices]);

    // Throttle pointer-enter selection events to reduce overhead on dense word lists
    const lastEnterTsRef = React.useRef(0);
    const THROTTLE_MS = 16; // ~60fps cap
    const throttledPointerEnter = React.useCallback((wordIdx: number, e: React.PointerEvent) => {
        const now = performance.now();
        if (now - lastEnterTsRef.current < THROTTLE_MS) return;
        lastEnterTsRef.current = now;
        // Cast to any to satisfy hook if it expects Mouse/Touch event; pointer event carries needed data
        handleWordEnter(wordIdx, e as any);
    }, [handleWordEnter]);

    // Render words; rely on CSS :hover for transient hover styling to avoid extra React state updates
    const wordsElements = words.map((word, wordIdx) => {
        const isHighlighted = highlightedSet.has(wordIdx);
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
                cursor="pointer"
                userSelect="none"
                display="inline-block"
                onPointerDown={e => handleWordDown(wordIdx, e as any)}
                // Use pointer enter (works for mouse, stylus) with throttling for drag/hover selection logic
                onPointerEnter={e => throttledPointerEnter(wordIdx, e)}
                onPointerUp={handleWordUp as any}
                // Touch fallback in case pointer events are not supported (legacy)
                onTouchStart={e => handleWordDown(wordIdx, e)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleWordUp}
                data-word-idx={`${chunkIdx}-${wordIdx}`}
                _hover={!isHighlighted ? { background: '#3182ce', color: 'white' } : undefined}
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
                {drawerSelection && drawerSelection.length > 0 && (
                    <WordsToolbar
                        onClose={closeDrawer}
                        word={drawerSelection.length > 1 ? drawerSelection.map(w => w.word).join(' ') : drawerSelection[0].word}
                        wordIdx={drawerSelection[0].wordIdx}
                        chunk={chunk}
                    />
                )}
            </BaseDrawer>
        </Box>
    );
});

export default ChunkWords;

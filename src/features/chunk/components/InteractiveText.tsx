// Renders interactive word spans with pointer/touch handlers and highlight styling
// Extracted from ChunkWords to keep parent lean and focused on data/state

import React, { memo } from 'react';
import { Box } from '@chakra-ui/react/box';

export interface InteractiveTextProps {
    words: string[];
    chunkIdx: number;
    highlightedIndices: number[];
    textSizePx: number;
    lineHeight: number | string;
    fontFamily: string;
    paddingX: number;
    onWordDown: (
        wordIdx: number,
        e: React.PointerEvent<HTMLElement>
    ) => void;
    onWordEnter: (wordIdx: number, e: React.PointerEvent<HTMLElement>) => void;
    onWordUp: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerMove?: React.PointerEventHandler<HTMLElement>;
}

const InteractiveText = memo(function InteractiveText({
    words,
    chunkIdx,
    highlightedIndices,
    textSizePx,
    lineHeight,
    fontFamily,
    paddingX,
    onWordDown,
    onWordEnter,
    onWordUp,
    onPointerMove,
}: InteractiveTextProps) {
    const highlightedSet = React.useMemo(() => new Set(highlightedIndices), [highlightedIndices]);

    return (
        <>
            {words.map((word, wordIdx) => {
                const isHighlighted = highlightedSet.has(wordIdx);
                return (
                    <Box
                        as="span"
                        key={wordIdx}
                        fontSize={`${textSizePx}px`}
                        lineHeight={lineHeight}
                        fontFamily={fontFamily}
                        paddingX={paddingX}
                        color={isHighlighted ? 'white' : undefined}
                        cursor="pointer"
                        userSelect="none"
                        display="inline-block"
                        onPointerDown={(e) => onWordDown(wordIdx, e)}
                        onPointerEnter={(e) => onWordEnter(wordIdx, e)}
                        onPointerUp={onWordUp}
                        onPointerMove={onPointerMove}
                        data-word-idx={`${chunkIdx}-${wordIdx}`}
                        _hover={!isHighlighted ? { color: 'white' } : undefined}
                    >
                        {word}
                    </Box>
                );
            })}
        </>
    );
});

export default InteractiveText;
